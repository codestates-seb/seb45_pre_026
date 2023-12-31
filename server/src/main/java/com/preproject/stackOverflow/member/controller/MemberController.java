package com.preproject.stackOverflow.member.controller;

import com.preproject.stackOverflow.dto.MultiResponseDto;
import com.preproject.stackOverflow.dto.PageInfo;
import com.preproject.stackOverflow.member.dto.MemberDto;
import com.preproject.stackOverflow.member.entity.Member;
import com.preproject.stackOverflow.member.mapper.MemberMapper;
import com.preproject.stackOverflow.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import javax.validation.Valid;
import javax.validation.constraints.Positive;
import java.net.URI;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/member")
@Validated
@Slf4j
public class MemberController {
    private final MemberService memberService;
    private final MemberMapper mapper;

    @PostMapping("/join")
    public ResponseEntity postMember(@Valid @RequestBody MemberDto.Post requestBody) {
        Member createdMember = memberService.createMember(mapper.memberPostToMember(requestBody));

        URI location = UriComponentsBuilder
                .newInstance()
                .path("/{member-id}")
                .buildAndExpand(createdMember.getMemberId())
                .toUri();
        return ResponseEntity.created(location).build();
    }

    @PatchMapping("/update/{member-id}")
    public ResponseEntity patchMember(@PathVariable("member-id") @Positive long memberId,
                                      @Valid @RequestBody MemberDto.Patch requestBody) {
        requestBody.setMemberId(memberId);
        Member updatedMember = memberService.updateMember(mapper.memberPatchToMember(requestBody));

        return new ResponseEntity(mapper.memberToMemberResponseDTO(updatedMember), HttpStatus.OK);
    }

    @GetMapping("/detail/{member-id}")
    public ResponseEntity getMember(@PathVariable("member-id") @Positive long memberId) {
        Member findMember = memberService.findMember(memberId);
        MemberDto.Response memberResponse = mapper.memberToMemberResponseDTO(findMember);

        return new ResponseEntity(memberResponse, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity getMembers(@Positive @RequestParam int page,
                                     @Positive @RequestParam int size) {
        Page<Member> pageMembers = memberService.findMembers(page - 1, size);
        List<Member> members = pageMembers.getContent();
        return new ResponseEntity<>(
                new MultiResponseDto<>(mapper.membersToMemberResponses(members),
                        (PageInfo) pageMembers),
                HttpStatus.OK);
    }
    @DeleteMapping("/delete/{member-id}")
    public ResponseEntity deleteMember(@PathVariable("member-id") @Positive long memberId) {
        memberService.deleteMember(memberId);

        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }
}
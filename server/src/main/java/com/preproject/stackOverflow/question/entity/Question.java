package com.preproject.stackOverflow.question.entity;



import com.preproject.stackOverflow.answer.entity.Answer;

import com.preproject.stackOverflow.member.entity.Member;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@NoArgsConstructor
@Getter
@Setter
@Entity
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long questionId;


    @Column(nullable = false)
    private String title;


    @Column(nullable = false)
    private String content;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "memberId")
    private Member member;

    public void setMember(Member member){
        this.member = member;
    }

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
    private List<Answer> answerList = new ArrayList<>();


    @Column(nullable = true)
    private long vote;

    public void setVote(long vote){
        this.vote = vote;
    }

    @Column(nullable = true)
    private String tag;


    @ElementCollection
    public List<Long> upVotedMemberId = new ArrayList<>();

    @ElementCollection
    public List<Long> downVotedMemberId = new ArrayList<>();





    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "QUESTION_TAG_LIST", joinColumns = @JoinColumn(name = "QUESTION_ID"))
    @Column(nullable = true, name = "TAG_LIST")
    private List<String> tags;


    @Column(nullable = false, updatable = false, name = "CREATED_AT")
    private LocalDateTime createdAt = LocalDateTime.now();


    @Column(nullable = false, name = "LAST_MODIFIED_AT")
    private LocalDateTime modifiedAt = LocalDateTime.now();




    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionStatus questionStatus = QuestionStatus.QUESTION_ASKED;


    public enum QuestionStatus {
        QUESTION_ASKED("asked"),
        QUESTION_MODIFIED("modified");

        @Getter
        private String inquireStatus;

        QuestionStatus(String inquireStatus) {
            this.inquireStatus = inquireStatus;
        }
    }
}
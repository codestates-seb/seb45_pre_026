import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import '../css/questionRegister.css';
import pencil from '../images/pencil.png';

export default function QuestionRegister() {
  const [title, setTitle] = useState('');
  const [isTitleEmpty, setIsTitleEmpty] = useState(false);
  const [body, setBody] = useState('');
  const [isBodyEmpty, setIsBodyEmpty] = useState(false);
  const navigate = useNavigate();
  const [tagsList, setTagsList] = useState([]);
  const memberId = window.localStorage.getItem('memberId');
  const cookies = new Cookies();
  const getCookie = cookies.get('is_login');

  const handleAddTag = (tag) => {
    if (!tagsList.includes(tag)) {
      return setTagsList([...tagsList, tag]);
    }
  };

  const handleMinusTag = (tag) =>
    setTagsList(
      tagsList.filter((el) => {
        return el !== tag;
      }),
    );

  const tags = [
    'html',
    'css',
    'javascript',
    'react',
    'redux',
    'axios',
    'eslint',
    'prettier',
    'java',
    'spring',
    'spring boot',
    'spring security',
    'mysql',
    'aws',
  ];

  function handleTitleChange(e) {
    setTitle(e.target.value);

    if (title !== '') setIsTitleEmpty(false);
  }

  function handleBodyChange(e) {
    if (e.target.value === '') setBody('');
    else {
      let bodyContent =
        '<p>' + e.target.value.replace(/\n/g, '</p>\n<p>') + '</p>';
      setBody(bodyContent);
    }

    if (body !== '') setIsBodyEmpty(false);
  }

  function handleQuestionSubmit() {
    setIsTitleEmpty(false);
    setIsBodyEmpty(false);

    if (title === '') setIsTitleEmpty(true);
    if (body === '') setIsBodyEmpty(true);
    console.log(tagsList);

    if (!isTitleEmpty && !isBodyEmpty) {
      QuestionRegister();
    }
  }

  function handleDiscardClick() {
    if (
      window.confirm(
        'Are you sure you want to discard this question? This cannot be undone.',
      )
    ) {
      navigate('/questions');
    }
  }

  const QuestionRegister = () => {
    return axios
      .post(
        `http://13.124.11.238:8080/question/questions?memberId=${memberId}`,
        {
          title: title,
          content: body,
          tag: tagsList,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: getCookie,
          },
        },
      )
      .then(() => {
        alert('Your questions has been successfully posted.');
        navigate('/questions');
        window.location.reload(true);
      })
      .catch(() => alert('Something went wrong. Please try again.'));
  };

  return (
    <div className="register__bg">
      <div className="register__wrap">
        <div className="register__title">Ask a public question</div>
        <div className="register__main-wrap">
          <div className="register__main">
            <div className="register__input-container">
              <div className="register__title-container">
                <div className="register__input-title">Title</div>
                <div className="register__input-desc">
                  Be specific and imagine you&apos;re asking a question to
                  another person.
                </div>
                <input
                  type="text"
                  placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
                  className={
                    isTitleEmpty
                      ? 'input input-red register__title-input'
                      : 'input input-gray register__title-input'
                  }
                  onChange={(e) => handleTitleChange(e)}
                ></input>
                {isTitleEmpty ? (
                  <div className="register__warning">
                    Title cannot be empty.
                  </div>
                ) : null}
              </div>
            </div>
            <div className="register__input-container">
              <div className="register__title-container">
                <div className="register__input-title">Body</div>
                <div className="register__input-desc">
                  The body of your question contains your problem details and
                  results.
                </div>
                <textarea
                  className={
                    isBodyEmpty
                      ? 'input input-red register__title-input register__body-input'
                      : 'input input-gray register__title-input register__body-input'
                  }
                  onChange={(e) => handleBodyChange(e)}
                ></textarea>
                {isBodyEmpty ? (
                  <div className="register__warning">Body cannot be empty.</div>
                ) : null}
              </div>
            </div>
            {/* 태그 추가 */}
            <div className="tag_form">
              <div>
                <div className="tag-title">List of tags you added</div>
                <div className="register__tag-title">
                  {tagsList.map((el, index) => (
                    <button
                      key={index}
                      className="tag"
                      onClick={() => handleMinusTag(el)}
                    >
                      {el}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="tag-title second">Tag List</div>
                <div className="register__tag-title">
                  {tags.map((el, index) => (
                    <button
                      key={index}
                      className="tag"
                      onClick={() => handleAddTag(el)}
                    >
                      {el}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* 태그 추가 */}
          </div>
          <div className="register__side">
            <div className="register__side-wrap">
              <div className="register__side-title">Writing a good title</div>
              <div className="register__side-content-wrap">
                <img
                  src={pencil}
                  alt="연필 그림"
                  className="register__side-img"
                />
                <div className="register__side-content">
                  Your title should summarize the problem. <br />
                  <br /> You might find that you have a better idea of your
                  title after writing out the rest of the question.
                </div>
              </div>
            </div>
            <div className="register__side-wrap">
              <div className="register__side-title">
                Proof-read before posting
              </div>
              <div className="register__side-content-wrap">
                <img
                  src={pencil}
                  alt="연필 그림"
                  className="register__side-img"
                />
                <div className="register__side-content">
                  Now that you&apos;re ready to post your question, read through
                  it from start to finish. Does it make sense? <br />
                  <br /> Add any details you missed and read through it again.
                  Now is a good time to make sure that your title still
                  describes the problem!
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="register__btn-container">
          <button
            className="button-dark register__post-btn"
            onClick={handleQuestionSubmit}
          >
            Post your question
          </button>
          <button className="register__cancel-btn" onClick={handleDiscardClick}>
            Discard draft
          </button>
        </div>
      </div>
    </div>
  );
}

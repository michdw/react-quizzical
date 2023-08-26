import React from "react";
import "./Quiz.css";
import { decode } from "html-entities";

export default function Quiz(props) {
  const [quiz, setQuiz] = React.useState();
  const [active, setActive] = React.useState(false);
  const dataFetchedRef = React.useRef(false);

  React.useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getNewQuiz();
  });

  function toggleActive() {
    setActive(!active);
    if (active) getNewQuiz();
    if (!active) toggleShowAnswers(true);
  }

  function getNewQuiz() {
    fetch("https://opentdb.com/api.php?amount=10").then((resp) =>
      resp
        .json()
        .then((data) => {
          setQuiz(data);
          console.log(data);
        })
        .catch((error) => console.log(error))
    );
    toggleShowAnswers(false);
  }

  function toggleShowAnswers(show) {
    const correctAnswers = document.querySelectorAll('[data-correct="true"]');
    correctAnswers.forEach((element) => {
      show
        ? element.classList.remove("unrevealed-option")
        : element.classList.add("unrevealed-option");
      show
        ? element.classList.add("correct-answer")
        : element.classList.remove("correct-answer");
    });
    const incorrectAnswers = document.querySelectorAll(
      '[data-correct="false"]'
    );
    incorrectAnswers.forEach((element) => {
      show
        ? element.classList.remove("unrevealed-option")
        : element.classList.add("unrevealed-option");
      show
        ? element.classList.add("incorrect-answer")
        : element.classList.remove("incorrect-answer");
    });
  }

  function getOptions(result, questionIndex) {
    let allOptions = [...result.incorrect_answers]
      .concat(result.correct_answer)
      .sort();
    return allOptions.map((option, index) => {
      let optionIndex = `${questionIndex}.${index}`;
      option = decode(option);
      return (
        <span key={index} className="option unrevealed-option">
          <label htmlFor={optionIndex} onClick={showChoice}>
            <input
              type="radio"
              name={questionIndex}
              id={optionIndex}
              value={optionIndex}
            />
            <i>{option}</i>
          </label>
        </span>
      );
    });
  }

  const showChoice = ((event) => {
    
  })

  const quizData = dataFetchedRef.current ? (
    quiz.results.map((result, index) => (
      <div key={index}>
        <p className="question">{decode(result.question)}</p>
        <div>
          <div>{getOptions(result, index)}</div>
        </div>
      </div>
    ))
  ) : (
    <div>loading</div>
  );

  const actionButton = () => {
    let btnText = active ? "start new quiz" : "show answers";
    return (
      <button disabled={!dataFetchedRef.current} onClick={toggleActive}>
        {btnText}
      </button>
    );
  };

  return (
    <div className="quizPage">
      <h1>quiz page</h1>
      {quizData}
      <div className="navigation">
        {actionButton()}
        <button onClick={props.loadStartPage}>Home</button>
      </div>
    </div>
  );
}

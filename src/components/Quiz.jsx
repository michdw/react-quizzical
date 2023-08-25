import React from "react";
import "./Quiz.css";
import {decode} from "html-entities"

export default function Quiz(props) {
  const [quiz, setQuiz] = React.useState();
  const [active, setActive] = React.useState(false);
  const dataFetchedRef = React.useRef(false);

  const toggleActive = () => {
    setActive(!active);
    if (active) getNewQuiz();
    if (!active) revealAnswers(true);
  };

  React.useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getNewQuiz();
  }, []);

  function getNewQuiz() {
    fetch("https://opentdb.com/api.php?amount=10").then((resp) =>
      resp
        .json()
        .then((data) => {
          setQuiz(data);
          console.log(data)
        })
        .catch((error) => console.log(error))
    );
    revealAnswers(false)
  }

  function revealAnswers(show) {
    const correctAnswers = document.querySelectorAll('[data-correct="true"]');
    correctAnswers.forEach((element) => {
      show ? element.classList.remove("unrevealed-option") : element.classList.add("unrevealed-option")
      show ? element.classList.add("correct-answer") : element.classList.remove("correct-answer")
    });
    const incorrectAnswers = document.querySelectorAll('[data-correct="false"]');
    incorrectAnswers.forEach((element) => {
      show ? element.classList.remove("unrevealed-option") : element.classList.add("unrevealed-option")
      show ? element.classList.add("incorrect-answer") : element.classList.remove("incorrect-answer")
    });
  }

  function getOptions(result) {
    let allOptions = [...result.incorrect_answers]
      .concat(result.correct_answer)
      .sort();
    return allOptions.map((option, index) => {
      option = decode(option)
      return (
        <span key={index}
          className="option unrevealed-option"
          data-correct={option === result.correct_answer ? "true" : "false"}
        >
          {option}
        </span>
      );
    });
  }

  const quizData = dataFetchedRef.current ? (
    quiz.results.map((result, index) => (
      <div key={index}>
        <p className="question">{decode(result.question)}</p>
        <div>
          <div>{getOptions(result)}</div>
        </div>
      </div>
    ))
  ) : (
    <div>loading</div>
  );

  const actionButton = () => {
    let btnText = active ? "start new quiz" : "show answers";
    return <button disabled={!dataFetchedRef.current} onClick={toggleActive}>{btnText}</button>;
  };

  return (
    <div className="quizPage">
      <h1>quiz page</h1>
      {quizData}
      {actionButton()}
      <button onClick={props.loadStartPage}>Home</button>
    </div>
  );
}

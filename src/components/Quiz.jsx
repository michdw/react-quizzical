import React from "react";
import "./Quiz.css";
import { decode } from "html-entities";

export default function Quiz(props) {
  const [quiz, setQuiz] = React.useState();
  const [active, setActive] = React.useState(false);
  const [selections, setSelections] = React.useState(props.userSelections);
  const dataFetchedRef = React.useRef(false);



  React.useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getNewQuiz();
  });

  const updateUserChoice = (questionIndex, index) => {
    setSelections((prevSelections) => {
      const newSelections = [...prevSelections];
      newSelections[questionIndex] = index;
      console.log(selections)
      return newSelections;
    });
  };

  function toggleActive() {
    setActive(!active);
    if (active) getNewQuiz();
    if (!active) showAnswers();
  }

  function getNewQuiz() {
    fetch(`https://opentdb.com/api.php?amount=${props.quizLength}`).then((resp) =>
      resp
        .json()
        .then((data) => {
          setQuiz(data);
          console.log(data);
        })
        .catch((error) => console.log(error))
    );
  }

  function showAnswers() {
    const correctAnswers = document.querySelectorAll('[data-correct="true"]');
    const incorrectAnswers = document.querySelectorAll(
      '[data-correct="false"]'
    );
    correctAnswers.forEach((element) => {
      let cl = element.classList;
      cl.remove("unrevealed-option");
      cl.contains("selected-option") ? cl.add("selected-correct") : cl.add("correct-option")
      cl.remove("selected-option");
    });
    incorrectAnswers.forEach((element) => {
      let cl = element.classList;
      cl.remove("unrevealed-option");
      cl.contains("selected-option") ? cl.add("selected-incorrect") : cl.add("incorrect-option")
    });
  }

  function getOptions(result, questionIndex) {
    let allOptions = [...result.incorrect_answers]
      .concat(result.correct_answer)
      .sort();
    return allOptions.map((option, index) => {
      let optionIndex = `${questionIndex}.${index}`;
      return (
        <label
          className={`option ${
            selections[questionIndex] === index
              ? "selected-option"
              : "unrevealed-option"
          }`}
          key={optionIndex}
          htmlFor={optionIndex}
          data-correct={result.correct_answer === option}
          onClick={() => updateUserChoice(questionIndex, index)}
        >
          <input
            hidden
            type="radio"
            name={questionIndex}
            id={optionIndex}
            value={option}
          />
          <i>{decode(option)}</i>
        </label>
      );
    });
  }

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

import React from "react";
import "./Quiz.css";
import { decode } from "html-entities";

export default function Quiz(props) {
  const userSelections = () => refreshSelections();
  //state
  const [quiz, setQuiz] = React.useState();
  const [complete, setComplete] = React.useState(false);
  const [selections, setSelections] = React.useState(userSelections);
  const [score, setScore] = React.useState(0);
  //ref
  const dataFetchedRef = React.useRef(false);
  //effect
  React.useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getNewQuiz();
  });

  function updateUserChoice(questionIndex, index) {
    setSelections((prevSelections) => {
      const newSelections = [...prevSelections];
      newSelections[questionIndex] = index;
      return newSelections;
    });
  }

  function refreshSelections() {
    const newSelections = [];
    for (let i = 0; i < props.quizLength; i++) {
      newSelections.push(null);
    }
    return newSelections;
  }

  function refreshOptionClasses() {
    const allOptions = document.getElementsByClassName("option");
    const optionsArray = [...allOptions];
    optionsArray.forEach((option) => {
      let cl = option.classList;
      cl.remove("selected-option");
      cl.remove("selected-correct");
      cl.remove("selected-incorrect");
      cl.remove("unselected-correct");
      cl.remove("unselected-incorrect");
      cl.remove("selected-incorrect");
      cl.add("unrevealed-option");
    });
  }

  function startQuiz() {
    setScore(0);
    getNewQuiz();
    setSelections(refreshSelections());
    refreshOptionClasses();
    setComplete(false)
  }

  function finishQuiz() {
    getScore();
    setComplete(true)
  }

  function getNewQuiz() {
    fetch(`https://opentdb.com/api.php?amount=${props.quizLength}`).then(
      (resp) =>
        resp
          .json()
          .then((data) => {
            setQuiz(data);
            console.log(data);
          })
          .catch((error) => console.log(error))
    );
  }

  function getScore() {
    const correctAnswers = document.querySelectorAll('[data-correct="true"]');
    const incorrectAnswers = document.querySelectorAll(
      '[data-correct="false"]'
    );
    correctAnswers.forEach((element) => {
      let cl = element.classList;
      cl.remove("unrevealed-option");
      if (cl.contains("selected-option")) {
        cl.add("selected-correct");
        setScore(score => score + 1)
      } else {
        cl.add("unselected-correct");
      }
    });
    incorrectAnswers.forEach((element) => {
      let cl = element.classList;
      cl.remove("unrevealed-option");
      cl.contains("selected-option")
        ? cl.add("selected-incorrect")
        : cl.add("unselected-incorrect");
    });
  }

  const showOptions = (result, questionIndex) => {
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
  };

  const quizData = dataFetchedRef.current ? (
    quiz.results.map((result, index) => (
      <div key={index}>
        <p className="question">{decode(result.question)}</p>
        <div>
          <div>{showOptions(result, index)}</div>
        </div>
      </div>
    ))
  ) : (
    <div>loading</div>
  );

  const startButton = () => {
    return <button onClick={startQuiz}>Start New Quiz</button>;
  };

  const showButton = () => {
    return <button onClick={finishQuiz} disabled={selections.includes(null)}>Show Answers</button>;
  };

  return (
    <div className="quizPage">
      <h1>quiz page</h1>
      {quizData}
      {complete && <p>{score} out of {props.quizLength}</p>}
      <div className="navigation">
        {complete ? startButton() : showButton()}
        <button onClick={props.loadStartPage}>Home</button>
      </div>
    </div>
  );
}

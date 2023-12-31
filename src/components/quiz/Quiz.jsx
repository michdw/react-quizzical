import React, { useState, useEffect } from "react";
import "./Quiz.css";
import { decode } from "html-entities";
import ClipLoader from "react-spinners/ClipLoader";

export default function Quiz(props) {
  const dataFetchedRef = React.useRef(false);

  const emptySelections = () => {
    const newSelections = [];
    for (let i = 0; i < props.quizLength; i++) {
      newSelections.push(null);
    }
    return newSelections;
  };

  //state
  const [quiz, setQuiz] = useState();
  const [options, setOptions] = useState([]);
  const [selections, setSelections] = useState(emptySelections);
  const [score, setScore] = useState(0);
  const [complete, setComplete] = useState(false);

  //effect
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
  });

  useEffect(() => {
    getNewQuiz();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //helper methods
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  //component methods
  function getNewQuiz() {
    fetch(`https://opentdb.com/api.php?amount=${props.quizLength}`).then(
      (resp) =>
        resp
          .json()
          .then((data) => {
            setQuiz(data);
            setOptions(
              data.results.map((result) => {
                let optionsArray = [...result.incorrect_answers].concat(
                  result.correct_answer
                );
                return result.type === "boolean"
                  ? optionsArray.sort().reverse()
                  : shuffleArray(optionsArray);
              })
            );
          })
          .catch((error) => console.log(error))
    );
  }

  function startQuiz() {
    hideAnswers();
    setSelections(emptySelections);
    setScore(0);
    getNewQuiz();
    setComplete(false);
    props.resetShapes();
  }

  function finishQuiz() {
    showAnswers();
    setComplete(true);
  }

  function updateSelection(qIndex, oIndex) {
    setSelections((prevSelections) => {
      const newSelections = [...prevSelections];
      newSelections[qIndex] = oIndex;
      return newSelections;
    });
  }

  function showAnswers() {
    const correctAnswers = document.querySelectorAll('[data-correct="true"]');
    const incorrectAnswers = document.querySelectorAll(
      '[data-correct="false"]'
    );
    correctAnswers.forEach((element) => {
      let cl = element.classList;
      cl.remove("unrevealed-option");
      if (cl.contains("selected-option")) {
        cl.add("selected-correct");
        setScore((score) => score + 1);
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

  function hideAnswers() {
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

  //elements
  const quizData =
    dataFetchedRef.current &&
    quiz.results.map((result, qIndex) => (
      <div key={qIndex} className="question-panel">
        <p className="question">{decode(result.question)}</p>
        <div>
          {options[qIndex].map((option, oIndex) => {
            let optionId = `${qIndex}.${oIndex}`;
            return (
              <label
                className={`option ${
                  selections[qIndex] === oIndex
                    ? "selected-option"
                    : "unrevealed-option"
                }`}
                key={optionId}
                htmlFor={optionId}
                data-correct={result.correct_answer === option}
                onClick={() => updateSelection(qIndex, oIndex)}
              >
                <input
                  hidden
                  type="radio"
                  name={`question-${qIndex}`}
                  id={optionId}
                  value={option}
                />
                <span className="option-text">{decode(option)}</span>
              </label>
            );
          })}
        </div>
        <hr></hr>
      </div>
    ));

  const loadingSpinner = (
    <ClipLoader
      color={"#293264"}
      cssOverride={{ margin: "3em" }}
      size={100}
      aria-label="Loading Spinner"
    />
  );

  const startButton = () => {
    return <button onClick={startQuiz}>Start New Quiz</button>;
  };

  const showButton = () => {
    return (
      <button onClick={finishQuiz} disabled={selections.includes(null)}>
        Show Answers
      </button>
    );
  };

  //
  return (
    <section className="Quiz">
      {dataFetchedRef.current ? quizData : loadingSpinner}
      <div className="quiz-footer">
        {complete && (
          <div className="score-info">
            You scored {score}/{props.quizLength} correct answers
          </div>
        )}
        <div className="quiz-navigation">
          {complete ? startButton() : showButton()}
          <button onClick={props.loadStartPage}>Home</button>
        </div>
      </div>
    </section>
  );
}

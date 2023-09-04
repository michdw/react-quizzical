import React from "react";
import "./Quiz.css";
import { decode } from "html-entities";

export default function Quiz(props) {
  const dataFetchedRef = React.useRef(false);

  //state
  const [quiz, setQuiz] = React.useState();
  const [options, setOptions] = React.useState([]);
  const [selections, setSelections] = React.useState(emptySelections);
  const [score, setScore] = React.useState(0);
  const [complete, setComplete] = React.useState(false);

  //effect
  React.useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
  });

  React.useEffect(() => {
    getNewQuiz();
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
                return shuffleArray(
                  [...result.incorrect_answers].concat(result.correct_answer)
                );
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
  }

  function finishQuiz() {
    getScore();
    setComplete(true);
  }

  function emptySelections() {
    const newSelections = [];
    for (let i = 0; i < props.quizLength; i++) {
      newSelections.push(null);
    }
    return newSelections;
  }

  function updateSelection(qIndex, oIndex) {
    setSelections((prevSelections) => {
      const newSelections = [...prevSelections];
      newSelections[qIndex] = oIndex;
      return newSelections;
    });
    console.log(selections)
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
  const quizData = dataFetchedRef.current ? (
    quiz.results.map((result, qIndex) => (
      <div key={qIndex}>
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
                <i>{decode(option)}</i>
              </label>
            );
          })}
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
    return (
      <button onClick={finishQuiz} disabled={selections.includes(null)}>
        Show Answers
      </button>
    );
  };

  //
  return (
    <div className="quizPage">
      <h1>quiz page</h1>
      {quizData}
      {complete && (
        <p>
          {score} out of {props.quizLength}
        </p>
      )}
      <div className="navigation">
        {complete ? startButton() : showButton()}
        <button onClick={props.loadStartPage}>Home</button>
      </div>
    </div>
  );
}

import React from "react";
import "./Quiz.css";
import { decode } from "html-entities";

export default function Quiz(props) {
  const userSelections = () => refreshSelections();
  const [quiz, setQuiz] = React.useState();
  const [active, setActive] = React.useState(false);
  const [selections, setSelections] = React.useState(userSelections);
  const dataFetchedRef = React.useRef(false);

  React.useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getNewQuiz();
  });

  function updateUserChoice(questionIndex, index) {
    setSelections((prevSelections) => {
      const newSelections = [...prevSelections];
      newSelections[questionIndex] = index;
      console.log(selections);
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
    const allOptions = document.getElementsByClassName("option")
    const optionsArray = [...allOptions];
    optionsArray.forEach((option) => {
      let cl = option.classList;
      cl.remove("selected-option");
      cl.remove("selected-correct");
      cl.remove("selected-incorrect");
      cl.remove("unselected-correct");
      cl.remove("unselected-incorrect");
      cl.remove("selected-incorrect");
      cl.add("unrevealed-option")
      console.log(cl)
    })
  }

  function toggleActive() {
    setActive(!active);
    if (active) {
      getNewQuiz();
      setSelections(refreshSelections());
      refreshOptionClasses();
    }
    if (!active) showAnswers();
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

  function showAnswers() {
    const correctAnswers = document.querySelectorAll('[data-correct="true"]');
    const incorrectAnswers = document.querySelectorAll(
      '[data-correct="false"]'
    );
    correctAnswers.forEach((element) => {
      let cl = element.classList;
      cl.remove("unrevealed-option");
      cl.contains("selected-option")
        ? cl.add("selected-correct")
        : cl.add("unselected-correct");
      cl.remove("selected-option");
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
  }

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

  const actionButton = () => {
    let startOrShow = active ? "start new quiz" : "show answers";
    return (
      <button disabled={!dataFetchedRef.current} onClick={toggleActive}>
        {startOrShow}
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

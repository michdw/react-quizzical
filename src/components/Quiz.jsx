import React from "react";

export default function Quiz(props) {
  const [quiz, setQuiz] = React.useState();
  const [complete, setComplete] = React.useState(false);
  const dataFetchedRef = React.useRef(false);

  const toggleComplete = () => {
    setComplete(!complete);
    if (complete) getNewQuiz();
  };

  const actionButton = () => {
    let btnText = complete ? "start new quiz" : "show answers";
    return <button onClick={toggleComplete}>{btnText}</button>;
  };

  function getNewQuiz() {
    fetch("https://opentdb.com/api.php?amount=10").then((resp) =>
      resp
        .json()
        .then((data) => {
          setQuiz(data);
          showQuizData(data);
        })
        .catch((error) => console.log(error))
    );
  }

  function showQuizData(data) {
    console.log(data.results[0].question);
  }

  React.useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getNewQuiz();
  }, []);

  return (
    <div className="quizPage">
      <h1>quiz page</h1>
      {actionButton()}
      <button onClick={props.loadStartPage}>Home</button>
    </div>
  );
}

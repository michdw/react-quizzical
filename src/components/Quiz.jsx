import React from "react";

export default function Quiz(props) {
  const [complete, setComplete] = React.useState(false);

  const toggleComplete = () => setComplete(!complete);

  const actionButton = () => {
    let btnText = complete ? "restart" : "show answers";
    return <button onClick={toggleComplete}>{btnText}</button>;
  };

  return (
    <div className="quizPage">
      <h1>quiz page</h1>
      {actionButton()}
      <button onClick={props.loadStartPage}>Back to Start</button>
    </div>
  );
}

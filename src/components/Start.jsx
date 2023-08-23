import React from "react";

export default function Start(props) {

  return (
    <div className="startPage">
      <h1>start page</h1>
      <button onClick={props.loadQuizPage}>Begin Quiz</button>
    </div>
  );
}

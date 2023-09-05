import React from "react";

export default function Start(props) {
  return (
    <div className="start-page">
      <h1 className="header">Quizzical</h1>
      <p className="subheader">Description of site here</p>
      <div className="navigation">
        <button className="start-btn" onClick={props.loadQuizPage}>Start quiz</button>
      </div>
    </div>
  );
}

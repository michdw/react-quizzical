import React from "react";
import "./Start.css";

export default function Start(props) {
  return (
    <section className="Start">
      <h1 className="header">Quizzical</h1>
      <p className="subheader">
        Created for the Learn React course on{" "}
        <a href="https://scrimba.com">Scrimba</a>
      </p>
      <div className="navigation">
        <button className="start-btn" onClick={props.loadQuizPage}>
          Start quiz
        </button>
      </div>
    </section>
  );
}

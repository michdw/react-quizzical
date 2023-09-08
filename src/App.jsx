import "./App.css";
import React, { useState, useEffect } from "react";
import Start from "./components/Start";
import Quiz from "./components/Quiz";
import Shape from "./components/Shape";

export default function App() {
  const [page, setPage] = useState("start");
  const [shapes, setShapes] = useState([]);
  const quizLength = 5;

  useEffect(() => generateShapes, []);

  const switchPage = function (switchTo) {
    generateShapes();
    switch (switchTo) {
      case "quiz":
        setPage("quiz");
        break;
      default:
        setPage("start");
    }
  };

  const getPage = () => {
    switch (page) {
      case "quiz":
        return quizPage;
      default:
        return startPage;
    }
  };

  const generateShapes = () => {
    let newShapes = [];
    for (let i = 0; i < 2; i++) {
      newShapes.push(<Shape key={i} index={i}></Shape>);
    }
    setShapes(newShapes);
  };

  const startPage = <Start loadQuizPage={() => switchPage("quiz")} />;

  const quizPage = (
    <Quiz quizLength={quizLength} loadStartPage={() => switchPage("start")} resetShapes={generateShapes} />
  );

  return (
    <div className="App">
      <div className="bgLayer">{shapes}</div>
      {getPage()}
    </div>
  );
}

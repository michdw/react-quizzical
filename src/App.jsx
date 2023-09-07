import "./App.css";
import React from "react";
import Start from "./components/Start";
import Quiz from "./components/Quiz";
import Shape from "./components/Shape";

export default function App() {
  const [page, setPage] = React.useState("start");
  const quizLength = 5;

  const switchPage = function (switchTo) {
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

  const startPage = <Start loadQuizPage={() => switchPage("quiz")} />;

  const quizPage = (
    <Quiz quizLength={quizLength} loadStartPage={() => switchPage("start")} />
  );

  const shapes = () => {
    let shapes = []
    for (let i = 0; i < 2; i++) {
      shapes.push(<Shape key={i} index={i}></Shape>)
    }
    return shapes;
  }

  return (
    <div className="App">
      <div className="bgLayer">
        {shapes()}
      </div>
      {getPage()}
    </div>
  );
}

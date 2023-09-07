import "./App.css";
import React from "react";
import Start from "./components/Start";
import Quiz from "./components/Quiz";
import Blob from "./components/Blob";

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

  return (
    <div className="App">
      <div className="bgLayer">
        <Blob fill="#FFFAD1" index={1}></Blob>
        <Blob fill="#DEEBF8" index={2}></Blob>
      </div>
      {getPage()}
    </div>
  );
}

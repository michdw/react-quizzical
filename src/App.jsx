import "./App.css";
import React from "react";

function App() {
  const [page, setPage] = React.useState("start");

  const switchPage = function (switchTo) {
    switch (switchTo) {
      case "quiz":
        setPage("quiz")
        break;
      default:
        setPage("start")
    }
  };

  const startPage = (
    <div className="startPage">
      <h1>start page</h1>
      <button onClick={() => switchPage("quiz")}>btn</button>
    </div>
  );

  const quizPage = (
    <div className="quizPage">
      <h1>quiz page</h1>
      <button onClick={() => switchPage("start")}>btn</button>
    </div>
  );

  const currentPage = () => {
    switch (page) {
      case "quiz":
        return quizPage;
      default:
        return startPage;
    }
  };

  return <div className="App">{currentPage()}</div>;
}

export default App;

import React from "react";
import "./App.css";
import IntroPage from "./components/IntroPage";
import Question from "./components/Question";
import Answer from "./components/Answer";
import { QuestionDataInterface } from "./Interfaces/QuestionDataInterface";
import { nanoid } from "nanoid";
import { AnswerStateInterface } from "./Interfaces/UserAnswerInterface";

function App() {
  const [startGame, setStartGame] = React.useState(false);
  const [correctAnswers, setCorrectAnswers] = React.useState<string[]>();
  const [endGameScore, setEndGameScore] = React.useState<string>();
  const [answersState, setAnswersState] =
    React.useState<AnswerStateInterface[]>();
  const UserAnswersArray = (data: any, answerArray: string[]) => {
    return {
      answers: answerArray.map((answer) => {
        return { text: answer, isHeld: false, id: nanoid() };
      }),
      question: data.question,
      id: nanoid(),
    };
  };
  const newUserAnswer = (data: any) => {
    const newUserAnswersArray: Array<AnswerStateInterface> = [];
    for (let i = 0; i < data.length; i++) {
      const scrambledAnswerArray = [
        data[i].correct_answer,
        ...data[i].incorrect_answers,
      ].sort(() => Math.random() - 0.5);
      newUserAnswersArray.push(UserAnswersArray(data[i], scrambledAnswerArray));
    }
    return newUserAnswersArray;
  };
  const holdAnswer = (questionId: string, answerId: string) => {
    setAnswersState(
      (oldAnswersState) =>
        oldAnswersState &&
        oldAnswersState.map((answerState) => {
          return answerState.id === questionId
            ? {
                ...answerState,
                answers: answerState.answers.map((answer) => {
                  return answer.id === answerId
                    ? { ...answer, isHeld: !answer.isHeld }
                    : { ...answer, isHeld: false };
                }),
              }
            : answerState;
        })
    );
  };

  const handleStartGame = (data: any) => {
    setAnswersState(newUserAnswer(data));
    setCorrectAnswers(data.map((question: any) => question.correct_answer));
    console.log(data);
  };

  function checkAnswer() {
    const userAnswers: string[] = [];
    let score = 0;
    if (answersState) {
      for (let i = 0; i < answersState.length; i++) {
        for (let j = 0; j < answersState[i].answers.length; j++) {
          if (correctAnswers)
            answersState[i].answers[j].isHeld &&
              correctAnswers.indexOf(answersState[i].answers[j].text) > -1 &&
              score++;
        }
      }
    }
    setEndGameScore("You scored " + score + "/5 correct answers");
  }
  React.useEffect(() => {
    fetch(
      "https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple"
    )
      .then((res) => res.json())
      .then((data) => {
        handleStartGame(data.results);
      });
  }, []);

  function playAgain() {
    fetch(
      "https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple"
    )
      .then((res) => res.json())
      .then((data) => {
        handleStartGame(data.results);
        setEndGameScore("");
      });
  }
  var decodeEntities = (function () {
    // this prevents any overhead from creating the object each time
    var element = document.createElement("div");

    function decodeHTMLEntities(str: any) {
      if (str && typeof str === "string") {
        // strip script/html tags
        str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gim, "");
        str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gim, "");
        element.innerHTML = str;
        str = element.textContent;
        element.textContent = "";
      }

      return str;
    }

    return decodeHTMLEntities;
  })();
  return (
    <div className="App">
      {!startGame && <IntroPage handleStartGame={() => setStartGame(true)} />}
      {startGame &&
        answersState &&
        answersState.map((answerState) => {
          return (
            <div className="questionRow">
              <Question question={decodeEntities(answerState.question)} />
              <div className="answerRow">
                {answerState &&
                  answerState.answers.map((answer: any) => {
                    return (
                      <Answer
                        answer={decodeEntities(answer.text)}
                        isHeld={answer.isHeld}
                        holdAnswer={() => holdAnswer(answerState.id, answer.id)}
                        endGame={endGameScore && true}
                        correctAnswers = {decodeEntities(correctAnswers)}
                      />
                    );
                  })}
              </div>
            </div>
          );
        })}
      {endGameScore && (
        <>
          
          <button className="btn" onClick={() => playAgain()}>
            Play again
          </button>
          <h2>{endGameScore}</h2>
        </>
      )}
      {startGame && !endGameScore && (
        <>
          <button className="btn" onClick={() => checkAnswer()}>
            Check answers
          </button>
        </>
      )}
    </div>
  );
}

export default App;

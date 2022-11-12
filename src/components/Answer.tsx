import styles from "../styles/Answer.module.css";
import React from "react";
export default function Answer(props: any) {
  return (
    <div className={styles.answerRow}>
      {props.endGame ?
        <button
          className={(props.correctAnswers.includes(props.answer) ? styles.btn_correct : props.isHeld?styles.btn_wrong:styles.btn_notclicked)}
          
        >
          {props.answer}{" "}
        </button>
        :
        <button
          className={props.isHeld ? styles.btn_clicked : styles.btn}
          onClick={props.holdAnswer}
        >
          {props.answer}{" "}
        </button>}
    </div>
  );
}

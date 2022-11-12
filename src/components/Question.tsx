import styles from "../styles/Question.module.css";

export default function Question(props: any) {
  return (
    <div>
      <p  className={styles.question}>{props.question}</p>
    </div>
  );
}

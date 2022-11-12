import styles from "../styles/IntroPage.module.css";
export default function IntroPage(props: any) {
  return (
    <div className={styles.main}>
      <p className={styles.title}>Quizzical</p>
      <h2>
        Answer questions about interesting but unimportant facts in many
        subjects!
      </h2>
      <button onClick={props.handleStartGame} className={styles.btn}>
        Start quiz
  </button>
    </div>
  );
}

export interface AnswerStateInterface {
  answers: { id: string; isHeld: boolean; text:string}[],
  question: string,
  id: string
}

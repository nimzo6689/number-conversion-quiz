export type QuestionType = "binary" | "hexadecimal";

export interface Question {
  value: string;
  type: QuestionType;
  answer: number;
}

export interface QuizResult {
  time: number;
  date: string;
}

export interface GameState {
  currentQuestion: number;
  questions: Question[];
  startTime: number | null;
  endTime: number | null;
  isComplete: boolean;
  answers: (number | null)[];
  correctCount: number;
}

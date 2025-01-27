// src/hooks/useGame.ts
import { useState, useCallback, useEffect } from 'react';
import type { GameState, Question, QuizResult } from '../types';

const TOTAL_QUESTIONS = 10;
const RANKINGS_KEY = 'number-quiz-rankings';

function generateQuestions(): Question[] {
  const questions: Question[] = [];
  
  // Generate 5 binary questions
  for (let i = 0; i < 5; i++) {
    const num = Math.floor(Math.random() * 256);
    questions.push({
      value: num.toString(2),
      type: 'binary',
      answer: num,
    });
  }
  
  // Generate 5 hexadecimal questions
  for (let i = 0; i < 5; i++) {
    const num = Math.floor(Math.random() * 256);
    questions.push({
      value: num.toString(16),
      type: 'hexadecimal',
      answer: num,
    });
  }
  
  // Shuffle questions
  return questions.sort(() => Math.random() - 0.5);
}

export function useGame() {
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 0,
    questions: generateQuestions(),
    startTime: null,
    endTime: null,
    isComplete: false,
    answers: new Array(TOTAL_QUESTIONS).fill(null),
    correctCount: 0,
  });
  
  const [rankings, setRankings] = useState<QuizResult[]>(() => {
    const stored = localStorage.getItem(RANKINGS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const startGame = useCallback(() => {
    setGameState({
      currentQuestion: 0,
      questions: generateQuestions(),
      startTime: Date.now(),
      endTime: null,
      isComplete: false,
      answers: new Array(TOTAL_QUESTIONS).fill(null),
    });
  }, []);

  const submitAnswer = useCallback((answer: number) => {
    setGameState((prev) => {
      const newAnswers = [...prev.answers];
      newAnswers[prev.currentQuestion] = answer;
      const isCorrect = answer === prev.questions[prev.currentQuestion].answer;
      const isLastQuestion = prev.currentQuestion === TOTAL_QUESTIONS - 1;

      // 最後の問題の場合、完了状態を設定
      if (isLastQuestion) {
        const allCorrect = newAnswers.every(
          (ans, idx) => ans === prev.questions[idx].answer
        );
        return {
          ...prev,
          answers: newAnswers,
          currentQuestion: prev.currentQuestion,
          correctCount: prev.correctCount + (isCorrect ? 1 : 0),
          endTime: Date.now(),
          isComplete: true
        };
      }

      // 最後の問題でない場合は次の問題へ
      return {
        ...prev,
        answers: newAnswers,
        currentQuestion: prev.currentQuestion + 1,
        correctCount: prev.correctCount + (isCorrect ? 1 : 0)
      };
    });
  }, []);

  useEffect(() => {
    if (gameState.isComplete && gameState.startTime && gameState.endTime) {
      const timeSpent = gameState.endTime - gameState.startTime;
      const newResult: QuizResult = {
        time: timeSpent,
        date: new Date().toISOString(),
      };

      const updatedRankings = [...rankings, newResult]
        .sort((a, b) => a.time - b.time)
        .slice(0, 5);

      setRankings(updatedRankings);
      localStorage.setItem(RANKINGS_KEY, JSON.stringify(updatedRankings));
    }
  }, [gameState.isComplete, gameState.startTime, gameState.endTime, rankings]);

  return {
    gameState,
    rankings,
    startGame,
    submitAnswer,
  };
}
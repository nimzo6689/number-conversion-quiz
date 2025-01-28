// src/hooks/useGame.ts
import { useState, useCallback, useRef } from 'react';
import type { GameState, Question, QuizResult } from '../types';

export const TOTAL_QUESTIONS = 4;
const RANKINGS_KEY = 'number-quiz-rankings';

function generateQuestions(): Question[] {
  const questions: Question[] = [];
  
  for (let i = 0; i < TOTAL_QUESTIONS / 2; i++) {
    const num = Math.floor(Math.random() * 256);
    questions.push({
      value: num.toString(2).padStart(8, '0').replace(/(.{4})/g, '$1 ').trim(),
      type: 'binary',
      answer: num,
    });
  }

  for (let i = 0; i < TOTAL_QUESTIONS / 2; i++) {
    const num = Math.floor(Math.random() * 256);
    questions.push({
      value: num.toString(16).toUpperCase().padStart(2, '0'),
      type: 'hexadecimal',
      answer: num,
    });
  }

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

  const hasRecordedResult = useRef(false);

  const startGame = useCallback(() => {
    hasRecordedResult.current = false;
    setGameState({
      currentQuestion: 0,
      questions: generateQuestions(),
      startTime: Date.now(),
      endTime: null,
      isComplete: false,
      answers: new Array(TOTAL_QUESTIONS).fill(null),
      correctCount: 0,
    });
  }, []);

  const submitAnswer = useCallback((answer: number) => {
    setGameState((prev) => {
      const newAnswers = [...prev.answers];
      newAnswers[prev.currentQuestion] = answer;
      const isCorrect = answer === prev.questions[prev.currentQuestion].answer;
      const isLastQuestion = prev.currentQuestion === TOTAL_QUESTIONS - 1;
      const newCorrectCount = prev.correctCount + (isCorrect ? 1 : 0);

      if (isLastQuestion) {
        const endTime = Date.now();
        
        // 全問正解の場合、ここでランキングを更新
        if (newCorrectCount === TOTAL_QUESTIONS && !hasRecordedResult.current && prev.startTime) {
          hasRecordedResult.current = true;
          const timeSpent = endTime - prev.startTime;
          const newResult: QuizResult = {
            time: timeSpent,
            date: new Date().toISOString(),
          };

          const updatedRankings = [...rankings]
            .concat(newResult)
            .sort((a, b) => a.time - b.time)
            .slice(0, 5);

          setRankings(updatedRankings);
          localStorage.setItem(RANKINGS_KEY, JSON.stringify(updatedRankings));
        }

        return {
          ...prev,
          answers: newAnswers,
          correctCount: newCorrectCount,
          endTime,
          isComplete: true
        };
      }

      return {
        ...prev,
        answers: newAnswers,
        currentQuestion: prev.currentQuestion + 1,
        correctCount: newCorrectCount
      };
    });
  }, [rankings]);

  return {
    gameState,
    rankings,
    startGame,
    submitAnswer,
  };
}
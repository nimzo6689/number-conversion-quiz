// src/App.tsx
import { useState } from 'react';
import { useGame } from './hooks/useGame';
import * as styles from './styles/app.css';

export default function App() {
  const { gameState, rankings, startGame, submitAnswer } = useGame();
  const [currentAnswer, setCurrentAnswer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAnswer = parseInt(currentAnswer, 10);
    if (!isNaN(numAnswer)) {
      submitAnswer(numAnswer);
      setCurrentAnswer('');
    }
  };

  const formatTime = (ms: number) => {
    return `${(ms / 1000).toFixed(2)}秒`;
  };

  if (!gameState.startTime) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>数値変換クイズ</h1>
        <p>2進数と16進数を10進数に変換する問題が各5問、ランダムな順序で出題されます。</p>
        <button className={styles.button} onClick={startGame}>
          開始
        </button>
        
        <div className={styles.rankingContainer}>
          <h2>ランキング</h2>
          {rankings.map((result, index) => (
            <div key={result.date} className={styles.rankingItem}>
              <span>{index + 1}位</span>
              <span>{formatTime(result.time)}</span>
              <span>{new Date(result.date).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentQuestion = gameState.questions[gameState.currentQuestion];
  const questionType = currentQuestion.type === 'binary' ? '2進数' : '16進数';

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>数値変換クイズ</h1>
      
      {gameState.isComplete ? (
        <div className={styles.questionContainer}>
          <h2>クイズ完了！</h2>
          <div className={styles.resultSummary}>
            <p>タイム: {formatTime(gameState.endTime! - gameState.startTime)}</p>
            <p>正答率: {(gameState.correctCount / 10 * 100).toFixed(1)}% ({gameState.correctCount}/10問正解)</p>
            {gameState.correctCount === 10 && (
              <p>
                ランキング: {
                  rankings.findIndex(r => r.time > (gameState.endTime! - gameState.startTime)) + 1 || rankings.length + 1
                }位
              </p>
            )}
            {gameState.correctCount < 10 && (
              <p className={styles.noteText}>※ランキングは全問正解時のみ記録されます</p>
            )}
          </div>
          <button className={styles.button} onClick={startGame}>
            もう一度チャレンジ
          </button>
        </div>
      ) : (
        <div className={styles.questionContainer}>
          <p>
            問題 {gameState.currentQuestion + 1} / 10:
            {questionType}の「{currentQuestion.value}」を10進数に変換してください
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="number"
              className={styles.input}
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              autoFocus
            />
            <button type="submit" className={styles.button}>
              回答
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
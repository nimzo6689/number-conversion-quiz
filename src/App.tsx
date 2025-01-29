// src/App.tsx
import { useState } from 'react';
import { useGame, TOTAL_QUESTIONS } from './hooks/useGame';
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
        <h1 className={styles.title}>基数変換クイズ</h1>
        <p>2進数と16進数を10進数に変換する問題が各2問、ランダムな順序で出題されます。</p>
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
        <div className={styles.notesContainer}>
          <p className={styles.noteText}>※ クイズを中断したい場合や、終了後この画面に戻りたい場合はWebページを更新してね。</p>
          <p className={styles.noteText}>※ ランキングをリセットさせたい場合は、LocalStorageに入っているから自分で削除してね。</p>
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
            <p>正答率: {(gameState.correctCount / TOTAL_QUESTIONS * 100).toFixed(1)}% ({gameState.correctCount}/{TOTAL_QUESTIONS}問正解)</p>
            {gameState.correctCount === TOTAL_QUESTIONS && (
              <p>
                ランキング: {
                  rankings.findIndex(r => r.time > (gameState.endTime! - (gameState.startTime ?? 0))) < 0 
                    ? (rankings.length === 1 ? rankings.length : rankings.length + 1)
                    : rankings.findIndex(r => r.time > (gameState.endTime! - (gameState.startTime ?? 0)))
                }位
              </p>
            )}
            {gameState.correctCount < TOTAL_QUESTIONS && (
              <>
                <p className={styles.noteText}>※ランキングは全問正解時のみ記録されます</p>
                <div className={styles.wrongAnswers}>
                  <h3>不正解の問題</h3>
                  {gameState.questions.map((question, index) => {
                    const userAnswer = gameState.answers[index];
                    if (userAnswer !== question.answer) {
                      const qType = question.type === 'binary' ? '2進数' : '16進数';
                      return (
                        <div key={index} className={styles.wrongAnswerItem}>
                          <p>問題{index + 1}: {qType}の「{question.value}」</p>
                          <p>あなたの回答: {userAnswer}</p>
                          <p>正解: {question.answer}</p>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </>
            )}
          </div>
          <button className={styles.button} onClick={startGame}>
            もう一度チャレンジ
          </button>
        </div>
      ) : (
        <div className={styles.questionContainer}>
          <p>
            問題 {gameState.currentQuestion + 1} / {TOTAL_QUESTIONS}:&nbsp;
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
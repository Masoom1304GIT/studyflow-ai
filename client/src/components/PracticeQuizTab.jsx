import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  AlertCircle, 
  ArrowRight,
  HelpCircle,
  Lightbulb,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PracticeQuizTab({ 
  quiz = [], 
  onQuizCompleted 
}) {
  const [userAnswers, setUserAnswers] = useState({}); // { questionIndex: optionIndex }
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionWarning, setSubmissionWarning] = useState('');

  if (!quiz || quiz.length === 0) {
    return (
      <div className="quiz-container">
        <div className="note-section-card" style={{ textAlign: 'center', padding: '40px' }}>
          <HelpCircle size={36} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
          <h3>No practice quiz available</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Unable to load questions for this study pack.</p>
        </div>
      </div>
    );
  }

  const optionLetters = ['A', 'B', 'C', 'D'];
  const answeredCount = Object.keys(userAnswers).length;
  const totalQuestions = quiz.length;

  const handleSelectOption = (questionIndex, optionIndex) => {
    if (isSubmitted) return; // Locked after submission
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
    setSubmissionWarning('');
  };

  const calculateScore = () => {
    let score = 0;
    quiz.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    if (answeredCount < totalQuestions) {
      setSubmissionWarning(`You have only answered ${answeredCount} of ${totalQuestions} questions. Please answer all questions before submitting!`);
      return;
    }

    setIsSubmitted(true);
    const finalScore = calculateScore();

    if (onQuizCompleted) {
      onQuizCompleted(finalScore, totalQuestions);
    }

    // Trigger confetti if high score
    if (finalScore >= 4) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback if canvas-confetti fails
      }
    }
  };

  const handleRetake = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setSubmissionWarning('');
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const score = isSubmitted ? calculateScore() : 0;
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="quiz-container animate-fade-in">
      {/* Quiz Header or Score Banner */}
      {!isSubmitted ? (
        <div className="quiz-header-card">
          <div className="quiz-header-info">
            <h2>Interactive Practice Quiz</h2>
            <p>Select your answers below. Results, score, and in-depth explanations will be revealed after submitting.</p>
          </div>
          <div className="quiz-progress-stats">
            <div className="answered-counter-pill">
              Answered: {answeredCount} / {totalQuestions}
            </div>
          </div>
        </div>
      ) : (
        <div className={`score-banner ${score < 3 ? 'needs-review' : ''}`}>
          <div className="score-main-group">
            <div className={`score-circle-gauge ${score < 3 ? 'needs-review' : ''}`}>
              <span className="gauge-value">{score}/{totalQuestions}</span>
              <span className="gauge-max">{percentage}%</span>
            </div>
            <div className="score-feedback-text">
              <h3>
                {score === 5 && '🌟 Perfect Score! Flawless Retention!'}
                {score === 4 && '🎉 Great Job! Solid Conceptual Grasp!'}
                {score === 3 && '👍 Good Effort! A Few Areas to Review.'}
                {score < 3 && '📖 Needs Revision! Review the Notes Below.'}
              </h3>
              <p>
                You answered {score} out of {totalQuestions} questions correctly.
                Detailed answer justifications and citations are displayed below.
              </p>
            </div>
          </div>

          <div className="score-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleRetake}
            >
              <RotateCcw size={16} />
              <span>Retake Quiz</span>
            </button>
          </div>
        </div>
      )}

      {/* 5 MCQ Cards */}
      <div className="questions-list">
        {quiz.map((q, qIdx) => {
          const userSelectedOption = userAnswers[qIdx];
          const isAnswered = userSelectedOption !== undefined;
          const isCorrect = isSubmitted && userSelectedOption === q.correctAnswer;
          const isIncorrect = isSubmitted && isAnswered && !isCorrect;

          let cardClass = 'question-card';
          if (isSubmitted) {
            cardClass += isCorrect ? ' correct-card' : ' incorrect-card';
          }

          return (
            <div key={q.id || qIdx} className={cardClass}>
              <div className="question-meta-row">
                <span className="question-number-badge">Question {qIdx + 1} of {totalQuestions}</span>
                {isSubmitted && (
                  <span className={`question-result-badge ${isCorrect ? 'correct' : 'incorrect'}`}>
                    {isCorrect ? (
                      <>
                        <CheckCircle2 size={14} /> Correct (+1)
                      </>
                    ) : (
                      <>
                        <XCircle size={14} /> Incorrect
                      </>
                    )}
                  </span>
                )}
              </div>

              <div className="question-text">{q.question}</div>

              <div className="options-list">
                {q.options.map((optionText, optIdx) => {
                  const isSelected = userSelectedOption === optIdx;

                  let optClass = 'option-btn';
                  if (isSelected) optClass += ' selected';

                  if (isSubmitted) {
                    if (optIdx === q.correctAnswer) {
                      optClass += ' answer-correct';
                    } else if (isSelected && optIdx !== q.correctAnswer) {
                      optClass += ' answer-wrong-user';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isSubmitted}
                      className={optClass}
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                    >
                      <div className="option-letter-box">
                        {optionLetters[optIdx]}
                      </div>
                      <div className="option-text">{optionText}</div>
                      {isSubmitted && optIdx === q.correctAnswer && (
                        <Check size={18} style={{ color: '#34D399', flexShrink: 0 }} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* In-depth explanation revealed strictly after submission */}
              {isSubmitted && (
                <div className="explanation-box animate-fade-in">
                  <div className="explanation-header">
                    <Lightbulb size={16} />
                    <span>Explanation & Reference</span>
                  </div>
                  <div className="explanation-text">{q.explanation}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quiz Submission Footer */}
      {!isSubmitted && (
        <div className="quiz-submit-bar">
          {submissionWarning && (
            <div className="upload-error animate-fade-in" style={{ width: '100%', maxWidth: '420px' }}>
              <AlertCircle size={16} />
              <span>{submissionWarning}</span>
            </div>
          )}
          <button
            type="button"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', maxWidth: '380px' }}
            onClick={handleSubmit}
          >
            <CheckCircle2 size={18} />
            <span>Submit Quiz & View Results</span>
          </button>
        </div>
      )}
    </div>
  );
}

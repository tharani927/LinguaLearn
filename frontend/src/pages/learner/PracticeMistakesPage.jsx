import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adaptiveApi } from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Award,
} from 'lucide-react';

const PracticeMistakesPage = () => {
  const [mistakes, setMistakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const fetchUnmasteredMistakes = async () => {
    try {
      const data = await adaptiveApi.getMistakes('mastered=false');
      setMistakes(data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnmasteredMistakes();
  }, []);

  const currentItem = mistakes[currentIndex];

  const handlePracticeSubmit = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await adaptiveApi.practiceMistake(currentItem.question_id, userAnswer.trim());
      setFeedback(res);

      if (res.isCorrect) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
        addToast('Correct! Mistake mastered and marked as conquered (+15 XP)', 'success');
      } else {
        addToast('Not quite right. Keep practicing this concept!', 'error');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setUserAnswer('');
    if (currentIndex < mistakes.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Re-fetch to see remaining unmastered
      fetchUnmasteredMistakes();
      setCurrentIndex(0);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-500">Loading your mistake practice session...</div>;
  }

  if (mistakes.length === 0) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm mt-12 space-y-4">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-500">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">All Mistakes Mastered!</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          You have conquered all pending mistakes in your vault. Keep learning new lessons to expand your proficiency.
        </p>
        <Link
          to="/courses"
          className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20"
        >
          <span>Explore Courses</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            Targeted Remediation Drill
          </span>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">
            Practice Item {currentIndex + 1} of {mistakes.length}
          </h1>
        </div>
        <Link to="/mistakes" className="text-xs font-bold text-slate-500 hover:underline">
          Exit Drill
        </Link>
      </div>

      {/* Drill Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
            {currentItem.skill_category?.replace('_', ' ')}
          </span>
          <span className="text-xs text-rose-500 font-bold">
            Missed {currentItem.mistake_count}x previously
          </span>
        </div>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
          {currentItem.prompt}
        </h2>

        {/* Options / Input */}
        {!feedback ? (
          <form onSubmit={handlePracticeSubmit} className="space-y-4">
            {currentItem.options ? (
              <div className="space-y-2">
                {currentItem.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setUserAnswer(opt)}
                    className={`w-full p-3.5 rounded-2xl text-left text-xs font-semibold border transition ${
                      userAnswer === opt
                        ? 'bg-brand-50 dark:bg-brand-950 border-brand-500 text-brand-700 dark:text-brand-300'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <input
                type="text"
                placeholder="Type the correct answer..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full px-4 py-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            )}

            <button
              type="submit"
              disabled={!userAnswer.trim() || submitting}
              className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20 disabled:opacity-50"
            >
              {submitting ? 'Checking...' : 'Check Answer & Master'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div
              className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                feedback.isCorrect
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-1">
                {feedback.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span>Conquered! Marked as Mastered (+15 XP)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-500" />
                    <span>Not quite right yet. Correct: {feedback.correctAnswer}</span>
                  </>
                )}
              </div>
              {feedback.explanation && (
                <p className="mt-2 text-[11px] italic">
                  Rule Note: {feedback.explanation}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20"
            >
              <span>Next Practice Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeMistakesPage;

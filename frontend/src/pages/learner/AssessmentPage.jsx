import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentApi } from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';
import {
  Clock,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

const AssessmentPage = () => {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const { addToast } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const data = await assessmentApi.getAssessment(id);
        setAssessment(data);
        setTimeLeft(data.time_limit_minutes * 60);
      } catch (err) {
        addToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, [id]);

  useEffect(() => {
    if (!assessment || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [assessment, timeLeft]);

  const handleSelectOption = (questionId, value) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const answersPayload = assessment.questions.map((q) => ({
        question_id: q.id,
        user_answer: userAnswers[q.id] || '',
      }));

      const result = await assessmentApi.submitAssessment(id, {
        answers: answersPayload,
        time_spent_seconds: assessment.time_limit_minutes * 60 - timeLeft,
      });

      addToast('Assessment completed! View your AI diagnosis.', 'success');
      navigate(`/assessments/result/${result.resultId}`);
    } catch (err) {
      addToast(err.message, 'error');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-500">Loading assessment questions...</div>;
  }

  if (!assessment || !assessment.questions || assessment.questions.length === 0) {
    return <div className="p-12 text-center text-xs text-rose-500">Assessment not available.</div>;
  }

  const currentQ = assessment.questions[currentIdx];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = Math.round(((currentIdx + 1) / assessment.questions.length) * 100);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      {/* Quiz Header */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
            Diagnostic Assessment
          </span>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
            {assessment.title}
          </h1>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 font-mono text-xs font-bold">
          <Clock className="w-4 h-4 text-amber-500" />
          <span>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-bold text-slate-500">
          <span>Question {currentIdx + 1} of {assessment.questions.length}</span>
          <span>{progressPercent}% Complete</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div className="h-full bg-brand-500 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
            {currentQ.skill_category.replace('_', ' ')}
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 capitalize">
            {currentQ.difficulty_level}
          </span>
          <span className="text-[11px] text-slate-400 ml-auto font-semibold">{currentQ.points} Pts</span>
        </div>

        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
          {currentQ.prompt}
        </h2>

        {/* Options / Answer Input */}
        {currentQ.question_type === 'fill_blank' ? (
          <div>
            <label className="block text-xs text-slate-500 mb-2">Type your answer below:</label>
            <input
              type="text"
              placeholder="e.g. gracias"
              value={userAnswers[currentQ.id] || ''}
              onChange={(e) => handleSelectOption(currentQ.id, e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        ) : (
          <div className="space-y-2.5">
            {currentQ.options?.map((opt, idx) => {
              const isSelected = userAnswers[currentQ.id] === opt;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(currentQ.id, opt)}
                  className={`w-full p-4 rounded-2xl text-left text-xs sm:text-sm font-semibold border transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-700 dark:text-brand-300 shadow-sm'
                      : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:border-brand-300'
                  }`}
                >
                  <span>{opt}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((prev) => prev - 1)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30"
          >
            ← Previous
          </button>

          {currentIdx < assessment.questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIdx((prev) => prev + 1)}
              className="flex items-center gap-1 px-5 py-2.5 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-md shadow-brand-500/20"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              <span>Submit &amp; Diagnose</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;

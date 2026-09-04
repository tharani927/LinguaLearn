import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { lessonApi } from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Volume2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

const LessonPage = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const fetchLesson = async () => {
    try {
      const data = await lessonApi.getLessonById(id);
      setLesson(data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLesson();
  }, [id]);

  const handleComplete = async () => {
    setCompleting(true);
    try {
      const res = await lessonApi.completeLesson(id);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
      });
      addToast(res.message || 'Lesson completed! +20 XP awarded', 'success');
      fetchLesson();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-500">Loading lesson material...</div>;
  }

  if (!lesson) {
    return <div className="p-12 text-center text-xs text-rose-500">Lesson not found.</div>;
  }

  const isCompleted = lesson.userProgress?.status === 'completed';

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
            {lesson.course_title} &bull; Lesson {lesson.order_index}
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {lesson.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">{lesson.description}</p>
        </div>

        <div className="flex items-center gap-2">
          {lesson.assessment && (
            <Link
              to={`/assessments/${lesson.assessment.id}`}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-md shadow-amber-500/20"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Take Quiz</span>
            </Link>
          )}

          <button
            onClick={handleComplete}
            disabled={completing || isCompleted}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl shadow-sm transition ${
              isCompleted
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 cursor-default'
                : 'bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/20'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Completed (+20 XP)' : 'Mark Completed'}</span>
          </button>
        </div>
      </div>

      {/* Lesson Content Body */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
        <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          {lesson.content}
        </div>

        {/* Grammar Breakdown Notes */}
        {lesson.grammar_notes && (
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/50 flex gap-3">
            <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300">
                Linguistic Grammar Note
              </h4>
              <p className="mt-1 text-xs text-amber-800/90 dark:text-amber-200/90 leading-relaxed">
                {lesson.grammar_notes}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Vocabulary Bank */}
      {lesson.vocabulary?.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-500" />
              <span>Vocabulary Bank &amp; Pronunciation</span>
            </h2>
            <span className="text-xs text-slate-500">{lesson.vocabulary.length} Words</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lesson.vocabulary.map((vocab) => (
              <div
                key={vocab.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-black text-brand-600 dark:text-brand-400">
                    {vocab.word}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    [{vocab.pronunciation || 'phonetic'}]
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                  {vocab.translation}
                </p>
                {vocab.example_sentence && (
                  <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-[11px] text-slate-500">
                    <p className="italic">"{vocab.example_sentence}"</p>
                    <p className="text-slate-400">→ {vocab.example_translation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80">
        <Link
          to={`/courses/${lesson.course_id}`}
          className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:underline"
        >
          ← Back to Course Syllabus
        </Link>
        {lesson.assessment && (
          <Link
            to={`/assessments/${lesson.assessment.id}`}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-md shadow-brand-500/20"
          >
            <span>Test Knowledge in Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default LessonPage;

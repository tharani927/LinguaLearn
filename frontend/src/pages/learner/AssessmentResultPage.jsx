import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { assessmentApi } from '../../services/api';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  BrainCircuit,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';

const AssessmentResultPage = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await assessmentApi.getResult(id);
        setResult(data);
        if (data.passed) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      } catch (err) {
        console.error('Failed to load result:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-500">Analyzing assessment performance...</div>;
  }

  if (!result) {
    return <div className="p-12 text-center text-xs text-rose-500">Result not found.</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Score Hero Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl text-center relative overflow-hidden">
        <div className="max-w-md mx-auto">
          <div
            className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl mb-4 ${
              result.passed
                ? 'bg-emerald-500 shadow-emerald-500/30'
                : 'bg-amber-500 shadow-amber-500/30'
            }`}
          >
            {Math.round(result.score)}%
          </div>

          <span
            className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
              result.passed
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
            }`}
          >
            {result.passed ? 'Assessment Passed' : 'Needs Practice (Saved to Mistake Vault)'}
          </span>

          <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-3">
            {result.assessment_title}
          </h1>

          <p className="mt-2 text-xs text-slate-500">
            Passing Score: {result.passing_score}% &bull; Time Spent: {result.time_spent_seconds}s
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/mistakes"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition"
            >
              <RotateCcw className="w-4 h-4 text-brand-500" />
              <span>Review Mistake Vault</span>
            </Link>
            <Link
              to="/courses"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-md shadow-brand-500/20 transition"
            >
              <span>Continue to Next Lesson</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* AI Assessment Analysis Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                AI Pedagogical Analysis
              </h2>
              <span className="text-[11px] text-slate-400 capitalize">
                Engine: {result.engine_used?.replace('_', ' ') || 'Deterministic Rule Engine'}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            Instant Feedback
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900/40 text-xs text-brand-900 dark:text-brand-200 leading-relaxed font-medium">
          {result.overall_summary}
        </div>

        {/* Strengths and Weaknesses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-2">
            <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Demonstrated Strengths</span>
            </h3>
            {Array.isArray(result.strengths) && result.strengths.length > 0 ? (
              result.strengths.map((s, idx) => (
                <div key={idx} className="text-[11px] text-emerald-900 dark:text-emerald-200">
                  <span className="font-bold">{s.skill} ({s.accuracy}):</span> {s.description}
                </div>
              ))
            ) : (
              <p className="text-[11px] text-slate-500">Continue practicing to form defined strengths.</p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 space-y-2">
            <h3 className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-500" />
              <span>Identified Weak Areas</span>
            </h3>
            {Array.isArray(result.weaknesses) && result.weaknesses.length > 0 ? (
              result.weaknesses.map((w, idx) => (
                <div key={idx} className="text-[11px] text-rose-900 dark:text-rose-200">
                  <span className="font-bold">{w.skill} ({w.accuracy}):</span> {w.description}
                </div>
              ))
            ) : (
              <p className="text-[11px] text-slate-500">No weak areas identified for this assessment!</p>
            )}
          </div>
        </div>

        {/* Actionable Recommendations */}
        {Array.isArray(result.recommendations) && result.recommendations.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 space-y-2">
            <h3 className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Actionable Study Recommendations</span>
            </h3>
            <ul className="list-disc list-inside text-xs text-amber-900 dark:text-amber-200 space-y-1">
              {result.recommendations.map((tip, idx) => (
                <li key={idx}>{typeof tip === 'string' ? tip : tip.description || JSON.stringify(tip)}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Answer Review */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          Item-by-Item Review
        </h2>

        <div className="space-y-3">
          {result.answers?.map((ans, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border text-xs space-y-2 ${
                ans.is_correct
                  ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/40'
                  : 'bg-rose-50/30 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/40'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-slate-900 dark:text-white">
                  {idx + 1}. {ans.prompt}
                </span>
                {ans.is_correct ? (
                  <span className="flex items-center gap-1 font-bold text-emerald-600 shrink-0">
                    <CheckCircle2 className="w-4 h-4" /> Correct
                  </span>
                ) : (
                  <span className="flex items-center gap-1 font-bold text-rose-600 shrink-0">
                    <XCircle className="w-4 h-4" /> Missed
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-400">Your Answer: </span>
                  <span className={ans.is_correct ? 'font-bold text-emerald-700 dark:text-emerald-300' : 'font-bold text-rose-700 dark:text-rose-300'}>
                    {ans.user_answer || '(None provided)'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Correct Answer: </span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">{ans.correct_answer}</span>
                </div>
              </div>

              {ans.explanation && (
                <p className="text-[11px] text-slate-500 italic pt-1">
                  Explanation: {ans.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssessmentResultPage;

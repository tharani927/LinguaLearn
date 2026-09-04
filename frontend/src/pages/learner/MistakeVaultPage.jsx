import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adaptiveApi } from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';
import {
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Filter,
  Sparkles,
} from 'lucide-react';

const MistakeVaultPage = () => {
  const [mistakes, setMistakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unmastered, mastered
  const { addToast } = useNotification();

  const fetchMistakes = async () => {
    setLoading(true);
    try {
      let params = '';
      if (filter === 'unmastered') params = 'mastered=false';
      if (filter === 'mastered') params = 'mastered=true';

      const data = await adaptiveApi.getMistakes(params);
      setMistakes(data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMistakes();
  }, [filter]);

  const unmasteredCount = mistakes.filter((m) => !m.mastered).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs font-bold mb-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Mistake Intelligence &amp; Spaced Remediation</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Personal Mistake Vault
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Questions you missed during assessments are saved here. Practice until you achieve complete mastery!
          </p>
        </div>

        {unmasteredCount > 0 && (
          <Link
            to="/mistakes/practice"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice My Mistakes ({unmasteredCount})</span>
          </Link>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 w-fit">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
            filter === 'all'
              ? 'bg-brand-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          All Items ({mistakes.length})
        </button>
        <button
          onClick={() => setFilter('unmastered')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
            filter === 'unmastered'
              ? 'bg-brand-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Needs Practice
        </button>
        <button
          onClick={() => setFilter('mastered')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
            filter === 'mastered'
              ? 'bg-brand-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Mastered
        </button>
      </div>

      {/* Items List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading mistake vault...</div>
      ) : mistakes.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Your Mistake Vault is clear!</p>
          <p className="text-xs text-slate-400 mt-1">
            Any errors in future assessments will automatically populate here for targeted review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {mistakes.map((item) => (
            <div
              key={item.vault_id}
              className={`p-5 rounded-3xl border shadow-sm transition space-y-3 ${
                item.mastered
                  ? 'bg-white/60 dark:bg-slate-900/60 border-emerald-200 dark:border-emerald-900/40'
                  : 'bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-900/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {item.skill_category?.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
                      Missed {item.mistake_count}x
                    </span>
                    {item.mastered && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                        Mastered
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.prompt}
                  </h3>
                </div>

                {!item.mastered && (
                  <Link
                    to="/mistakes/practice"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shrink-0 shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Practice</span>
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="p-2.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
                  <span className="text-slate-400 font-medium">Your Previous Wrong Answer: </span>
                  <span className="font-bold text-rose-700 dark:text-rose-300">{item.last_wrong_answer || '(None)'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                  <span className="text-slate-400 font-medium">Correct Answer: </span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">{item.correct_answer}</span>
                </div>
              </div>

              {item.explanation && (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                  Rule Explanation: {item.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MistakeVaultPage;

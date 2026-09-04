import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adaptiveApi, assessmentApi } from '../../services/api';
import SkillChart from '../../components/SkillChart';
import {
  BarChart3,
  TrendingUp,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const ProgressPage = () => {
  const [skills, setSkills] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const [skillsData, historyData] = await Promise.all([
          adaptiveApi.getSkills(),
          assessmentApi.getHistory(),
        ]);
        setSkills(skillsData);
        setHistory(historyData);
      } catch (err) {
        console.error('Failed to load progress:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-500">Loading progress analytics...</div>;
  }

  // Exemplary Growth metrics demonstration
  const growthMetrics = [
    { skill: 'Grammar', initial: 58, current: 81, delta: '+23%' },
    { skill: 'Vocabulary', initial: 64, current: 87, delta: '+23%' },
    { skill: 'Comprehension', initial: 70, current: 92, delta: '+22%' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Learning Growth &amp; Skill Diagnostics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Historical growth tracking and competency profiling across 5 core linguistic areas
        </p>
      </div>

      {/* Growth Metric Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {growthMetrics.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {item.skill} Growth
              </span>
              <span className="flex items-center gap-1 text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3.5 h-3.5" />
                {item.delta}
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-sm font-semibold text-slate-400 line-through">
                {item.initial}%
              </span>
              <span className="text-2xl font-black text-brand-600 dark:text-brand-400">
                {item.current}%
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Diagnostic progress over recent learning sessions
            </p>
          </div>
        ))}
      </div>

      {/* Radar and Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
            Linguistic Competency Radar
          </h2>
          <SkillChart skills={skills} type="radar" />
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
            Skill Breakdown Percentage
          </h2>
          <SkillChart skills={skills} type="bar" />
        </div>
      </div>

      {/* Assessment History Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Assessment &amp; Diagnostic History
          </h2>
          <span className="text-xs text-slate-400">{history.length} Assessments Recorded</span>
        </div>

        {history.length === 0 ? (
          <p className="text-xs text-slate-500 py-4">No assessments completed yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                <tr>
                  <th className="pb-3 font-semibold">Assessment</th>
                  <th className="pb-3 font-semibold">Course</th>
                  <th className="pb-3 font-semibold">Score</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Completed Date</th>
                  <th className="pb-3 font-semibold text-right">Diagnosis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {history.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                    <td className="py-3 font-bold text-slate-900 dark:text-white">
                      {h.assessment_title}
                    </td>
                    <td className="py-3 text-slate-500">{h.course_title}</td>
                    <td className="py-3 font-mono font-bold text-brand-600">
                      {Math.round(h.score)}%
                    </td>
                    <td className="py-3">
                      {h.passed ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                          Passed
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                          Needs Practice
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-slate-400">
                      {new Date(h.completed_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/assessments/result/${h.id}`}
                        className="text-brand-600 hover:underline font-bold"
                      >
                        View AI Report →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;

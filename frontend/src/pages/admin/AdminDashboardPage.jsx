import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi, analyticsApi } from '../../services/api';
import StatCard from '../../components/StatCard';
import {
  Users,
  BookOpen,
  HelpCircle,
  TrendingUp,
  Activity,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  ArrowRight,
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [difficultTopic, setDifficultTopic] = useState(null);
  const [atRisk, setAtRisk] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        const [statsData, topicsData, riskData] = await Promise.all([
          adminApi.getDashboardStats(),
          analyticsApi.getDifficultTopics(),
          analyticsApi.getAtRiskLearners(),
        ]);
        setStats(statsData);
        setDifficultTopic(topicsData.mostDifficultTopic);
        setAtRisk(riskData);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminDashboard();
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-500">Loading administrator control tower...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            Management &amp; Analytics Control Tower
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Administrator Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time telemetry, learner risk monitoring, and curriculum operations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/monitoring"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition"
          >
            <Activity className="w-4 h-4 text-brand-500" />
            <span>Health Telemetry</span>
          </Link>
          <Link
            to="/admin/reports"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV Reports</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Learners"
          value={stats?.totalUsers || 0}
          subtitle={`${stats?.activeLearners || 1} active in last 7 days`}
          icon={Users}
        />
        <StatCard
          title="Published Courses"
          value={stats?.totalCourses || 0}
          subtitle="Across 4 target languages"
          icon={BookOpen}
        />
        <StatCard
          title="Completed Assessments"
          value={stats?.completedAssessments || 0}
          subtitle={`Avg score: ${stats?.averageScore || 0}%`}
          icon={HelpCircle}
        />
        <StatCard
          title="Course Completion Rate"
          value={`${stats?.completionRate || 0}%`}
          subtitle="Across all enrollments"
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Most Difficult Topic</span>
              </span>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400">
                {difficultTopic?.strugglePercentage || '68%'} Struggling
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {difficultTopic?.topic || 'Subject-Verb Agreement (Ser vs. Estar)'}
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Based on aggregated wrong answers across all assessment attempts. Recommended action: Review assessment question prompts or add remedial lesson notes.
            </p>
          </div>
          <Link
            to="/admin/analytics"
            className="mt-4 text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
          >
            <span>View Complete Topic Heatmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-amber-500" />
                <span>At-Risk Learners</span>
              </span>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                {atRisk?.atRiskCount || 0} Flagged
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Deterministic Academic &amp; Inactivity Alerts
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Learners flagged for either prolonged inactivity (7+ days since last activity) or persistent low assessment average (&lt; 50%).
            </p>
          </div>
          <Link
            to="/admin/analytics"
            className="mt-4 text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
          >
            <span>Inspect At-Risk Learners</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          Real-Time Audit &amp; Event Stream
        </h2>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {stats?.recentActivity?.map((log) => (
            <div key={log.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-brand-600">
                  {log.action}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {log.full_name || 'System User'} ({log.email || 'system'})
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                {new Date(log.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

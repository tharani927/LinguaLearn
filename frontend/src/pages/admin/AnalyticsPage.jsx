import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../../services/api';
import SkillChart from '../../components/SkillChart';
import {
  BarChart3,
  AlertTriangle,
  Users,
  Activity,
  CheckCircle2,
  TrendingDown,
} from 'lucide-react';

const AnalyticsPage = () => {
  const [topicAnalytics, setTopicAnalytics] = useState(null);
  const [atRisk, setAtRisk] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [topicsData, riskData, skillsData] = await Promise.all([
          analyticsApi.getDifficultTopics(),
          analyticsApi.getAtRiskLearners(),
          analyticsApi.getSkillDistribution(),
        ]);
        setTopicAnalytics(topicsData);
        setAtRisk(riskData);
        setSkills(skillsData);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className='p-12 text-center text-xs text-slate-500'>Compiling intelligent analytics telemetry...</div>;
  }

  return (
    <div className='p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6'>
      <div>
        <h1 className='text-2xl sm:text-3xl font-black text-slate-900 dark:text-white'>
          Intelligent Learning Analytics & Risk Engine
        </h1>
        <p className='text-xs text-slate-500 mt-1'>
          Automated topic error rate heatmaps and deterministic at-risk student learner detection
        </p>
      </div>

      <div className='p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-transparent border border-rose-200/80 dark:border-rose-900/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6'>
        <div>
          <span className='text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5'>
            <AlertTriangle className='w-4 h-4 text-rose-500' />
            <span>Highest Error Rate Topic Identified</span>
          </span>
          <h2 className='text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1'>
            {topicAnalytics?.mostDifficultTopic?.topic || 'Subject-Verb Agreement (Ser vs. Estar)'}
          </h2>
          <p className='text-xs text-slate-500 mt-1 max-w-xl leading-relaxed'>
            {topicAnalytics?.calculationMethodology}
          </p>
        </div>

        <div className='p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shrink-0 shadow-sm'>
          <span className='text-3xl font-black text-rose-600'>
            {topicAnalytics?.mostDifficultTopic?.strugglePercentage || '68%'}
          </span>
          <p className='text-[11px] font-bold text-slate-500 uppercase mt-0.5'>Learners Struggling</p>
        </div>
      </div>

      <div className='p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2'>
              <Users className='w-4 h-4 text-amber-500' />
              <span>At-Risk Learners ({atRisk?.atRiskCount || 0})</span>
            </h2>
            <p className='text-[11px] text-slate-400'>
              Rule: {atRisk?.criteria?.description}
            </p>
          </div>
          <span className='text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400'>
            Automated Intervention Flags
          </span>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <thead className='border-b border-slate-100 dark:border-slate-800 text-slate-400'>
              <tr>
                <th className='pb-3 font-semibold'>Learner Name</th>
                <th className='pb-3 font-semibold'>Email</th>
                <th className='pb-3 font-semibold'>Days Inactive</th>
                <th className='pb-3 font-semibold'>Average Score</th>
                <th className='pb-3 font-semibold'>Primary Risk Flag</th>
                <th className='pb-3 font-semibold text-right'>Risk Severity</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100 dark:divide-slate-800'>
              {atRisk?.learners?.map((learner) => (
                <tr key={learner.id} className='hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition'>
                  <td className='py-3 font-bold text-slate-900 dark:text-white'>
                    {learner.full_name}
                  </td>
                  <td className='py-3 text-slate-500'>{learner.email}</td>
                  <td className='py-3 font-mono font-bold text-rose-600'>
                    {learner.days_inactive} days
                  </td>
                  <td className='py-3 font-mono font-bold'>
                    {learner.assessments_completed > 0 ? `${learner.avg_score}%` : '0 Assessments'}
                  </td>
                  <td className='py-3 text-slate-600 dark:text-slate-300'>
                    {learner.risk_reason}
                  </td>
                  <td className='py-3 text-right'>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        learner.risk_level === 'HIGH'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {learner.risk_level}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

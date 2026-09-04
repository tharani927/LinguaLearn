import React, { useState } from 'react';
import { reportApi } from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';
import {
  FileSpreadsheet,
  Download,
  Users,
  Award,
  BookOpen,
} from 'lucide-react';

const ReportsPage = () => {
  const [downloading, setDownloading] = useState({});
  const { addToast } = useNotification();

  const handleDownloadCSV = async (type, filename) => {
    setDownloading((prev) => ({ ...prev, [type]: true }));
    try {
      let blob;
      if (type === 'progress') blob = await reportApi.getProgressReport('csv');
      else if (type === 'assessments') blob = await reportApi.getAssessmentReport('csv');
      else if (type === 'courses') blob = await reportApi.getCourseReport('csv');

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      addToast(`Downloaded ${filename} successfully!`, 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setDownloading((prev) => ({ ...prev, [type]: false }));
    }
  };

  return (
    <div className='p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6'>
      <div>
        <h1 className='text-2xl sm:text-3xl font-black text-slate-900 dark:text-white'>
          Data Export & Regulatory Reports
        </h1>
        <p className='text-xs text-slate-500 mt-1'>
          Export full relational audit data, learner performance logs, and curriculum metrics in standard CSV format
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between space-y-4'>
          <div>
            <div className='w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 flex items-center justify-center mb-4 shadow-sm'>
              <Users className='w-6 h-6' />
            </div>
            <h3 className='text-base font-bold text-slate-900 dark:text-white'>
              Learner Progress Report
            </h3>
            <p className='text-xs text-slate-500 mt-1 leading-relaxed'>
              Complete breakdown of registered learners, streaks, completed lessons, and certificates issued.
            </p>
          </div>
          <button
            onClick={() => handleDownloadCSV('progress', 'lingualearn_user_progress.csv')}
            disabled={downloading['progress']}
            className='flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20 disabled:opacity-50'
          >
            <Download className='w-4 h-4' />
            <span>{downloading['progress'] ? 'Exporting...' : 'Export Progress CSV'}</span>
          </button>
        </div>

        <div className='p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between space-y-4'>
          <div>
            <div className='w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center mb-4 shadow-sm'>
              <Award className='w-6 h-6' />
            </div>
            <h3 className='text-base font-bold text-slate-900 dark:text-white'>
              Assessment Outcomes Report
            </h3>
            <p className='text-xs text-slate-500 mt-1 leading-relaxed'>
              Historical scoring log, pass/fail status, and time spent per assessment attempt across all cohorts.
            </p>
          </div>
          <button
            onClick={() => handleDownloadCSV('assessments', 'lingualearn_assessment_outcomes.csv')}
            disabled={downloading['assessments']}
            className='flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 disabled:opacity-50'
          >
            <Download className='w-4 h-4' />
            <span>{downloading['assessments'] ? 'Exporting...' : 'Export Assessments CSV'}</span>
          </button>
        </div>

        <div className='p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between space-y-4'>
          <div>
            <div className='w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mb-4 shadow-sm'>
              <BookOpen className='w-6 h-6' />
            </div>
            <h3 className='text-base font-bold text-slate-900 dark:text-white'>
              Course Completion Report
            </h3>
            <p className='text-xs text-slate-500 mt-1 leading-relaxed'>
              Course enrollment counts, completion percentages, and retention rates across languages and difficulty levels.
            </p>
          </div>
          <button
            onClick={() => handleDownloadCSV('courses', 'lingualearn_course_completion.csv')}
            disabled={downloading['courses']}
            className='flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 disabled:opacity-50'
          >
            <Download className='w-4 h-4' />
            <span>{downloading['courses'] ? 'Exporting...' : 'Export Completion CSV'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;

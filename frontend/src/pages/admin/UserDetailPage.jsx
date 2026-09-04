import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminApi } from '../../services/api';
import SkillChart from '../../components/SkillChart';
import { User, Shield, BookOpen, AlertTriangle, ArrowLeft } from 'lucide-react';

const UserDetailPage = () => {
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await adminApi.getUserDetails(id);
        setUserDetails(data);
      } catch (err) {
        console.error('Failed to load user details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-500">Loading user profile telemetry...</div>;
  }

  if (!userDetails) {
    return <div className="p-12 text-center text-xs text-rose-500">User not found.</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <Link to="/admin/users" className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to User Directory</span>
      </Link>

      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Learner Profile Audit
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {userDetails.full_name}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {userDetails.email} &bull; Target Language: {userDetails.target_language} ({userDetails.proficiency_level})
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            userDetails.is_active
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
              : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
          }`}
        >
          {userDetails.is_active ? 'Active Account' : 'Deactivated'}
        </span>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
          Learner Linguistic Competency Model
        </h2>
        <SkillChart skills={userDetails.skills} type="radar" />
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <span>Learner Mistake Vault Records ({userDetails.mistakes?.length || 0})</span>
        </h2>
        <div className="space-y-3">
          {userDetails.mistakes?.map((m) => (
            <div
              key={m.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1"
            >
              <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                <span>{m.prompt}</span>
                <span className="text-rose-600">Missed {m.mistake_count}x</span>
              </div>
              <div className="text-slate-500">
                Last wrong answer: <span className="font-semibold text-rose-600">{m.last_wrong_answer}</span> &bull; Correct: <span className="font-semibold text-emerald-600">{m.correct_answer}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;

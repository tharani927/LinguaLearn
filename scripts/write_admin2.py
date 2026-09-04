import os

user_mgmt = '''import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';
import { Users, Search, Shield, User, Eye, CheckCircle2, XCircle } from 'lucide-react';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const { addToast } = useNotification();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);

      const data = await adminApi.getUsers(params.toString());
      setUsers(data.users);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await adminApi.toggleUserStatus(userId, !currentStatus);
      addToast('User status updated successfully', 'success');
      fetchUsers();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          User Management &amp; Directory
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor student learner metrics, inspect individual skill profiles, and manage status
        </p>
      </div>

      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchUsers();
          }}
          className="relative w-full sm:w-80"
        >
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </form>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
        >
          <option value="">All Roles</option>
          <option value="learner">Learners</option>
          <option value="admin">Administrators</option>
        </select>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading users...</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
              <tr>
                <th className="pb-3 font-semibold">User</th>
                <th className="pb-3 font-semibold">Role</th>
                <th className="pb-3 font-semibold">Target Language</th>
                <th className="pb-3 font-semibold">Streak</th>
                <th className="pb-3 font-semibold">Avg Score</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                  <td className="py-3.5">
                    <div className="font-bold text-slate-900 dark:text-white">{u.full_name}</div>
                    <div className="text-[11px] text-slate-400">{u.email}</div>
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400'
                          : 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-600 dark:text-slate-300">
                    {u.target_language || 'Spanish'} ({u.proficiency_level || 'Beginner'})
                  </td>
                  <td className="py-3.5 font-bold text-amber-600">{u.streak}d</td>
                  <td className="py-3.5 font-mono font-bold text-brand-600">
                    {u.avg_score ? `${Math.round(u.avg_score)}%` : 'N/A'}
                  </td>
                  <td className="py-3.5">
                    {u.is_active ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400">
                        Deactivated
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 text-right space-x-2">
                    <Link
                      to={`/admin/users/${u.id}`}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => handleToggleStatus(u.id, u.is_active)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                        u.is_active
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60'
                      }`}
                    >
                      {u.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;
'''

user_detail = '''import React, { useState, useEffect } from 'react';
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
'''

base_path = r'C:\Users\thara\.gemini\antigravity\scratch\LinguaLearn\frontend\src\pages\admin'
with open(os.path.join(base_path, 'UserManagementPage.jsx'), 'w', encoding='utf-8') as f:
    f.write(user_mgmt)

with open(os.path.join(base_path, 'UserDetailPage.jsx'), 'w', encoding='utf-8') as f:
    f.write(user_detail)

print('Written UserManagementPage.jsx and UserDetailPage.jsx')

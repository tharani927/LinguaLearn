import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { userApi, authApi } from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';
import {
  User,
  Mail,
  Palette,
  Sun,
  Moon,
  Monitor,
  Lock,
  Target,
  CheckCircle2,
} from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { theme, appearance, changeTheme, changeAppearance } = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [changingPass, setChangingPass] = useState(false);
  const { addToast } = useNotification();

  const themes = [
    { id: 'ocean', label: 'Ocean', desc: 'Teal & Cyan Waters', color: 'bg-teal-500' },
    { id: 'nature', label: 'Nature', desc: 'Emerald Forest Leaves', color: 'bg-emerald-500' },
    { id: 'bloom', label: 'Bloom', desc: 'Rose & Violet Flora', color: 'bg-pink-500' },
    { id: 'midnight', label: 'Midnight', desc: 'Indigo Night Skies', color: 'bg-indigo-500' },
    { id: 'sunrise', label: 'Sunrise', desc: 'Amber Dawn Radiance', color: 'bg-amber-500' },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userApi.getProfile();
        setProfile(data);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await userApi.updateProfile({
        full_name: profile.full_name,
        target_language: profile.target_language,
        proficiency_level: profile.proficiency_level,
        daily_goal_minutes: profile.daily_goal_minutes,
        bio: profile.bio,
      });
      setProfile(updated);
      updateUser(updated);
      addToast('Profile preferences updated successfully!', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword) {
      addToast('Please enter both current and new password', 'error');
      return;
    }

    setChangingPass(true);
    try {
      await authApi.changePassword(passwords);
      setPasswords({ currentPassword: '', newPassword: '' });
      addToast('Password changed successfully!', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setChangingPass(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-500">Loading user profile...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Profile, Goals &amp; Personalization
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customize your target language, theme aesthetics, appearance, and study goals
        </p>
      </div>

      {/* Profile Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-4 h-4 text-brand-500" />
          <span>Personal Information &amp; Learning Targets</span>
        </h2>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profile?.full_name || ''}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={profile?.email || ''}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Language
              </label>
              <select
                value={profile?.target_language || 'Spanish'}
                onChange={(e) => setProfile({ ...profile, target_language: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Spanish">Spanish (🇪🇸)</option>
                <option value="French">French (🇫🇷)</option>
                <option value="German">German (🇩🇪)</option>
                <option value="Japanese">Japanese (🇯🇵)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Proficiency Level
              </label>
              <select
                value={profile?.proficiency_level || 'Beginner'}
                onChange={(e) => setProfile({ ...profile, proficiency_level: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Daily Goal (Minutes)
              </label>
              <input
                type="number"
                min={5}
                max={120}
                value={profile?.daily_goal_minutes || 15}
                onChange={(e) => setProfile({ ...profile, daily_goal_minutes: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Bio / Learning Objective
            </label>
            <textarea
              rows={2}
              value={profile?.bio || ''}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>

      {/* Theme & Appearance Personalization */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-4 h-4 text-brand-500" />
          <span>Visual Theme &amp; Color Palettes</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {themes.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => changeTheme(t.id)}
              className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                theme === t.id
                  ? 'border-brand-500 ring-2 ring-brand-500/30 bg-brand-50/40 dark:bg-brand-950/40'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl ${t.color} mb-3 shadow-sm`} />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.label}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{t.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Appearance Mode
          </label>
          <div className="flex gap-2">
            {[
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'system', label: 'System', icon: Monitor },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => changeAppearance(m.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition ${
                    appearance === m.id
                      ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-brand-500" />
          <span>Security &amp; Password</span>
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-3 max-w-md">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Current Password</label>
            <input
              type="password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">New Password (min 6 chars)</label>
            <input
              type="password"
              minLength={6}
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            disabled={changingPass}
            className="px-5 py-2.5 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-bold text-xs transition disabled:opacity-50"
          >
            {changingPass ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;

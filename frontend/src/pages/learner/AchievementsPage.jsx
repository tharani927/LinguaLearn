import React, { useState, useEffect } from 'react';
import { gamificationApi } from '../../services/api';
import {
  Award,
  Flame,
  Star,
  BookOpen,
  Zap,
  RotateCcw,
  CheckCircle2,
  Lock,
} from 'lucide-react';

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const data = await gamificationApi.getAchievements();
        setAchievements(data);
      } catch (err) {
        console.error('Failed to load achievements:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  const getIcon = (code) => {
    switch (code) {
      case 'FIRST_STEP':
        return Award;
      case 'SEVEN_DAY_STREAK':
        return Flame;
      case 'PERFECT_SCORE':
        return Star;
      case 'BOOKWORM':
        return BookOpen;
      case 'QUICK_LEARNER':
        return Zap;
      case 'COMEBACK':
        return RotateCcw;
      default:
        return Award;
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-500">Loading achievements...</div>;
  }

  const unlockedCount = achievements.filter((a) => a.is_unlocked).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            Gamification &amp; Milestones
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Badges &amp; Achievements
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Earn experience points and unlock badges for actual learning milestones
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-brand-600">
            {unlockedCount} / {achievements.length}
          </span>
          <p className="text-[11px] text-slate-400">Unlocked</p>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((ach) => {
          const Icon = getIcon(ach.code);
          return (
            <div
              key={ach.id}
              className={`p-6 rounded-3xl border transition space-y-4 flex flex-col justify-between ${
                ach.is_unlocked
                  ? 'bg-white dark:bg-slate-900 border-brand-200 dark:border-brand-900/60 shadow-md'
                  : 'bg-slate-50/70 dark:bg-slate-900/30 border-slate-200/60 dark:border-slate-800/50 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${
                      ach.is_unlocked ? 'bg-brand-500 shadow-brand-500/25' : 'bg-slate-400'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
                    +{ach.points_reward} XP
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {ach.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                {ach.is_unlocked ? (
                  <span className="flex items-center gap-1 font-bold text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Unlocked on {new Date(ach.unlocked_at).toLocaleDateString()}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-slate-400">
                    <Lock className="w-3.5 h-3.5" />
                    Locked
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementsPage;

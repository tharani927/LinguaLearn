import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { userApi, gamificationApi, adaptiveApi, courseApi } from '../../services/api';
import StatCard from '../../components/StatCard';
import SkillChart from '../../components/SkillChart';
import {
  Flame,
  Star,
  CheckCircle2,
  Circle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Award,
  PlayCircle,
  RotateCcw,
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [mission, setMission] = useState(null);
  const [skills, setSkills] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, missionData, skillsData, recsData, coursesData] = await Promise.all([
          userApi.getStats(),
          gamificationApi.getDailyMission(),
          adaptiveApi.getSkills(),
          adaptiveApi.getRecommendations(),
          courseApi.getCourses(''),
        ]);

        setStats(statsData);
        setMission(missionData);
        setSkills(skillsData);
        setRecommendations(recsData);
        setRecentCourses(coursesData.slice(0, 2));
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading your learning hub...</p>
        </div>
      </div>
    );
  }

  // Meaningful personalized appreciation message
  const getPersonalizedAppreciation = () => {
    if (!stats) return 'Welcome to your daily language session!';
    if (stats.completedLessons >= 3) {
      return `Brilliant dedication, ${user?.full_name}! You have mastered ${stats.completedLessons} lessons and conquered ${stats.masteredMistakes} mistakes in your vault. Keep this remarkable momentum going!`;
    }
    return `Welcome, ${user?.full_name}! Ready to expand your ${user?.target_language || 'Spanish'} skills today? Complete your daily mission below to keep your streak burning bright.`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-600 via-brand-500 to-teal-500 text-white shadow-xl shadow-brand-500/15 relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Target Language: {user?.target_language || 'Spanish'} ({user?.proficiency_level || 'Beginner'})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
            ¡Hola, {user?.full_name}!
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-brand-50 leading-relaxed font-medium">
            {getPersonalizedAppreciation()}
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Streak"
          value={`${user?.current_streak || user?.streak || 1} Days`}
          subtitle="Consecutive practice"
          icon={Flame}
        />
        <StatCard
          title="Total Experience"
          value={`${user?.total_points || 120} XP`}
          subtitle="Earned from activities"
          icon={Star}
        />
        <StatCard
          title="Completed Lessons"
          value={stats?.completedLessons || 0}
          subtitle="Curriculum progress"
          icon={BookOpen}
        />
        <StatCard
          title="Mastered Mistakes"
          value={stats?.masteredMistakes || 0}
          subtitle={`${stats?.totalMistakes || 0} Total in vault`}
          icon={CheckCircle2}
        />
      </div>

      {/* Daily Mission & Adaptive Recommendation Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Mission */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-500" />
                <span>Today's Learning Mission</span>
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
                +50 XP Bonus
              </span>
            </div>

            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                {mission?.lesson_completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-400 shrink-0" />
                )}
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Complete 1 Lesson</p>
                  <p className="text-[10px] text-slate-500">Read grammar notes &amp; review vocabulary</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                {mission?.vocab_practiced ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-400 shrink-0" />
                )}
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Practice Vocabulary</p>
                  <p className="text-[10px] text-slate-500">Practice word recall &amp; pronunciation</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                {mission?.assessment_completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-400 shrink-0" />
                )}
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Take 1 Assessment</p>
                  <p className="text-[10px] text-slate-500">Test retention and receive AI diagnosis</p>
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/courses"
            className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition"
          >
            <span>Proceed with Mission</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Adaptive Recommendation & Weak Area Alert */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-600 dark:text-brand-400">
                  Adaptive Intelligence
                </span>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Personalized Pedagogical Focus
                </h2>
              </div>
              <div className="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>

            {recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendations.slice(0, 2).map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/70 via-white to-brand-50/70 dark:from-slate-800/60 dark:via-slate-800/60 dark:to-brand-950/40 border border-amber-200/60 dark:border-amber-800/40"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                        {rec.title}
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                        {rec.recommendation_type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {rec.reason}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                Take an assessment to generate custom adaptive recommendations!
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/mistakes"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs transition"
            >
              <RotateCcw className="w-4 h-4 text-brand-500" />
              <span>Practice My Mistakes ({stats?.totalMistakes - stats?.masteredMistakes || 1})</span>
            </Link>
            <Link
              to="/courses"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Continue Learning</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Skills Radar & Active Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Proficiency Diagnosis */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                5-Dimension Linguistic Competency
              </h2>
              <p className="text-[11px] text-slate-500">
                Real-time diagnostic model across 5 core competencies
              </p>
            </div>
            <Link to="/progress" className="text-xs font-bold text-brand-600 hover:underline">
              Full Analytics
            </Link>
          </div>
          <SkillChart skills={skills} type="radar" />
        </div>

        {/* Featured Course Catalog */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Enrolled &amp; Recommended Courses
                </h2>
                <p className="text-[11px] text-slate-500">
                  Step-by-step curriculum tailored to your level
                </p>
              </div>
              <Link to="/courses" className="text-xs font-bold text-brand-600 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {recentCourses.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-950/80 flex items-center justify-center text-xl shrink-0">
                      {c.flag_emoji || '🇪🇸'}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {c.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span className="font-semibold text-brand-600">{c.level}</span>
                        <span>&bull;</span>
                        <span>{c.lesson_count} Lessons</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/courses/${c.id}`}
                    className="px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shrink-0 shadow-sm"
                  >
                    Open
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-2xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900/40 text-[11px] text-brand-800 dark:text-brand-300 flex items-center justify-between">
            <span>Ready for a certificate? Complete all lessons in a course!</span>
            <Link to="/certificates" className="font-bold underline">
              Certificates
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

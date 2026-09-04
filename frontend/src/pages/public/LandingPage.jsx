import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Sparkles, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 flex-1">

        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 dark:bg-brand-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">

          {/* Platform Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Intelligent Language Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Learn Languages with{' '}

            <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-teal-400 bg-clip-text text-transparent">
              Adaptive Mistake Intelligence
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            LinguaLearn continuously diagnoses your linguistic errors,
            populates a personalized Mistake Vault, dynamically modulates
            practice difficulty, and generates real-time AI pedagogical
            feedback.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">

            {user ? (
              <Link
                to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-xl shadow-brand-500/25 transition transform hover:-translate-y-0.5"
              >
                <span>Enter Your Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                {/* Start Learning */}
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-xl shadow-brand-500/25 transition transform hover:-translate-y-0.5"
                >
                  <span>Start Learning Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Login */}
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-sm border border-slate-200 dark:border-slate-800 shadow-sm transition"
                >
                  <span>Live Demo Logins</span>
                </Link>
              </>
            )}

          </div>

        </div>
      </section>

    </div>
  );
};

export default LandingPage;
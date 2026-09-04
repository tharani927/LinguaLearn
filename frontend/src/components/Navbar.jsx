import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Flame, Star, Sun, Moon, Monitor, Palette, LogOut, User, Shield, BookOpen, Menu, X } from 'lucide-react';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, appearance, changeTheme, changeAppearance } = useTheme();
  const navigate = useNavigate();
  const [themeDropdown, setThemeDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const themes = [
    { id: 'ocean', label: 'Ocean', color: 'bg-teal-500' },
    { id: 'nature', label: 'Nature', color: 'bg-emerald-500' },
    { id: 'bloom', label: 'Bloom', color: 'bg-pink-500' },
    { id: 'midnight', label: 'Midnight', color: 'bg-indigo-500' },
    { id: 'sunrise', label: 'Sunrise', color: 'bg-amber-500' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand & Mobile Sidebar Toggle */}
        <div className="flex items-center gap-3">
          {user && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
              LinguaLearn
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              Adaptive AI
            </span>
          </Link>
        </div>

        {/* Right: Gamification Badges, Themes, Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {user && user.role === 'learner' && (
            <>
              {/* Streak Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-400 text-xs sm:text-sm font-bold shadow-sm">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
                <span>{user.streak || user.current_streak || 1}d Streak</span>
              </div>

              {/* Points Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/60 text-brand-700 dark:text-brand-300 text-xs sm:text-sm font-bold shadow-sm">
                <Star className="w-4 h-4 fill-brand-500 text-brand-500" />
                <span>{user.total_points || 120} XP</span>
              </div>
            </>
          )}

          {/* Theme & Appearance Dropdown */}
          <div className="relative">
            <button
              onClick={() => setThemeDropdown(!themeDropdown)}
              title="Personalize Appearance"
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition"
            >
              <Palette className="w-5 h-5 text-brand-500" />
            </button>

            {themeDropdown && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Theme Palette
                </p>
                <div className="grid grid-cols-5 gap-1.5 mb-3">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        changeTheme(t.id);
                        setThemeDropdown(false);
                      }}
                      title={t.label}
                      className={`h-7 rounded-lg flex items-center justify-center transition-transform ${t.color} ${
                        theme === t.id ? 'ring-2 ring-offset-2 ring-slate-400 scale-105' : 'hover:scale-105'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Mode
                </p>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    onClick={() => changeAppearance('light')}
                    className={`flex items-center justify-center p-1.5 rounded-lg text-xs font-medium transition ${
                      appearance === 'light'
                        ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => changeAppearance('dark')}
                    className={`flex items-center justify-center p-1.5 rounded-lg text-xs font-medium transition ${
                      appearance === 'dark'
                        ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => changeAppearance('system')}
                    className={`flex items-center justify-center p-1.5 rounded-lg text-xs font-medium transition ${
                      appearance === 'system'
                        ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Account Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-semibold leading-tight text-slate-900 dark:text-slate-100">
                    {user.full_name || 'Learner'}
                  </span>
                  <span className="text-[10px] text-slate-500 capitalize">
                    {user.role === 'admin' ? 'Administrator' : 'Learner'}
                  </span>
                </div>
              </button>

              {userDropdown && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {user.full_name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  {user.role === 'learner' ? (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        Learner Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        My Profile & Goals
                      </Link>
                    </>
                  ) : (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Shield className="w-4 h-4 text-brand-500" />
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setUserDropdown(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/50 mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 rounded-xl transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-md shadow-brand-500/20 transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

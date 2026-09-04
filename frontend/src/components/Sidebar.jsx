import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  AlertTriangle,
  BarChart3,
  Award,
  FileCheck2,
  Bot,
  Users,
  Layers,
  HelpCircle,
  Activity,
  FileSpreadsheet,
  Settings,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  if (!user) return null;

  const learnerLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/courses', label: 'Courses & Catalog', icon: BookOpen },
    { to: '/mistakes', label: 'Mistake Vault', icon: AlertTriangle },
    { to: '/progress', label: 'Progress & Skills', icon: BarChart3 },
    { to: '/achievements', label: 'Achievements', icon: Award },
    { to: '/certificates', label: 'Certificates', icon: FileCheck2 },
    { to: '/ai-assistant', label: 'AI Language Tutor', icon: Bot },
    { to: '/profile', label: 'Profile & Themes', icon: Settings },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Control Tower', icon: LayoutDashboard },
    { to: '/admin/users', label: 'User Directory', icon: Users },
    { to: '/admin/courses', label: 'Curriculum CRUD', icon: Layers },
    { to: '/admin/questions', label: 'Question Bank', icon: HelpCircle },
    { to: '/admin/analytics', label: 'Intelligent Analytics', icon: BarChart3 },
    { to: '/admin/reports', label: 'Reports & CSV', icon: FileSpreadsheet },
    { to: '/admin/monitoring', label: 'System Health', icon: Activity },
  ];

  const links = user.role === 'admin' ? adminLinks : learnerLinks;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-r border-slate-200/80 dark:border-slate-800/80 p-4 transition-transform duration-200 flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {user.role === 'admin' ? 'Administration' : 'Learning Portal'}
          </div>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold border border-brand-200/80 dark:border-brand-800/80 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Learning Identity Footer Note */}
        <div className="p-3 rounded-xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900/40 text-center">
          <p className="text-[11px] font-medium text-brand-800 dark:text-brand-300">
            Adaptive Learning Active
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            Diagnosing mistakes &amp; adapting difficulty in real-time.
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

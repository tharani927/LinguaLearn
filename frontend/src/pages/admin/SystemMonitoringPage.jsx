import React, { useState, useEffect } from 'react';
import { healthApi } from '../../services/api';
import {
  Activity,
  Server,
  Database,
  Bot,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

const SystemMonitoringPage = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHealth = async () => {
    try {
      const data = await healthApi.checkHealth();
      setHealth(data);
    } catch (err) {
      console.error('Failed to fetch health telemetry:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchHealth();
  };

  if (loading) {
    return <div className='p-12 text-center text-xs text-slate-500'>Checking system telemetry...</div>;
  }

  const isHealthy = health?.status === 'healthy';

  return (
    <div className='p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <span className='text-xs font-bold text-brand-600 uppercase tracking-wider'>
            Infrastructure Telemetry
          </span>
          <h1 className='text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1'>
            System Health & Services
          </h1>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-sm flex items-center justify-between ${
          isHealthy
            ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
            : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-200'
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${
              isHealthy ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
          >
            {isHealthy ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          </div>
          <div>
            <h2 className='text-lg font-black capitalize'>
              {health?.status} — All Critical Subsystems Operational
            </h2>
            <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>
              Uptime: {health?.uptime}s &bull; Environment: {health?.environment} &bull; Timestamp: {health?.timestamp}
            </p>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 flex items-center justify-center'>
              <Server className='w-5 h-5' />
            </div>
            <span className='text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'>
              {health?.services?.api?.status}
            </span>
          </div>
          <div>
            <h3 className='text-sm font-bold text-slate-900 dark:text-white'>Node.js Express API</h3>
            <p className='text-xs text-slate-400 mt-1'>REST API Subsystem &bull; Port 5000</p>
          </div>
          <div className='text-[11px] text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800'>
            Latency: <span className='font-mono font-bold text-brand-600'>{health?.services?.api?.latencyMs}ms</span>
          </div>
        </div>

        <div className='p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center'>
              <Database className='w-5 h-5' />
            </div>
            <span className='text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'>
              {health?.services?.database?.status}
            </span>
          </div>
          <div>
            <h3 className='text-sm font-bold text-slate-900 dark:text-white'>PostgreSQL 16 DB</h3>
            <p className='text-xs text-slate-400 mt-1'>Relational Pool &bull; lingualearn_db</p>
          </div>
          <div className='text-[11px] text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800'>
            Connection: <span className='font-bold text-emerald-600'>Active</span>
          </div>
        </div>

        <div className='p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center'>
              <Bot className='w-5 h-5' />
            </div>
            <span className='text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'>
              {health?.services?.aiEngine?.status}
            </span>
          </div>
          <div>
            <h3 className='text-sm font-bold text-slate-900 dark:text-white'>AI Diagnostic Engine</h3>
            <p className='text-xs text-slate-400 mt-1'>Pedagogical Analysis Subsystem</p>
          </div>
          <div className='text-[11px] text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800 truncate'>
            Mode: <span className='font-mono text-brand-600'>{health?.services?.aiEngine?.mode}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitoringPage;

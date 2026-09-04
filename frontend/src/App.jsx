import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import AIAssistantWidget from './components/AIAssistantWidget';
import { useAuth } from './contexts/AuthContext';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Learner Pages
import DashboardPage from './pages/learner/DashboardPage';
import CoursesPage from './pages/learner/CoursesPage';
import CourseDetailPage from './pages/learner/CourseDetailPage';
import LessonPage from './pages/learner/LessonPage';
import AssessmentPage from './pages/learner/AssessmentPage';
import AssessmentResultPage from './pages/learner/AssessmentResultPage';
import MistakeVaultPage from './pages/learner/MistakeVaultPage';
import PracticeMistakesPage from './pages/learner/PracticeMistakesPage';
import ProgressPage from './pages/learner/ProgressPage';
import AchievementsPage from './pages/learner/AchievementsPage';
import CertificatesPage from './pages/learner/CertificatesPage';
import AIAssistantPage from './pages/learner/AIAssistantPage';
import ProfilePage from './pages/learner/ProfilePage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import UserDetailPage from './pages/admin/UserDetailPage';
import CourseManagementPage from './pages/admin/CourseManagementPage';
import QuestionManagementPage from './pages/admin/QuestionManagementPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import ReportsPage from './pages/admin/ReportsPage';
import SystemMonitoringPage from './pages/admin/SystemMonitoringPage';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const isPublicAuthPage = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <div className='min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-brand-500 selection:text-white'>
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className='flex-1 flex'>
        {user && !isPublicAuthPage && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        <main className='flex-1 w-full overflow-y-auto'>
          <Routes>
            {/* Public Routes */}
            <Route path='/' element={<LandingPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />

            {/* Learner Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['learner', 'admin']} />}>
              <Route path='/dashboard' element={<DashboardPage />} />
              <Route path='/courses' element={<CoursesPage />} />
              <Route path='/courses/:id' element={<CourseDetailPage />} />
              <Route path='/lessons/:id' element={<LessonPage />} />
              <Route path='/assessments/:id' element={<AssessmentPage />} />
              <Route path='/assessments/result/:id' element={<AssessmentResultPage />} />
              <Route path='/mistakes' element={<MistakeVaultPage />} />
              <Route path='/mistakes/practice' element={<PracticeMistakesPage />} />
              <Route path='/progress' element={<ProgressPage />} />
              <Route path='/achievements' element={<AchievementsPage />} />
              <Route path='/certificates' element={<CertificatesPage />} />
              <Route path='/ai-assistant' element={<AIAssistantPage />} />
              <Route path='/profile' element={<ProfilePage />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path='/admin/dashboard' element={<AdminDashboardPage />} />
              <Route path='/admin/users' element={<UserManagementPage />} />
              <Route path='/admin/users/:id' element={<UserDetailPage />} />
              <Route path='/admin/courses' element={<CourseManagementPage />} />
              <Route path='/admin/questions' element={<QuestionManagementPage />} />
              <Route path='/admin/analytics' element={<AnalyticsPage />} />
              <Route path='/admin/reports' element={<ReportsPage />} />
              <Route path='/admin/monitoring' element={<SystemMonitoringPage />} />
            </Route>

            {/* Catch-all fallback */}
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </main>
      </div>

      {user && user.role === 'learner' && <AIAssistantWidget />}
    </div>
  );
}

export default App;

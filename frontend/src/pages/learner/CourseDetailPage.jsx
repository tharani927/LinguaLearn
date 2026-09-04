import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseApi, gamificationApi } from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';
import CertificateModal from '../../components/CertificateModal';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
  PlayCircle,
  Sparkles,
} from 'lucide-react';

const CourseDetailPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const { addToast } = useNotification();

  const fetchCourse = async () => {
    try {
      const data = await courseApi.getCourseById(id);
      setCourse(data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await courseApi.enroll(id);
      addToast('Successfully enrolled in course!', 'success');
      fetchCourse();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setEnrolling(false);
    }
  };

  const handleClaimCertificate = async () => {
    try {
      const cert = await gamificationApi.generateCertificate(id);
      setCertificate(cert);
      addToast('Certificate generated successfully!', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-slate-500">Loading course syllabus...</div>
    );
  }

  if (!course) {
    return (
      <div className="p-12 text-center text-xs text-rose-500">Course not found.</div>
    );
  }

  const isCompleted = course.progressPercentage === 100;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Course Header Banner */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center">
        <div className="w-full md:w-56 h-40 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 shadow-sm">
          <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
              {course.flag_emoji} {course.language_name} &bull; {course.level}
            </span>
            {course.enrollment && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                Enrolled
              </span>
            )}
          </div>

          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {course.title}
          </h1>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {course.description}
          </p>

          {course.enrollment && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                <span>Progress</span>
                <span className="font-bold text-brand-600">{course.progressPercentage}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-brand-500 transition-all duration-500"
                  style={{ width: `${course.progressPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="w-full md:w-auto shrink-0 flex flex-col gap-2">
          {!course.enrollment ? (
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition disabled:opacity-50"
            >
              {enrolling ? 'Enrolling...' : 'Enroll in Course'}
            </button>
          ) : isCompleted ? (
            <button
              onClick={handleClaimCertificate}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-lg shadow-amber-500/25 transition"
            >
              <Award className="w-4 h-4" />
              <span>Claim Certificate</span>
            </button>
          ) : (
            <Link
              to={`/lessons/${course.lessons[0]?.id || 1}`}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Continue Lesson</span>
            </Link>
          )}
        </div>
      </div>

      {/* Syllabus / Lesson List */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-brand-500" />
          <span>Curriculum &amp; Lesson Sequence</span>
        </h2>

        <div className="space-y-3">
          {course.lessons?.map((lesson, idx) => (
            <div
              key={lesson.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 hover:border-brand-500/50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs shadow-sm">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {lesson.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span className="capitalize text-brand-600">{lesson.lesson_type}</span>
                    <span>&bull;</span>
                    <span>{lesson.estimated_minutes} mins</span>
                    <span>&bull;</span>
                    <span>{lesson.vocab_count} words</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {lesson.user_status === 'completed' && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Completed</span>
                  </span>
                )}
                <Link
                  to={`/lessons/${lesson.id}`}
                  className="px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-sm"
                >
                  Start
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {certificate && (
        <CertificateModal certificate={certificate} onClose={() => setCertificate(null)} />
      )}
    </div>
  );
};

export default CourseDetailPage;

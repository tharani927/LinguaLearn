import React, { useState, useEffect } from 'react';
import { courseApi } from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';
import { BookOpen, Plus, Trash2, Edit2, X } from 'lucide-react';

const CourseManagementPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    language_id: 1,
    level: 'Beginner',
    estimated_hours: 5.0,
    thumbnail_url: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=600&q=80',
  });
  const { addToast } = useNotification();

  const fetchCourses = async () => {
    try {
      const data = await courseApi.getCourses('');
      setCourses(data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await courseApi.updateCourse(editingCourse.id, formData);
        addToast('Course updated successfully', 'success');
      } else {
        await courseApi.createCourse(formData);
        addToast('Course created successfully', 'success');
      }
      setShowModal(false);
      setEditingCourse(null);
      fetchCourses();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? All enrolled records and lessons will be removed.')) return;
    try {
      await courseApi.deleteCourse(courseId);
      addToast('Course deleted successfully', 'success');
      fetchCourses();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className='p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-black text-slate-900 dark:text-white'>
            Curriculum & Course Management
          </h1>
          <p className='text-xs text-slate-500 mt-1'>
            Create, update, and manage published language courses and syllabi
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCourse(null);
            setFormData({
              title: '',
              description: '',
              language_id: 1,
              level: 'Beginner',
              estimated_hours: 5.0,
              thumbnail_url: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=600&q=80',
            });
            setShowModal(true);
          }}
          className='flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20'
        >
          <Plus className='w-4 h-4' />
          <span>New Course</span>
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {courses.map((course) => (
          <div
            key={course.id}
            className='p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between space-y-4'
          >
            <div>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-xs font-bold text-brand-600'>
                  {course.flag_emoji} {course.language_name}
                </span>
                <span className='text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600'>
                  {course.level}
                </span>
              </div>
              <h3 className='text-base font-bold text-slate-900 dark:text-white'>
                {course.title}
              </h3>
              <p className='text-xs text-slate-500 mt-1 line-clamp-2'>
                {course.description}
              </p>
              <div className='mt-3 text-[11px] text-slate-400'>
                {course.lesson_count} Lessons &bull; {course.student_count} Enrolled
              </div>
            </div>

            <div className='pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2'>
              <button
                onClick={() => {
                  setEditingCourse(course);
                  setFormData({
                    title: course.title,
                    description: course.description,
                    language_id: course.language_id || 1,
                    level: course.level,
                    estimated_hours: course.estimated_hours,
                    thumbnail_url: course.thumbnail_url,
                  });
                  setShowModal(true);
                }}
                className='p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              >
                <Edit2 className='w-4 h-4' />
              </button>
              <button
                onClick={() => handleDelete(course.id)}
                className='p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40'
              >
                <Trash2 className='w-4 h-4' />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4'>
          <div className='w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-sm font-bold text-slate-900 dark:text-white'>
                {editingCourse ? 'Edit Course' : 'Create New Language Course'}
              </h3>
              <button onClick={() => setShowModal(false)} className='text-slate-400 hover:text-slate-600'>
                <X className='w-5 h-5' />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='space-y-3 text-xs'>
              <div>
                <label className='block text-slate-500 mb-1'>Course Title</label>
                <input
                  type='text'
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className='w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                />
              </div>

              <div>
                <label className='block text-slate-500 mb-1'>Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className='w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                />
              </div>

              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <label className='block text-slate-500 mb-1'>Language</label>
                  <select
                    value={formData.language_id}
                    onChange={(e) => setFormData({ ...formData, language_id: parseInt(e.target.value, 10) })}
                    className='w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                  >
                    <option value={1}>Spanish</option>
                    <option value={2}>French</option>
                    <option value={3}>German</option>
                    <option value={4}>Japanese</option>
                  </select>
                </div>
                <div>
                  <label className='block text-slate-500 mb-1'>Proficiency Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className='w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                  >
                    <option value='Beginner'>Beginner</option>
                    <option value='Intermediate'>Intermediate</option>
                    <option value='Advanced'>Advanced</option>
                  </select>
                </div>
              </div>

              <button
                type='submit'
                className='w-full mt-3 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold'
              >
                {editingCourse ? 'Save Changes' : 'Create Course'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagementPage;

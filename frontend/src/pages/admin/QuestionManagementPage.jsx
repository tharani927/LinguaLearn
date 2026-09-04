import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';
import { HelpCircle, Plus, Trash2, Edit2, X } from 'lucide-react';

const QuestionManagementPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    course_id: 1,
    question_type: 'multiple_choice',
    skill_category: 'grammar',
    prompt: '',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correct_answer: '',
    explanation: '',
    difficulty_level: 'medium',
  });
  const { addToast } = useNotification();

  const fetchQuestions = async () => {
    try {
      const data = await adminApi.getQuestions('');
      setQuestions(data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createQuestion(formData);
      addToast('Question created in Question Bank', 'success');
      setShowModal(false);
      fetchQuestions();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question from question bank?')) return;
    try {
      await adminApi.deleteQuestion(id);
      addToast('Question deleted', 'success');
      fetchQuestions();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className='p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-black text-slate-900 dark:text-white'>
            Question Bank & Assessment Designer
          </h1>
          <p className='text-xs text-slate-500 mt-1'>
            Manage assessment items across Grammar, Vocabulary, Reading, and Comprehension
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className='flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20'
        >
          <Plus className='w-4 h-4' />
          <span>Add Question</span>
        </button>
      </div>

      <div className='p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-x-auto'>
        {loading ? (
          <div className='p-12 text-center text-xs text-slate-500'>Loading question bank...</div>
        ) : (
          <table className='w-full text-left text-xs'>
            <thead className='border-b border-slate-100 dark:border-slate-800 text-slate-400'>
              <tr>
                <th className='pb-3 font-semibold'>Prompt</th>
                <th className='pb-3 font-semibold'>Skill Category</th>
                <th className='pb-3 font-semibold'>Type</th>
                <th className='pb-3 font-semibold'>Correct Answer</th>
                <th className='pb-3 font-semibold'>Difficulty</th>
                <th className='pb-3 font-semibold text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100 dark:divide-slate-800'>
              {questions.map((q) => (
                <tr key={q.id} className='hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition'>
                  <td className='py-3 font-semibold text-slate-900 dark:text-white max-w-xs truncate'>
                    {q.prompt}
                  </td>
                  <td className='py-3 capitalize text-brand-600'>
                    {q.skill_category?.replace('_', ' ')}
                  </td>
                  <td className='py-3 text-slate-500 capitalize'>{q.question_type?.replace('_', ' ')}</td>
                  <td className='py-3 font-bold text-emerald-600'>{q.correct_answer}</td>
                  <td className='py-3 capitalize'>{q.difficulty_level}</td>
                  <td className='py-3 text-right'>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className='p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4'>
          <div className='w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-sm font-bold text-slate-900 dark:text-white'>Create Assessment Question</h3>
              <button onClick={() => setShowModal(false)} className='text-slate-400 hover:text-slate-600'>
                <X className='w-5 h-5' />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='space-y-3 text-xs'>
              <div>
                <label className='block text-slate-500 mb-1'>Question Prompt</label>
                <input
                  type='text'
                  required
                  placeholder='e.g. Which verb completes: Madrid _____ en España.'
                  value={formData.prompt}
                  onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                  className='w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                />
              </div>

              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <label className='block text-slate-500 mb-1'>Skill Category</label>
                  <select
                    value={formData.skill_category}
                    onChange={(e) => setFormData({ ...formData, skill_category: e.target.value })}
                    className='w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                  >
                    <option value='grammar'>Grammar</option>
                    <option value='vocabulary'>Vocabulary</option>
                    <option value='reading'>Reading</option>
                    <option value='sentence_formation'>Sentence Formation</option>
                    <option value='comprehension'>Comprehension</option>
                  </select>
                </div>
                <div>
                  <label className='block text-slate-500 mb-1'>Question Type</label>
                  <select
                    value={formData.question_type}
                    onChange={(e) => setFormData({ ...formData, question_type: e.target.value })}
                    className='w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                  >
                    <option value='multiple_choice'>Multiple Choice</option>
                    <option value='true_false'>True / False</option>
                    <option value='fill_blank'>Fill in the Blank</option>
                  </select>
                </div>
              </div>

              <div>
                <label className='block text-slate-500 mb-1'>Correct Answer</label>
                <input
                  type='text'
                  required
                  placeholder='e.g. está'
                  value={formData.correct_answer}
                  onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                  className='w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                />
              </div>

              <div>
                <label className='block text-slate-500 mb-1'>Pedagogical Explanation</label>
                <textarea
                  rows={2}
                  placeholder='Rule explanation provided to learners when missed...'
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  className='w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                />
              </div>

              <button
                type='submit'
                className='w-full mt-3 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold'
              >
                Save to Question Bank
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionManagementPage;

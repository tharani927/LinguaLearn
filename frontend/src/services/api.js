const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('lingualearn_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.headers.get('content-type')?.includes('text/csv')) {
    return response.blob();
  }

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data.message || (data.errors && data.errors.join(', ')) || 'Request failed';
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data.data;
};

export const authApi = {
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me'),
  changePassword: (passwords) => request('/auth/password', { method: 'PUT', body: JSON.stringify(passwords) }),
};

export const userApi = {
  getProfile: () => request('/users/profile'),
  updateProfile: (data) => request('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
  updateTheme: (data) => request('/users/theme', { method: 'PUT', body: JSON.stringify(data) }),
  getStats: () => request('/users/stats'),
};

export const courseApi = {
  getCourses: (params = '') => request(`/courses${params ? `?${params}` : ''}`),
  getCourseById: (id) => request(`/courses/${id}`),
  enroll: (id) => request(`/courses/${id}/enroll`, { method: 'POST' }),
  createCourse: (data) => request('/courses', { method: 'POST', body: JSON.stringify(data) }),
  updateCourse: (id, data) => request(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCourse: (id) => request(`/courses/${id}`, { method: 'DELETE' }),
};

export const lessonApi = {
  getLessonById: (id) => request(`/lessons/${id}`),
  completeLesson: (id) => request(`/lessons/${id}/complete`, { method: 'POST' }),
  getVocabulary: (id) => request(`/lessons/${id}/vocabulary`),
  createLesson: (data) => request('/lessons', { method: 'POST', body: JSON.stringify(data) }),
  updateLesson: (id, data) => request(`/lessons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLesson: (id) => request(`/lessons/${id}`, { method: 'DELETE' }),
};

export const assessmentApi = {
  getAssessment: (id) => request(`/assessments/${id}`),
  submitAssessment: (id, data) => request(`/assessments/${id}/submit`, { method: 'POST', body: JSON.stringify(data) }),
  getHistory: () => request('/assessments/history'),
  getResult: (id) => request(`/assessments/result/${id}`),
};

export const adaptiveApi = {
  getMistakes: (params = '') => request(`/adaptive/mistakes${params ? `?${params}` : ''}`),
  practiceMistake: (questionId, user_answer) => request(`/adaptive/mistakes/${questionId}/practice`, {
    method: 'POST',
    body: JSON.stringify({ user_answer }),
  }),
  getSkills: () => request('/adaptive/skills'),
  getRecommendations: () => request('/adaptive/recommendations'),
};

export const aiApi = {
  chat: (message) => request('/ai/chat', { method: 'POST', body: JSON.stringify({ message }) }),
};

export const gamificationApi = {
  getStreak: () => request('/gamification/streak'),
  getDailyMission: () => request('/gamification/daily-mission'),
  getAchievements: () => request('/gamification/achievements'),
  generateCertificate: (courseId) => request(`/gamification/certificate/${courseId}`, { method: 'POST' }),
  getCertificates: () => request('/gamification/certificates'),
};

export const adminApi = {
  getDashboardStats: () => request('/admin/dashboard'),
  getUsers: (params = '') => request(`/admin/users${params ? `?${params}` : ''}`),
  getUserDetails: (id) => request(`/admin/users/${id}`),
  toggleUserStatus: (id, is_active) => request(`/admin/users/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ is_active }),
  }),
  getQuestions: (params = '') => request(`/admin/questions${params ? `?${params}` : ''}`),
  createQuestion: (data) => request('/admin/questions', { method: 'POST', body: JSON.stringify(data) }),
  updateQuestion: (id, data) => request(`/admin/questions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteQuestion: (id) => request(`/admin/questions/${id}`, { method: 'DELETE' }),
};

export const analyticsApi = {
  getDifficultTopics: () => request('/analytics/difficult-topics'),
  getAtRiskLearners: () => request('/analytics/at-risk-learners'),
  getSkillDistribution: () => request('/analytics/skill-distribution'),
};

export const reportApi = {
  getProgressReport: (format = 'json') => request(`/reports/progress${format === 'csv' ? '?format=csv' : ''}`),
  getAssessmentReport: (format = 'json') => request(`/reports/assessments${format === 'csv' ? '?format=csv' : ''}`),
  getCourseReport: (format = 'json') => request(`/reports/courses${format === 'csv' ? '?format=csv' : ''}`),
};

export const healthApi = {
  checkHealth: () => request('/health'),
};

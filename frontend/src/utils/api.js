import axios from 'axios';

const api = axios.create({
  baseURL: '/api',          // Vite proxy handles → localhost:5000
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor
api.interceptors.request.use(config => {
  return config;
}, error => Promise.reject(error));

// Response interceptor
api.interceptors.response.use(
  res => res,
  error => {
    const message = error.response?.data?.error || error.message || 'Network error';
    console.error(`API Error [${error.response?.status}]:`, message);
    return Promise.reject(new Error(message));
  }
);

export default api;

// ── API helpers ─────────────────────────────────────────────────────────────
export const usersAPI = {
  create: (data)         => api.post('/users', data),
  get:    (id)           => api.get(`/users/${id}`),
  update: (id, data)     => api.put(`/users/${id}`, data),
  addXP:  (id, data)     => api.post(`/users/${id}/xp`, data),
};

export const subjectsAPI = {
  list:   (userId)       => api.get(`/subjects/${userId}`),
  create: (data)         => api.post('/subjects', data),
  update: (id, data)     => api.put(`/subjects/${id}`, data),
  delete: (id)           => api.delete(`/subjects/${id}`),
  priorities: (userId)   => api.get(`/subjects/${userId}/priorities`),
};

export const timetableAPI = {
  generate:    (userId)  => api.post(`/timetable/generate/${userId}`),
  getActive:   (userId)  => api.get(`/timetable/active/${userId}`),
  completeTask:(id,d,t)  => api.patch(`/timetable/${id}/task/${d}/${t}/complete`),
  redistribute:(id,body) => api.post(`/timetable/${id}/redistribute`, body),
};

export const analyticsAPI = {
  get:    (userId, days) => api.get(`/analytics/${userId}`, { params: { days } }),
  log:    (data)         => api.post('/analytics', data),
};

export const tasksAPI = {
  today: (userId)        => api.get(`/tasks/today/${userId}`),
};

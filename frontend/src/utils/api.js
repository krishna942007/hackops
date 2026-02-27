import axios from "axios";

/* ================= AXIOS INSTANCE ================= */
const api = axios.create({
  baseURL: "/api", // Vite proxy → localhost:5000
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // 🔐 If token expired or unauthorized
    if (status === 401) {
      console.warn("Unauthorized. Logging out...");

      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      window.location.href = "/login";
    }

    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Network error";

    console.error(`API Error [${status}]:`, message);

    return Promise.reject(new Error(message));
  }
);

export default api;

/* ───────────────────────────────────────────── */
/*                API HELPERS                    */
/* ───────────────────────────────────────────── */

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  google: (data) => api.post("/auth/google", data),
};

export const usersAPI = {
  create: (data) => api.post("/users", data),
  get: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  addXP: (id, data) => api.post(`/users/${id}/xp`, data),
};

export const subjectsAPI = {
  list: (userId) => api.get(`/subjects/${userId}`),
  create: (data) => api.post("/subjects", data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`),
  priorities: (userId) =>
    api.get(`/subjects/${userId}/priorities`),
};

export const timetableAPI = {
  generate: (userId) =>
    api.post(`/timetable/generate/${userId}`),
  getActive: (userId) =>
    api.get(`/timetable/active/${userId}`),
  completeTask: (id, d, t) =>
    api.patch(`/timetable/${id}/task/${d}/${t}/complete`),
  redistribute: (id, body) =>
    api.post(`/timetable/${id}/redistribute`, body),
};

export const analyticsAPI = {
  get: (userId, days) =>
    api.get(`/analytics/${userId}`, { params: { days } }),
  log: (data) => api.post("/analytics", data),
};

export const tasksAPI = {
  today: (userId) =>
    api.get(`/tasks/today/${userId}`),
};
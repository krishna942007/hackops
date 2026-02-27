import api from './api';

export const aiAPI = {
  chat:     (message, userId) => api.post('/ai/chat',     { message, userId }),
  analyse:  (userId, extra)   => api.post('/ai/analyse',  { userId, ...extra }),
  strategy: (userId)          => api.post('/ai/strategy', { userId }),
};

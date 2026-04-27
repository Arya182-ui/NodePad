import axios from 'axios';
import { auth } from '../config/firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Public API instance (no auth required)
const publicApi = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach Firebase ID token to every request
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unwrap response & handle errors
api.interceptors.response.use(
  (res) => res.data,
  async (err) => {
    const config = err.config;
    // Retry once on network errors or 5xx (not on 4xx)
    if (!config._retried && (!err.response || err.response.status >= 500)) {
      config._retried = true;
      await new Promise(r => setTimeout(r, 800)); // brief back-off
      return api(config);
    }
    const message = err.response?.data?.message || err.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// Public API response handler
publicApi.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.message || err.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const notesAPI = {
  // pagination: pass cursor (updatedAt of last item) and limit
  getAll:          (cursor, limit = 50) => {
    const params = new URLSearchParams({ limit });
    if (cursor) params.set('cursor', cursor);
    return api.get(`/notes?${params}`);
  },
  getById:         (id)       => api.get(`/notes/${id}`),
  create:          (data)     => api.post('/notes', data),
  update:          (id, data) => api.put(`/notes/${id}`, data),
  delete:          (id)       => api.delete(`/notes/${id}`),
  restore:         (id)       => api.post(`/notes/${id}/restore`),
  permanentDelete: (id)       => api.delete(`/notes/${id}/permanent`),
  duplicate:       (id)       => api.post(`/notes/${id}/duplicate`),
  getTrash:        ()         => api.get('/notes/trash'),
  // q = text search, tag = exact tag filter
  search: (q, tag) => {
    const params = new URLSearchParams();
    if (q)   params.set('q', q);
    if (tag) params.set('tag', tag);
    return api.get(`/notes/search?${params}`);
  },
  // version history
  getVersions:     (id)              => api.get(`/notes/${id}/versions`),
  restoreVersion:  (id, versionId)   => api.post(`/notes/${id}/versions/${versionId}/restore`),
  // sharing
  createShareLink: (id)              => api.post(`/notes/${id}/share`),
  revokeShareLink: (id)              => api.delete(`/notes/${id}/share`),
  getSharedNote:   (shareId)         => publicApi.get(`/notes/shared/${shareId}`),
  // bulk operations
  bulkDelete:   (ids) => Promise.all(ids.map(id => api.delete(`/notes/${id}`))),
  bulkRestore:  (ids) => Promise.all(ids.map(id => api.post(`/notes/${id}/restore`))),
  bulkPermanentDelete: (ids) => Promise.all(ids.map(id => api.delete(`/notes/${id}/permanent`))),
};

export const uploadAPI = {
  uploadImage: (file) => {
    const form = new FormData();
    form.append('image', file);
    return api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

import api from './axios';

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  getContents: (status) => api.get('/admin/contents', { params: status ? { status } : {} }),
  approve: (contentId) => api.patch(`/admin/contents/${contentId}/approve`),
  reject: (contentId, reason) => api.patch(`/admin/contents/${contentId}/reject`, { reason }),
  downloadReportPdf: () => api.get('/admin/reports/pdf', { responseType: 'blob' }),
};

export default adminApi;

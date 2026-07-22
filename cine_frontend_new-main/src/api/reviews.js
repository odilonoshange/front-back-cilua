import api from './axios';

export const reviewsApi = {
  // Reviews (comentários) pertencem a um Content: Content -> reviews[]
  // Endpoints reais do backend: ReviewController (/api/contents/{id}/comments)
  // e CommentController (/api/comments/{id})
  getByContentId: (contentId) => api.get(`/contents/${contentId}/comments`),
  create: (contentId, data) => api.post(`/contents/${contentId}/comments`, data),
  delete: (reviewId) => api.delete(`/comments/${reviewId}`),
};

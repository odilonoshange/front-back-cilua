import api from './axios';

const mockContents = [];

const fallback = (data) => Promise.resolve({ data });

export const contentsApi = {
  getAll: (params) => api.get('/contents', { params }).catch(() => fallback({ contents: mockContents })),
  // Publicações do próprio estúdio/grupo, em qualquer estado (pendente,
  // aprovado, rejeitado) — para o painel do autor ver o que falta validar.
  getMine: (ownerId) => api.get('/contents/mine', { params: { ownerId } }),
  getById: (id) => api.get(`/contents/${id}`).catch(() => {
    const item = mockContents.find((c) => c.id === id) || mockContents[0] || null;
    return fallback(item);
  }),
  create: (data) => {
    // Backend expects only JSON with URLs (no multipart)
    return api.post('/contents', data);
  },
  // Atualiza os dados completos do conteúdo (título, sinopse, data, local, etc).
  // Corresponde a PUT /api/contents/{id} (ContentRegistrationRequest).
  update: (id, data) => api.put(`/contents/${id}`, data),
  // Atualiza apenas o vídeo (2ª etapa do fluxo de publicação).
  // Corresponde a PATCH /api/contents/{id}/video (ContentUpdateRequest).
  updateVideo: (id, videoUrl, coverUrl) => api.patch(`/contents/${id}/video`, { videoUrl, coverUrl }),
  delete: (id) => api.delete(`/contents/${id}`),
};

export default contentsApi;

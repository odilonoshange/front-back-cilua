import api from './axios';

// Upload real: envia o ficheiro (multipart/form-data) para o backend, que o
// grava em disco e devolve o URL público real do ficheiro guardado.
//
// Antes, esta função (simulateExternalUpload) não enviava o ficheiro a
// lado nenhum: apenas fabricava um URL falso em "https://cdn.example.com/...".
// Esse domínio não existe/não serve o vídeo, por isso o <video> na página de
// Streaming nunca conseguia reproduzir nada (era exactamente essa a causa
// da reprodução falhar).

const toFormData = (formDataOrFile) => {
  if (typeof FormData !== 'undefined' && formDataOrFile instanceof FormData) {
    return formDataOrFile;
  }
  const fd = new FormData();
  fd.append('file', formDataOrFile);
  return fd;
};

export const uploadsApi = {
  uploadImage: (formDataOrFile, config) =>
    api.post('/uploads/image', toFormData(formDataOrFile), {
      ...config,
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  uploadVideo: (formDataOrFile, config) =>
    api.post('/uploads/video', toFormData(formDataOrFile), {
      ...config,
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

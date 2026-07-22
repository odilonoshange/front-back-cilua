import api from './axios';
import { USER_TYPE } from '../constants/enums';

// O backend ainda não tem autenticação/JWT (ver relatório de alinhamento).
// Login e registo devolvem apenas o perfil do utilizador (UserProfileResponse),
// sem token. Para manter o resto da app (interceptor 401, rotas protegidas)
// a funcionar sem grandes alterações, geramos aqui um "token" local a partir
// do id do utilizador. Isto NÃO é seguro para produção; quando o backend
// tiver JWT, basta passar a usar o token real que ele devolver.
const buildSessionToken = (user) => `local-session-${user.id}`;

const mockUsers = {
  admin: {
    user: {
      id: 'admin',
      name: 'Administrador Comum',
      email: 'admin@local',
      role: USER_TYPE.VIEWER,
    },
  },
  root: {
    user: {
      id: 'root',
      name: 'Estúdio Root',
      email: 'root@local',
      role: USER_TYPE.STUDIO,
    },
  },
};

const isMockLogin = (credentials) => {
  const key = credentials.email?.toLowerCase?.();
  return key && (key === 'admin' || key === 'root') && credentials.password === key;
};

const withToken = (response) => ({
  ...response,
  data: {
    user: response.data,
    token: buildSessionToken(response.data),
  },
});

export const authApi = {
  login: (credentials) => {
    if (isMockLogin(credentials)) {
      const key = credentials.email.toLowerCase();
      const mock = mockUsers[key];
      return Promise.resolve({ data: { user: mock.user, token: `mock-token-${key}` } });
    }
    return api
      .post('/users/login', { email: credentials.email, password: credentials.password })
      .then(withToken);
  },

  // Regista um utilizador normal (viewer)
  register: (data) =>
    api
      .post('/users', {
        name: data.name,
        email: data.email,
        password: data.password,
        role: USER_TYPE.VIEWER,
      })
      .then(withToken),

  // Regista um estúdio/produtor. O backend só guarda name/email/password/role;
  // campos como NIF e telefone não existem no modelo atual e não são enviados.
  registerStudio: (data) =>
    api
      .post('/users', {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role || USER_TYPE.STUDIO,
      })
      .then(withToken),

  getProfile: (userId) => api.get(`/users/${userId}`),
  updateProfile: (userId, data) => api.patch(`/users/${userId}`, { name: data.name }),
};

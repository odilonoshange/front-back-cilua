/**
 * Enums do backend
 * Valores exatos enviados e recebidos (ver UserRole.java e TypeContent.java)
 *
 * O backend distingue dois tipos de "produtor" (FILM_PRODUCER e
 * THEATER_PRODUCER) em vez de um único "STUDIO" genérico. Mantemos a chave
 * STUDIO no frontend por simplicidade de UI (um só fluxo de registo de
 * estúdio), mas o valor enviado à API é sempre um dos dois papéis reais.
 */

export const USER_TYPE = {
  VIEWER: 'NORMAL_USER',
  STUDIO: 'FILM_PRODUCER',
  THEATER_STUDIO: 'THEATER_PRODUCER',
  ADMIN: 'ADMIN',
};

export const CONTENT_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

export const CONTENT_STATUS_LABELS = {
  [CONTENT_STATUS.PENDING]: 'Pendente de validação',
  [CONTENT_STATUS.APPROVED]: 'Aprovado',
  [CONTENT_STATUS.REJECTED]: 'Rejeitado',
};

export const CONTENT_TYPE = {
  FILM: 'FILM',
  THEATER: 'THEATER',
};

export const CONTENT_TYPE_LABELS = {
  [CONTENT_TYPE.FILM]: 'Filme',
  [CONTENT_TYPE.THEATER]: 'Teatro',
};

export const DEFAULT_USER_TYPE = USER_TYPE.VIEWER;
export const DEFAULT_CONTENT_TYPE = CONTENT_TYPE.FILM;

// Verdadeiro para qualquer tipo de produtor/estúdio (filme ou teatro).
export const isProducerRole = (role) =>
  role === USER_TYPE.STUDIO || role === USER_TYPE.THEATER_STUDIO;

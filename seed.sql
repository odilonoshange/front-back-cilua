-- ============================================================
-- CINE ANGOLA / LUANDA AUDIOVISUAL
-- Seed Data
-- ============================================================
--
-- Este script insere apenas dados iniciais para desenvolvimento.
--
-- IMPORTANTE:
-- As passwords devem ser armazenadas como hashes BCrypt.
-- Não inserir passwords em texto puro.
--
-- Execute este script APÓS o 01-schema.sql.
-- ============================================================

USE luandaaudiovisual;


-- ============================================================
-- ADMINISTRATOR
-- ============================================================
--
-- O hash abaixo é apenas um exemplo.
-- Gere um hash BCrypt real antes de utilizar.
--
-- Recomenda-se criar o administrador através de um mecanismo
-- seguro de inicialização da aplicação em vez de manter uma
-- password administrativa fixa no repositório.
-- ============================================================

INSERT INTO users (
    name,
    email,
    password,
    role
)
VALUES (
    'Administrador',
    'admin@cineangola.ao',
    '$2a$10$aeQgv4t.Oa.MByy7HQKZmeBNjyrMXg6ibwClEnZyPDLsvx8ACkNHe',
    'ADMIN'
);


-- ============================================================
-- SAMPLE NORMAL USER
-- ============================================================

INSERT INTO users (
    name,
    email,
    password,
    role
)
VALUES (
    'Utilizador de Teste',
    'user@example.com',
    '$2a$10$PSzzKB9.2nMVzEUgKu0P5.oFqoFCODFoBWwTQs7d/bWHwAAj4M3/a',
    'NORMAL_USER'
);


-- ============================================================
-- SAMPLE FILM PRODUCER
-- ============================================================

INSERT INTO users (
    name,
    email,
    password,
    role
)
VALUES (
    'Produtor de Filme',
    'produtor.filme@example.com',
    '$2a$10$oNyOCOjFAb9oNHy7eBaCROWu6.AvqAOXUPv6Yf8jAm9aw4BPIgCmq',
    'FILM_PRODUCER'
);


-- ============================================================
-- SAMPLE THEATER PRODUCER
-- ============================================================

INSERT INTO users (
    name,
    email,
    password,
    role
)
VALUES (
    'Produtor de Teatro',
    'produtor.teatro@example.com',
    '$2a$10$JqnxaydMhD/tPqybhwKiO.XEzmmDzbmk7n95eMCZWIkaJR19rCUCa',
    'THEATER_PRODUCER'
);
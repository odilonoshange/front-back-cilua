-- Migração para adicionar o papel de Administrador e o fluxo de validação
-- de publicações. Corre isto na tua base de dados `luandaaudiovisual`
-- já existente (o Hibernate, com ddl-auto=update, cria sozinho as colunas
-- novas simples, mas NÃO alarga um ENUM do MySQL que já existia nem
-- preenche os dados — por isso este script trata disso à mão).

-- 1. Alargar o ENUM de role do utilizador para incluir ADMIN.
ALTER TABLE `user`
  MODIFY `role` ENUM('FILM_PRODUCER','NORMAL_USER','THEATER_PRODUCER','ADMIN') DEFAULT NULL;

-- 2. Criar a conta de administrador (não pode nascer do registo público).
--    Troca a password antes de usar em produção.
INSERT INTO `user` (`name`, `email`, `password`, `role`)
VALUES ('Administrador', 'admin@cineangola.ao', 'admin123', 'ADMIN');

-- 3. As colunas novas em `content` (owner_id, status, rejection_reason,
--    reviewed_at) já vão ser criadas automaticamente pelo Hibernate
--    (spring.jpa.hibernate.ddl-auto=update) na próxima vez que arrancares
--    o backend. Depois disso, corre esta linha para que o conteúdo já
--    existente na tabela não fique invisível no catálogo (senão fica com
--    status NULL e não aparece como aprovado nem pendente):

UPDATE `content` SET `status` = 'APPROVED' WHERE `status` IS NULL;

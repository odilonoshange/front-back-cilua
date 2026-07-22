-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 15/07/2026 às 12:23
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `luandaaudiovisual`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `content`
--

CREATE TABLE `content` (
  `id` bigint(20) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `cover_url` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `event_date` date DEFAULT NULL,
  `event_location` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `type_content` enum('FILM','THEATER') DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `owner_id` bigint(20) DEFAULT NULL,
  `status` enum('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
  `rejection_reason` text DEFAULT NULL,
  `reviewed_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `content`
--

INSERT INTO `content` (`id`, `category`, `cover_url`, `description`, `details`, `event_date`, `event_location`, `title`, `type_content`, `video_url`, `owner_id`, `status`) VALUES
(1, 'workshop', 'https://cdn.example.com/ChatGPT_Image_13_07_2026__07_01_40_-_Copia.png', 'ideas de  alguns modelos que iras ser produzido futuramente', 'feito em Luanda sera uma produção inedida', '2026-07-14', 'Redes socias', 'Sleep Man', 'FILM', 'https://cdn.example.com/__bom_enterder_isso_Refr_o.mp4', 2, 'APPROVED');

-- --------------------------------------------------------

--
-- Estrutura para tabela `review`
--

CREATE TABLE `review` (
  `id` bigint(20) NOT NULL,
  `commentary` varchar(255) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `content` bigint(20) DEFAULT NULL,
  `user` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `user`
--

CREATE TABLE `user` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('FILM_PRODUCER','NORMAL_USER','THEATER_PRODUCER','ADMIN') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `user`
--

INSERT INTO `user` (`id`, `email`, `name`, `password`, `role`) VALUES
(1, 'laurindolacrao5@gmail.com', 'Laurindo Laury', 'laurindo', 'NORMAL_USER'),
(2, 'verdadeirafe@gmail.com', 'Smiles', 'verdadeirafe', 'FILM_PRODUCER'),
(3, 'admin@cineangola.ao', 'Administrador', 'admin123', 'ADMIN');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `content`
--
ALTER TABLE `content`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK1q4f2rvvvkc9pemnvkbr08v36` (`content`),
  ADD KEY `FK85vsmrwnkrmubkrlmqwm7ucjg` (`user`);

--
-- Índices de tabela `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKob8kqyqqgmefl0aco34akdtpe` (`email`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `content`
--
ALTER TABLE `content`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `review`
--
ALTER TABLE `review`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `user`
--
ALTER TABLE `user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `FK1q4f2rvvvkc9pemnvkbr08v36` FOREIGN KEY (`content`) REFERENCES `content` (`id`),
  ADD CONSTRAINT `FK85vsmrwnkrmubkrlmqwm7ucjg` FOREIGN KEY (`user`) REFERENCES `user` (`id`);

--
-- Restrições para tabela `content` (dono da publicação)
--
ALTER TABLE `content`
  ADD CONSTRAINT `FKcontent_owner` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

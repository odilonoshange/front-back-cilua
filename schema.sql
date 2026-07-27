-- ============================================================
-- CINE TEATRO / LUANDA AUDIOVISUAL
-- Database Initialization Script
-- MySQL 8.x / MariaDB 10.4+
-- ============================================================

CREATE DATABASE IF NOT EXISTS luandaaudiovisual
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE luandaaudiovisual;

SET NAMES utf8mb4;

-- ============================================================
-- TABLE: users
-- ============================================================

CREATE TABLE users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM(
        'FILM_PRODUCER',
        'NORMAL_USER',
        'THEATER_PRODUCER',
        'ADMIN'
    ) NOT NULL,

    PRIMARY KEY (id),
    CONSTRAINT uk_users_email UNIQUE (email)
) ENGINE=InnoDB
  DEFAULT CHARACTER SET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- TABLE: contents
-- ============================================================

CREATE TABLE contents (
    id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    type_content ENUM(
        'FILM',
        'THEATER'
    ) NOT NULL,

    description TEXT NULL,
    details TEXT NULL,

    cover_url VARCHAR(500) NOT NULL,
    video_url VARCHAR(500) NULL,

    event_date DATE NULL,
    event_location VARCHAR(255) NULL,

    status ENUM(
        'PENDING',
        'APPROVED',
        'REJECTED'
    ) NOT NULL DEFAULT 'PENDING',

    rejection_reason TEXT NULL,
    reviewed_at DATETIME NULL,

    owner_id BIGINT NOT NULL,

    PRIMARY KEY (id),

    CONSTRAINT fk_contents_owner
        FOREIGN KEY (owner_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_contents_owner_id (owner_id),
    INDEX idx_contents_status (status),
    INDEX idx_contents_type (type_content),
    INDEX idx_contents_category (category),
    INDEX idx_contents_event_date (event_date)
) ENGINE=InnoDB
  DEFAULT CHARACTER SET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- TABLE: reviews
-- ============================================================

CREATE TABLE reviews (
    id BIGINT NOT NULL AUTO_INCREMENT,

    commentary VARCHAR(255) NULL,
    rating INT NOT NULL,

    content_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,

    PRIMARY KEY (id),

    CONSTRAINT fk_reviews_content
        FOREIGN KEY (content_id)
        REFERENCES contents(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_reviews_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_reviews_rating
        CHECK (rating BETWEEN 1 AND 5),

    INDEX idx_reviews_content_id (content_id),
    INDEX idx_reviews_user_id (user_id)
) ENGINE=InnoDB
  DEFAULT CHARACTER SET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;
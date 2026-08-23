-- ============================================================
-- 이웃집 판다 (Village App) - MySQL 스키마
-- Supabase(Postgres) → MySQL 8.0+ 마이그레이션용 DDL
-- ============================================================
-- 설계 노트:
--   - uuid는 MySQL 네이티브 타입이 없어 CHAR(36)으로 사용
--     (인덱싱 성능이 중요해지면 나중에 BINARY(16)으로 전환 고려)
--   - Supabase Auth가 관리하던 Users 테이블을 직접 만듦
--     (email/password 인증을 자체 구현하므로 필요)
--   - RLS가 없으므로 모든 접근 제어는 애플리케이션(미들웨어) 레벨에서 처리
--   - Realtime 관련 트리거/로직은 없음 (Socket.io 등 별도 서버에서 처리)
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- Users (Supabase Auth 대체)
-- ------------------------------------------------------------
CREATE TABLE users (
    id                  CHAR(36)      NOT NULL,
    email               VARCHAR(255)  NOT NULL,
    encrypted_password  VARCHAR(255)  NOT NULL,
    created_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Profile (프로필)
-- ------------------------------------------------------------
CREATE TABLE profile (
    id        CHAR(36)     NOT NULL,
    nickname  VARCHAR(20)  NOT NULL,
    mileage   INT          NOT NULL DEFAULT 0,
    level     INT          NOT NULL DEFAULT 1,
    deleted_at TIMESTAMP   NULL DEFAULT NULL,  -- MM-007 소프트 삭제용

    PRIMARY KEY (id),
    UNIQUE KEY uq_profile_nickname (nickname),
    CONSTRAINT fk_profile_user
        FOREIGN KEY (id) REFERENCES users(id)
        ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Location (장소)
-- ------------------------------------------------------------
CREATE TABLE location (
    user_id     CHAR(36)  NOT NULL,
    c           TEXT      NOT NULL,   -- 시
    n           TEXT,                 -- 군
    g           TEXT,                 -- 구
    u           TEXT,                 -- 읍
    m           TEXT,                 -- 면
    d           TEXT,                 -- 동
    region_key  VARCHAR(255) NOT NULL,

    PRIMARY KEY (user_id),
    KEY idx_location_region_key (region_key),
    CONSTRAINT fk_location_profile
        FOREIGN KEY (user_id) REFERENCES profile(id)
        ON UPDATE RESTRICT ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Character (캐릭터)
-- ------------------------------------------------------------
CREATE TABLE character_customization (
    user_id  CHAR(36)     NOT NULL,
    gender   VARCHAR(10)  NOT NULL,
    color1   VARCHAR(7)   DEFAULT '#000000',
    color2   VARCHAR(7)   DEFAULT '#000000',

    PRIMARY KEY (user_id),
    CONSTRAINT chk_character_gender CHECK (gender IN ('여성', '남성')),
    CONSTRAINT fk_character_profile
        FOREIGN KEY (user_id) REFERENCES profile(id)
        ON UPDATE RESTRICT ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Villages (마을)
-- ------------------------------------------------------------
CREATE TABLE villages (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    name        VARCHAR(255) NOT NULL,
    region_key  VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_villages_region_key (region_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Items (소지품)
-- ------------------------------------------------------------
CREATE TABLE items (
    id               BIGINT       NOT NULL AUTO_INCREMENT,
    name             VARCHAR(255) NOT NULL,
    count             INT          NOT NULL DEFAULT 1,
    storage          VARCHAR(255) NOT NULL,
    img              TEXT,
    purchase_date    TIMESTAMP    NULL DEFAULT NULL,
    expiration_date  TIMESTAMP    NULL DEFAULT NULL,
    user_id          CHAR(36)     NOT NULL,

    PRIMARY KEY (id),
    KEY idx_items_user_id (user_id),
    KEY idx_items_expiration_date (expiration_date),
    CONSTRAINT fk_items_profile
        FOREIGN KEY (user_id) REFERENCES profile(id)
        ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Products (상품)
-- ------------------------------------------------------------
CREATE TABLE products (
    id         BIGINT    NOT NULL AUTO_INCREMENT,
    item_id    BIGINT    NOT NULL,
    buyer_id   CHAR(36)  NULL DEFAULT NULL,
    mileage    INT       NOT NULL,
    sale_date  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    pick       VARCHAR(20) NOT NULL DEFAULT '대기중',

    PRIMARY KEY (id),
    KEY idx_products_item_id (item_id),
    KEY idx_products_buyer_id (buyer_id),
    KEY idx_products_pick (pick),
    CONSTRAINT chk_products_pick CHECK (pick IN ('대기중', '거래 신청중', '거래 완료')),
    CONSTRAINT fk_products_item
        FOREIGN KEY (item_id) REFERENCES items(id)
        ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT fk_products_buyer
        FOREIGN KEY (buyer_id) REFERENCES profile(id)
        ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Category (카테고리)
-- ------------------------------------------------------------
CREATE TABLE category (
    id    BIGINT       NOT NULL AUTO_INCREMENT,
    name  VARCHAR(255) NOT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uq_category_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Category_with_Item (아이템의 카테고리)
-- ------------------------------------------------------------
CREATE TABLE category_with_item (
    id           BIGINT NOT NULL AUTO_INCREMENT,
    item_id      BIGINT NOT NULL,
    category_id  BIGINT NOT NULL,

    PRIMARY KEY (id),
    KEY idx_cwi_item_id (item_id),
    KEY idx_cwi_category_id (category_id),
    CONSTRAINT fk_cwi_item
        FOREIGN KEY (item_id) REFERENCES items(id)
        ON UPDATE RESTRICT ON DELETE CASCADE,
    CONSTRAINT fk_cwi_category
        FOREIGN KEY (category_id) REFERENCES category(id)
        ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Chat_Room (채팅방)
-- ------------------------------------------------------------
CREATE TABLE chat_room (
    id          BIGINT    NOT NULL AUTO_INCREMENT,
    product_id  BIGINT    NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_chat_room_product_id (product_id),
    CONSTRAINT fk_chat_room_product
        FOREIGN KEY (product_id) REFERENCES products(id)
        ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Chat_User (채팅방 사용자)
-- ------------------------------------------------------------
CREATE TABLE chat_user (
    id           BIGINT    NOT NULL AUTO_INCREMENT,
    chatroom_id  BIGINT    NOT NULL,
    user_id      CHAR(36)  NOT NULL,

    PRIMARY KEY (id),
    KEY idx_chat_user_chatroom_id (chatroom_id),
    KEY idx_chat_user_user_id (user_id),
    CONSTRAINT fk_chat_user_room
        FOREIGN KEY (chatroom_id) REFERENCES chat_room(id)
        ON UPDATE RESTRICT ON DELETE CASCADE,
    CONSTRAINT fk_chat_user_profile
        FOREIGN KEY (user_id) REFERENCES profile(id)
        ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Chat (채팅)
-- ------------------------------------------------------------
CREATE TABLE chat (
    id           BIGINT    NOT NULL AUTO_INCREMENT,
    chatroom_id  BIGINT    NOT NULL,
    user_id      CHAR(36)  NOT NULL,
    comment      TEXT      NOT NULL,
    datetime     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_chat_chatroom_id (chatroom_id),
    KEY idx_chat_user_id (user_id),
    CONSTRAINT fk_chat_room2
        FOREIGN KEY (chatroom_id) REFERENCES chat_room(id)
        ON UPDATE RESTRICT ON DELETE CASCADE,
    CONSTRAINT fk_chat_profile
        FOREIGN KEY (user_id) REFERENCES profile(id)
        ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
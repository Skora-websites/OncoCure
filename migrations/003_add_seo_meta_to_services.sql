-- =============================================================================
-- Migration: 003_add_seo_meta_to_services.sql
-- Description: Idempotently adds metaTitle, metaKeywords, metaDescription,
--              and image to the services table.
-- =============================================================================

-- PostgreSQL / SQLite 3.35.0+ syntax with IF NOT EXISTS
ALTER TABLE services ADD COLUMN IF NOT EXISTS metaTitle VARCHAR(255);
ALTER TABLE services ADD COLUMN IF NOT EXISTS metaKeywords VARCHAR(500);
ALTER TABLE services ADD COLUMN IF NOT EXISTS metaDescription VARCHAR(500);
ALTER TABLE services ADD COLUMN IF NOT EXISTS image VARCHAR(255);

-- MySQL / MariaDB idempotent procedure (if running MySQL):
-- DELIMITER $$
-- CREATE PROCEDURE AddServiceSeoColumnsIdempotent()
-- BEGIN
--   IF NOT EXISTS (
--     SELECT * FROM information_schema.COLUMNS 
--     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'services' AND COLUMN_NAME = 'metaTitle'
--   ) THEN
--     ALTER TABLE services ADD COLUMN metaTitle VARCHAR(255) NULL;
--   END IF;
-- 
--   IF NOT EXISTS (
--     SELECT * FROM information_schema.COLUMNS 
--     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'services' AND COLUMN_NAME = 'metaKeywords'
--   ) THEN
--     ALTER TABLE services ADD COLUMN metaKeywords VARCHAR(500) NULL;
--   END IF;
-- 
--   IF NOT EXISTS (
--     SELECT * FROM information_schema.COLUMNS 
--     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'services' AND COLUMN_NAME = 'metaDescription'
--   ) THEN
--     ALTER TABLE services ADD COLUMN metaDescription VARCHAR(500) NULL;
--   END IF;
-- 
--   IF NOT EXISTS (
--     SELECT * FROM information_schema.COLUMNS 
--     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'services' AND COLUMN_NAME = 'image'
--   ) THEN
--     ALTER TABLE services ADD COLUMN image VARCHAR(255) NULL;
--   END IF;
-- END$$
-- DELIMITER ;
-- CALL AddServiceSeoColumnsIdempotent();
-- DROP PROCEDURE IF EXISTS AddServiceSeoColumnsIdempotent;

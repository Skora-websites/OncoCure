-- =============================================================================
-- Migration: 002_add_seo_meta_to_blogs.sql
-- Description: Idempotently adds metaTitle, metaKeywords, and metaDescription
--              to the blogs table. Safe to re-run multiple times without error.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- PostgreSQL / SQLite 3.35.0+ syntax with IF NOT EXISTS
-- -----------------------------------------------------------------------------
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS metaTitle VARCHAR(255);
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS metaKeywords VARCHAR(500);
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS metaDescription VARCHAR(500);

-- -----------------------------------------------------------------------------
-- MySQL / MariaDB (Procedure for versions without native ALTER TABLE IF NOT EXISTS)
-- -----------------------------------------------------------------------------
-- DELIMITER $$
-- CREATE PROCEDURE AddBlogSeoColumnsIdempotent()
-- BEGIN
--   IF NOT EXISTS (
--     SELECT * FROM information_schema.COLUMNS 
--     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'blogs' AND COLUMN_NAME = 'metaTitle'
--   ) THEN
--     ALTER TABLE blogs ADD COLUMN metaTitle VARCHAR(255) NULL;
--   END IF;
-- 
--   IF NOT EXISTS (
--     SELECT * FROM information_schema.COLUMNS 
--     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'blogs' AND COLUMN_NAME = 'metaKeywords'
--   ) THEN
--     ALTER TABLE blogs ADD COLUMN metaKeywords VARCHAR(500) NULL;
--   END IF;
-- 
--   IF NOT EXISTS (
--     SELECT * FROM information_schema.COLUMNS 
--     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'blogs' AND COLUMN_NAME = 'metaDescription'
--   ) THEN
--     ALTER TABLE blogs ADD COLUMN metaDescription VARCHAR(500) NULL;
--   END IF;
-- END$$
-- DELIMITER ;
-- CALL AddBlogSeoColumnsIdempotent();
-- DROP PROCEDURE IF EXISTS AddBlogSeoColumnsIdempotent;

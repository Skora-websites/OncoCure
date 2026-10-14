-- =============================================================================
-- Migration: 004_create_page_seo_table.sql
-- Description: Creates page_seo table to manage metadata for all static pages
--              (Home, About, Services, Blogs, Contact).
-- =============================================================================

CREATE TABLE IF NOT EXISTS page_seo (
  id VARCHAR(64) PRIMARY KEY,
  path VARCHAR(255) NOT NULL UNIQUE,
  label VARCHAR(255) NOT NULL,
  metaTitle VARCHAR(255),
  metaKeywords VARCHAR(500),
  metaDescription VARCHAR(500),
  canonicalUrl VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- Migration: 005_create_admin_account_table.sql
-- Description: Creates admin_account table to store administrator credentials,
--              display name, and avatar image.
-- =============================================================================

CREATE TABLE IF NOT EXISTS admin_account (
  id VARCHAR(64) PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  image VARCHAR(255),
  role VARCHAR(100) DEFAULT 'Super Administrator',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

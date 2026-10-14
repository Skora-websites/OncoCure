-- =============================================================================
-- Migration: 001_initial_schema.sql
-- Description: Idempotent initial relational schema for Onco Cure Clinic
-- Compatible with: SQLite, MySQL, and PostgreSQL
-- =============================================================================

-- 1. Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content MEDIUMTEXT,
  category VARCHAR(100) DEFAULT 'Oncology',
  image VARCHAR(500),
  date VARCHAR(50),
  readTime VARCHAR(50),
  status VARCHAR(20) DEFAULT 'published',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Services Table
CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  groupCategory VARCHAR(100) NOT NULL,
  summary TEXT,
  description TEXT,
  covers JSON,
  tags JSON,
  accent VARCHAR(50) DEFAULT 'plum',
  orderIndex INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Consultations Table (Patient Submissions)
CREATE TABLE IF NOT EXISTS consultations (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  concern VARCHAR(255),
  message TEXT,
  status VARCHAR(50) DEFAULT 'new', -- new, contacted, scheduled, completed
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Contact Form Inquiries Table
CREATE TABLE IF NOT EXISTS contacts (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new', -- new, replied, archived
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Site Details Table (Key-Value or JSON configurations)
CREATE TABLE IF NOT EXISTS site_details (
  configKey VARCHAR(100) PRIMARY KEY,
  configValue JSON NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

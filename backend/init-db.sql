-- Initialize e-Tally database
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create indexes for better performance
-- These will be created after Prisma migrations run

-- Set up logging
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_min_duration_statement = 1000;

-- Create backup user
CREATE USER etally_backup WITH PASSWORD 'backup_password';
GRANT CONNECT ON DATABASE etally_db TO etally_backup;
GRANT USAGE ON SCHEMA public TO etally_backup;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO etally_backup;

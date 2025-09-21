-- Add indexes for polling station performance optimization
-- These indexes will significantly improve query performance for 40k+ records

-- Index on polling station code (unique, frequently searched)
CREATE UNIQUE INDEX IF NOT EXISTS "PollingStation_code_key" ON "PollingStation"("code");

-- Index on polling station name (for search operations)
CREATE INDEX IF NOT EXISTS "PollingStation_name_idx" ON "PollingStation"("name");

-- Index on constituency ID (for filtering by constituency)
CREATE INDEX IF NOT EXISTS "PollingStation_constituencyId_idx" ON "PollingStation"("constituencyId");

-- Index on CAW ID (for filtering by CAW)
CREATE INDEX IF NOT EXISTS "PollingStation_cawId_idx" ON "PollingStation"("cawId");

-- Index on isActive flag (for filtering active/inactive stations)
CREATE INDEX IF NOT EXISTS "PollingStation_isActive_idx" ON "PollingStation"("isActive");

-- Composite index for common query patterns
CREATE INDEX IF NOT EXISTS "PollingStation_constituencyId_isActive_idx" ON "PollingStation"("constituencyId", "isActive");
CREATE INDEX IF NOT EXISTS "PollingStation_cawId_isActive_idx" ON "PollingStation"("cawId", "isActive");

-- Index on created_at for sorting
CREATE INDEX IF NOT EXISTS "PollingStation_createdAt_idx" ON "PollingStation"("createdAt");

-- Index on updated_at for sorting
CREATE INDEX IF NOT EXISTS "PollingStation_updatedAt_idx" ON "PollingStation"("updatedAt");

-- Index on address for search operations
CREATE INDEX IF NOT EXISTS "PollingStation_address_idx" ON "PollingStation"("address");

-- Index on voter registration for performance
CREATE INDEX IF NOT EXISTS "VoterRegistration_pollingStationId_idx" ON "VoterRegistration"("pollingStationId");
CREATE INDEX IF NOT EXISTS "VoterRegistration_isActive_idx" ON "VoterRegistration"("isActive");
CREATE INDEX IF NOT EXISTS "VoterRegistration_pollingStationId_isActive_idx" ON "VoterRegistration"("pollingStationId", "isActive");

-- Index on constituency county relationship
CREATE INDEX IF NOT EXISTS "Constituency_countyId_idx" ON "Constituency"("countyId");

-- Index on CAW constituency relationship
CREATE INDEX IF NOT EXISTS "CAW_constituencyId_idx" ON "CAW"("constituencyId");

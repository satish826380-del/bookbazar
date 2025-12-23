-- ============================================
-- ADD LOCATION COLUMNS TO BOOKS TABLE
-- ============================================

alter table books add column if not exists latitude numeric;
alter table books add column if not exists longitude numeric;

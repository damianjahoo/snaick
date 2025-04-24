-- migration: disable row level security on the "snacks" table
-- purpose: temporarily disable row-level security for testing purposes
-- affected table: snacks
-- note: this migration disables rls to allow test inserts; ensure rls is enabled or proper policies are in place in production environments

alter table snacks disable row level security; 
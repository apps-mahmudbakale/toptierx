-- Fix hyparrow_product_id column type from INTEGER to VARCHAR
-- Drop the old column if it exists and create it correctly

BEGIN;

-- Check if column exists and is wrong type, then fix it
ALTER TABLE events 
DROP COLUMN IF EXISTS hyparrow_product_id CASCADE;

-- Create the column with correct type
ALTER TABLE events 
ADD COLUMN hyparrow_product_id VARCHAR(255);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS events_hyparrow_product_id_idx ON events(hyparrow_product_id);

COMMIT;

-- Add hyparrow_product_id column to events table
-- This stores the Hyparrow product ID for the event

ALTER TABLE events ADD COLUMN IF NOT EXISTS hyparrow_product_id VARCHAR(255);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS events_hyparrow_product_id_idx ON events(hyparrow_product_id);

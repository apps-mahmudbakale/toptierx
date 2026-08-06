-- Add payment_link_identifier column if it doesn't exist
ALTER TABLE events
ADD COLUMN IF NOT EXISTS payment_link_identifier VARCHAR(255);

-- Add payment_provider and payment_status columns to bookings if they don't exist
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(255),
ADD COLUMN IF NOT EXISTS payment_provider VARCHAR(50),
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50);

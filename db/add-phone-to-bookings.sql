-- Add customer_phone column to bookings table
-- This stores the phone number provided during ticket booking

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(20);

-- Create index for phone lookups if needed
CREATE INDEX IF NOT EXISTS bookings_customer_phone_idx ON bookings(customer_phone);

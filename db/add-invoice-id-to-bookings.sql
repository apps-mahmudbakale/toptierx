-- Add invoice_id column to bookings table
-- This stores the Hyparrow invoice ID for tracking payments

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS invoice_id VARCHAR(255);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(255);

-- Create index for invoice lookups
CREATE INDEX IF NOT EXISTS bookings_invoice_id_idx ON bookings(invoice_id);
CREATE INDEX IF NOT EXISTS bookings_payment_reference_idx ON bookings(payment_reference);

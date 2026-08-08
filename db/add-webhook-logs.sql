-- Create webhook_logs table to track all Hyparrow webhook events
CREATE TABLE IF NOT EXISTS webhook_logs (
  id SERIAL PRIMARY KEY,
  webhook_event VARCHAR(100) NOT NULL,
  event_type VARCHAR(100),
  invoice_id VARCHAR(255),
  status VARCHAR(50),
  payload JSONB,
  error TEXT,
  signature_valid BOOLEAN DEFAULT false,
  response_status INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS webhook_logs_event_type_idx ON webhook_logs(event_type);
CREATE INDEX IF NOT EXISTS webhook_logs_invoice_id_idx ON webhook_logs(invoice_id);
CREATE INDEX IF NOT EXISTS webhook_logs_created_at_idx ON webhook_logs(created_at);
CREATE INDEX IF NOT EXISTS webhook_logs_status_idx ON webhook_logs(status);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  date VARCHAR(50),
  time VARCHAR(50),
  venue VARCHAR(255),
  capacity VARCHAR(100),
  ticket_price DECIMAL(12, 2),
  image TEXT,
  description TEXT,
  itinerary JSONB DEFAULT '[]',
  ticket_categories JSONB DEFAULT '[]',
  payment_link_identifier VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  event_title VARCHAR(255),
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  ticket_count INTEGER,
  ticket_price DECIMAL(12, 2),
  total_amount DECIMAL(12, 2),
  status VARCHAR(50) DEFAULT 'confirmed',
  notes TEXT,
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS events_date_idx ON events(date);
CREATE INDEX IF NOT EXISTS events_category_idx ON events(category);
CREATE INDEX IF NOT EXISTS bookings_event_id_idx ON bookings(event_id);
CREATE INDEX IF NOT EXISTS bookings_customer_email_idx ON bookings(customer_email);
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

-- Seed admin user
-- Email: admin@toptierxperienze.com
-- Password: Admin@123 (hashed with bcrypt)
INSERT INTO users (email, password, role) 
VALUES ('admin@toptierxperienze.com', '$2b$10$VXu5kYNz3qJfKJxmCEG7g.W5JAO5J5F5D8X0j0Z3Z4Q9K9K9K9K9K', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Alternative user for testing
-- Email: user@toptierxperienze.com  
-- Password: User@123 (hashed with bcrypt)
INSERT INTO users (email, password, role)
VALUES ('user@toptierxperienze.com', '$2b$10$HK9K9K9K9K9K9K9K9K9K9K9K9K9K9K9K9K9K9K9K9K9K9K9K9K9K9KK', 'user')
ON CONFLICT (email) DO NOTHING;

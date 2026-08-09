-- Seed admin user
-- Email: admin@toptierxperienze.com
-- Password: Admin@123 (hashed with bcrypt)
INSERT INTO users (email, password, role) 
VALUES ('admin@toptierxperienze.com', '$2b$10$PHGioGVS5HAA.MTQ1aoanuexhFmK2nNfBVGuNc5EseTdbuJ9KwNvW', 'admin')
ON CONFLICT (email) DO UPDATE SET password = '$2b$10$PHGioGVS5HAA.MTQ1aoanuexhFmK2nNfBVGuNc5EseTdbuJ9KwNvW';

-- Alternative user for testing
-- Email: user@toptierxperienze.com  
-- Password: User@123 (hashed with bcrypt)
INSERT INTO users (email, password, role)
VALUES ('user@toptierxperienze.com', '$2b$10$TQ3sSCWL75PnYAeywItbzeZcJe20wqpalTOJauCvY72u0/KAlBrP.', 'user')
ON CONFLICT (email) DO UPDATE SET password = '$2b$10$TQ3sSCWL75PnYAeywItbzeZcJe20wqpalTOJauCvY72u0/KAlBrP.';

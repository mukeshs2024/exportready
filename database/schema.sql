-- =====================================
-- ExportReady Database Schema
-- =====================================

-- 1️⃣ Users Table (MSME Accounts)

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    company_name TEXT,
    country TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 2️⃣ Products Table (User Product Details)

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product_name TEXT NOT NULL,
    category TEXT,
    production_capacity INTEGER,
    target_price NUMERIC,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 3️⃣ Export Certifications Table

CREATE TABLE export_certifications (
    id SERIAL PRIMARY KEY,
    product_category TEXT,
    certification_name TEXT,
    description TEXT
);


-- 4️⃣ Country Regulations Table

CREATE TABLE country_regulations (
    id SERIAL PRIMARY KEY,
    country TEXT,
    product_category TEXT,
    required_certification TEXT,
    import_rules TEXT
);


-- 5️⃣ Market Data Table (AI Market Intelligence)

CREATE TABLE market_data (
    id SERIAL PRIMARY KEY,
    product_name TEXT,
    country TEXT,
    demand_score INTEGER,
    market_size TEXT
);


-- 6️⃣ Profit Simulation Table

CREATE TABLE profit_results (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    country TEXT,
    shipping_cost NUMERIC,
    duties NUMERIC,
    logistics_cost NUMERIC,
    profit_score INTEGER
);


-- 7️⃣ Export Reports Table (Final Export Plan)

CREATE TABLE export_reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    recommended_markets TEXT,
    compliance_checklist TEXT,
    estimated_profit NUMERIC,
    roadmap TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
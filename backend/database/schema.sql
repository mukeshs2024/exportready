-- =====================================
-- ExportReady Database Schema
-- =====================================

-- 1️⃣ Users Table (MSME Accounts)

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    company_name TEXT,
    country TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 2️⃣ Products Table (Exporter Product Details)

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    seller_id INTEGER REFERENCES users(id),
    product_name TEXT NOT NULL,
    category TEXT,
    hs_code TEXT,
    price NUMERIC,
    min_order INTEGER,
    description TEXT,
    country TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 3️⃣ Marketplace Products Table (Buyer-Facing Listings)

CREATE TABLE products_marketplace (
    id SERIAL PRIMARY KEY,
    product_name TEXT NOT NULL,
    category TEXT,
    hs_code TEXT,
    description TEXT,
    price NUMERIC,
    minimum_order_quantity INTEGER,
    country_of_origin TEXT,
    image_url TEXT,
    production_capacity INTEGER,
    exporter_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 4️⃣ Trade Requests Table (Buyer Requests to Exporters)

CREATE TABLE trade_requests (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products_marketplace(id),
    buyer_name TEXT NOT NULL,
    buyer_country TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 5️⃣ Orders Table (Buyer Orders + Negotiations)

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    buyer_id INTEGER REFERENCES users(id),
    seller_id INTEGER REFERENCES users(id),
    quantity INTEGER NOT NULL,
    delivery_country TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 6️⃣ Negotiation Offers Table (Audit Trail)

CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    sender_id INTEGER REFERENCES users(id),
    price NUMERIC NOT NULL,
    message TEXT,
    round_number INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 7️⃣ Notifications Table (Order/Negotiation Alerts)

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    order_id INTEGER REFERENCES orders(id),
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 8️⃣ Export Certifications Table

CREATE TABLE export_certifications (
    id SERIAL PRIMARY KEY,
    product_category TEXT,
    certification_name TEXT,
    description TEXT
);


-- 9️⃣ Country Regulations Table

CREATE TABLE country_regulations (
    id SERIAL PRIMARY KEY,
    country TEXT,
    product_category TEXT,
    required_certification TEXT,
    import_rules TEXT
);


-- 10️⃣ Market Data Table (AI Market Intelligence)

CREATE TABLE market_data (
    id SERIAL PRIMARY KEY,
    product_name TEXT,
    country TEXT,
    demand_score INTEGER,
    market_size TEXT
);


-- 10.1 Country Trade Data Table (Tariff & Competition)

CREATE TABLE country_trade_data (
    country TEXT PRIMARY KEY,
    region TEXT,
    tariff_percentage FLOAT,
    competition_level TEXT,
    demand_score FLOAT
);


-- 11️⃣ Profit Simulation Table

CREATE TABLE profit_results (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    country TEXT,
    shipping_cost NUMERIC,
    duties NUMERIC,
    logistics_cost NUMERIC,
    profit_score INTEGER
);


-- 12️⃣ Export Reports Table (Final Export Plan)

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


-- 13) Chat History Table (AI Memory)

CREATE TABLE chat_history (
    id SERIAL PRIMARY KEY,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
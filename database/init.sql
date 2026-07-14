-- TireHub PostgreSQL Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('buyer', 'admin', 'partner', 'seller');
CREATE TYPE product_type AS ENUM ('tire', 'wheel');
CREATE TYPE tire_season AS ENUM ('summer', 'winter', 'all_season');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE partner_type AS ENUM ('store', 'tire_service', 'pickup_point');
CREATE TYPE seller_type AS ENUM ('shop', 'private');
CREATE TYPE listing_condition AS ENUM ('new', 'used');
CREATE TYPE listing_status AS ENUM ('draft', 'pending', 'active', 'sold', 'archived');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'buyer',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    city VARCHAR(100) NOT NULL DEFAULT 'Красноярск',
    latitude DECIMAL(10, 7) DEFAULT 56.0153,
    longitude DECIMAL(10, 7) DEFAULT 92.8932,
    seller_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    type product_type NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    image_url VARCHAR(500),
    description TEXT,
    brand VARCHAR(100),
    rating DECIMAL(2, 1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE product_attributes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    width INTEGER,
    profile INTEGER,
    diameter DECIMAL(4, 1),
    pcd VARCHAR(20),
    offset_et INTEGER,
    season tire_season,
    load_index VARCHAR(10),
    speed_index VARCHAR(5),
    bolt_count INTEGER,
    UNIQUE (product_id)
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
    status order_status NOT NULL DEFAULT 'pending',
    delivery_method VARCHAR(50),
    delivery_address TEXT,
    payment_id VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_at_purchase DECIMAL(10, 2) NOT NULL CHECK (price_at_purchase >= 0)
);

CREATE TABLE garage_vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2100),
    tire_size VARCHAR(30) NOT NULL,
    install_date DATE,
    nickname VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type partner_type NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    rating DECIMAL(2, 1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    phone VARCHAR(20),
    logo_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sellers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    type seller_type NOT NULL,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    avatar_url VARCHAR(500),
    description TEXT,
    address TEXT,
    latitude DECIMAL(10, 7) NOT NULL DEFAULT 56.0153,
    longitude DECIMAL(10, 7) NOT NULL DEFAULT 92.8932,
    rating DECIMAL(2, 1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    listings_count INTEGER NOT NULL DEFAULT 0,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type product_type NOT NULL,
    condition listing_condition NOT NULL DEFAULT 'new',
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 0),
    city VARCHAR(100) NOT NULL,
    image_urls TEXT[] NOT NULL DEFAULT '{}',
    status listing_status NOT NULL DEFAULT 'active',
    views_count INTEGER NOT NULL DEFAULT 0,
    brand VARCHAR(100),
    width INTEGER,
    profile INTEGER,
    diameter DECIMAL(4, 1),
    pcd VARCHAR(20),
    offset_et INTEGER,
    season tire_season,
    bolt_count INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

CREATE INDEX idx_products_type ON products(type);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_product_attributes_season ON product_attributes(season);
CREATE INDEX idx_product_attributes_size ON product_attributes(width, profile, diameter);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_garage_vehicles_user_id ON garage_vehicles(user_id);
CREATE INDEX idx_partners_type ON partners(type);
CREATE INDEX idx_partners_location ON partners(latitude, longitude);
CREATE INDEX idx_sellers_type ON sellers(type);
CREATE INDEX idx_sellers_city ON sellers(city);
CREATE INDEX idx_listings_seller_id ON listings(seller_id);
CREATE INDEX idx_listings_status ON listings(status) WHERE status = 'active';
CREATE INDEX idx_listings_type ON listings(type);
CREATE INDEX idx_listings_city ON listings(city);
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX idx_listings_season ON listings(season);
CREATE INDEX idx_listings_pcd ON listings(pcd);

ALTER TABLE users
    ADD CONSTRAINT fk_users_seller
    FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE SET NULL;

-- Seed data for development
INSERT INTO products (sku, name, type, price, stock_quantity, image_url, brand, rating) VALUES
    ('TIR-001', 'Michelin Pilot Sport 4 225/45 R17', 'tire', 12500.00, 48, '/images/products/tire-1.jpg', 'Michelin', 4.8),
    ('TIR-002', 'Nokian Hakkapeliitta R5 205/55 R16', 'tire', 9800.00, 32, '/images/products/tire-2.jpg', 'Nokian', 4.9),
    ('TIR-003', 'Continental PremiumContact 6 195/65 R15', 'tire', 7200.00, 64, '/images/products/tire-3.jpg', 'Continental', 4.6),
    ('WHL-001', 'Replica H LS 7x17 5x114.3 ET45', 'wheel', 4500.00, 24, '/images/products/wheel-1.jpg', 'Replica', 4.5),
    ('WHL-002', 'K&K KC1086 8x18 5x112 ET35', 'wheel', 8900.00, 16, '/images/products/wheel-2.jpg', 'K&K', 4.7);

INSERT INTO product_attributes (product_id, width, profile, diameter, season) VALUES
    ((SELECT id FROM products WHERE sku = 'TIR-001'), 225, 45, 17, 'summer'),
    ((SELECT id FROM products WHERE sku = 'TIR-002'), 205, 55, 16, 'winter'),
    ((SELECT id FROM products WHERE sku = 'TIR-003'), 195, 65, 15, 'all_season');

INSERT INTO product_attributes (product_id, diameter, pcd, offset_et, bolt_count) VALUES
    ((SELECT id FROM products WHERE sku = 'WHL-001'), 17, '5x114.3', 45, 5),
    ((SELECT id FROM products WHERE sku = 'WHL-002'), 18, '5x112', 35, 5);

INSERT INTO partners (type, name, address, latitude, longitude, rating, phone) VALUES
    ('store', 'TireHub Красноярск', 'ул. Мира, 42, Красноярск', 56.0104, 92.8526, 4.7, '+7 (391) 123-45-67'),
    ('tire_service', 'Шиномонтаж Сибирь', 'пр. Мира, 15, Красноярск', 56.0180, 92.8700, 4.5, '+7 (391) 987-65-43'),
    ('pickup_point', 'ПВЗ TireHub Юг', 'ул. 9 Мая, 8, Красноярск', 55.9950, 92.8900, 4.3, '+7 (391) 555-12-34');

-- Marketplace sellers (Красноярск)
INSERT INTO sellers (id, type, name, city, phone, email, address, latitude, longitude, description, rating, listings_count, is_verified) VALUES
    ('a1000001-0000-4000-8000-000000000001', 'shop', 'Шинный центр «Колесо»', 'Красноярск', '+7 (391) 111-22-33', 'koleso@tirehub.local', 'ул. Ленина, 10', 56.0100, 92.8600, 'Официальный дилер Michelin и Nokian в Красноярске.', 4.8, 12, TRUE),
    ('a1000001-0000-4000-8000-000000000002', 'shop', 'АвтоШины 24', 'Красноярск', '+7 (391) 222-33-44', 'autoshiny@tirehub.local', 'пр. Мира, 88', 56.0200, 92.8800, 'Шины и диски с доставкой по Красноярску.', 4.6, 8, TRUE),
    ('a1000001-0000-4000-8000-000000000003', 'shop', 'DiskMarket Сибирь', 'Красноярск', '+7 (391) 333-44-55', 'disks@tirehub.local', 'ул. Вавилова, 1', 56.0050, 92.8500, 'Литые и штампованные диски всех размеров.', 4.7, 6, TRUE),
    ('a1000001-0000-4000-8000-000000000004', 'private', 'Алексей', 'Красноярск', '+7 (391) 555-12-34', 'alex@mail.ru', NULL, 56.0120, 92.8650, 'Продаю комплект зимней резины после продажи авто.', 4.9, 2, FALSE),
    ('a1000001-0000-4000-8000-000000000005', 'private', 'Марина', 'Красноярск', '+7 (391) 666-78-90', 'marina@mail.ru', NULL, 56.0080, 92.8720, 'Летние шины Continental, накат 1 сезон.', 4.5, 1, FALSE),
    ('a1000001-0000-4000-8000-000000000006', 'shop', 'TirePro Красноярск', 'Красноярск', '+7 (391) 777-88-99', 'tirepro@tirehub.local', 'ул. 78 Добровольческой Бригады, 15', 56.0250, 92.8950, 'Крупный шинный центр Красноярска.', 4.4, 5, TRUE),
    ('a1000001-0000-4000-8000-000000000007', 'private', 'Дмитрий', 'Красноярск', '+7 (391) 888-99-00', 'dmitry@mail.ru', NULL, 56.0150, 92.8930, 'Диски Replica в отличном состоянии.', 4.3, 1, FALSE);

-- Admin and demo accounts (password: admin123 / demo1234)
INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, city, latitude, longitude) VALUES
    ('b1000001-0000-4000-8000-000000000001', 'admin@tirehub.ru', '$2a$10$kWyT.EUmVVwMyGr26e1ew.XLLqEMM9C8E0NUJxQF.U2VauiryPTRK', 'admin', 'Админ', 'TireHub', '+7 (391) 000-00-01', 'Красноярск', 56.0153, 92.8932);

INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, city, latitude, longitude, seller_id) VALUES
    ('b1000001-0000-4000-8000-000000000002', 'shop@tirehub.ru', '$2a$10$hQowwsk7ANsZC4kCcNAvC.TiELW0QYvmbnDF7n/9hqgp59cYC.id2', 'seller', 'Менеджер', 'Колесо', '+7 (391) 111-22-33', 'Красноярск', 56.0100, 92.8600, 'a1000001-0000-4000-8000-000000000001'),
    ('b1000001-0000-4000-8000-000000000003', 'private@tirehub.ru', '$2a$10$hQowwsk7ANsZC4kCcNAvC.TiELW0QYvmbnDF7n/9hqgp59cYC.id2', 'seller', 'Алексей', 'Иванов', '+7 (391) 555-12-34', 'Красноярск', 56.0120, 92.8650, 'a1000001-0000-4000-8000-000000000004');

UPDATE sellers SET user_id = 'b1000001-0000-4000-8000-000000000002' WHERE id = 'a1000001-0000-4000-8000-000000000001';
UPDATE sellers SET user_id = 'b1000001-0000-4000-8000-000000000003' WHERE id = 'a1000001-0000-4000-8000-000000000004';

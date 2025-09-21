-- Initial Database Schema for Gas Station Application

-- Create categories table
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    tax_rate DECIMAL(5,4) NOT NULL DEFAULT 0,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

-- Create products table
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    barcode VARCHAR(50) UNIQUE,
    cost DECIMAL(10,2) NOT NULL DEFAULT 0,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    current_stock INTEGER NOT NULL DEFAULT 0,
    reorder_threshold INTEGER NOT NULL DEFAULT 0,
    food_stamp_eligible BOOLEAN NOT NULL DEFAULT false,
    active BOOLEAN NOT NULL DEFAULT true,
    description TEXT,
    category_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Create users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    phone VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

-- Create user_roles table
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role VARCHAR(20) NOT NULL,
    PRIMARY KEY (user_id, role),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create promotions table
CREATE TABLE promotions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    promotion_type VARCHAR(20) NOT NULL CHECK (promotion_type IN ('PERCENTAGE', 'FIXED_AMOUNT')),
    discount_value DECIMAL(10,2) NOT NULL DEFAULT 0,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    min_purchase_amount DECIMAL(10,2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

-- Create promotion_products table (many-to-many)
CREATE TABLE promotion_products (
    promotion_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    PRIMARY KEY (promotion_id, product_id),
    FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create transactions table
CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    transaction_number VARCHAR(50) NOT NULL UNIQUE,
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'EBT', 'CHECK', 'GIFT_CARD')),
    status VARCHAR(20) NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELLED', 'REFUNDED')),
    transaction_date TIMESTAMP NOT NULL,
    notes TEXT,
    cashier_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    FOREIGN KEY (cashier_id) REFERENCES users(id)
);

-- Create transaction_items table
CREATE TABLE transaction_items (
    id BIGSERIAL PRIMARY KEY,
    quantity INTEGER NOT NULL CHECK (quantity >= 1),
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    product_id BIGINT NOT NULL,
    transaction_id BIGINT NOT NULL,
    promotion_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (promotion_id) REFERENCES promotions(id)
);

-- Create inventory_transactions table
CREATE TABLE inventory_transactions (
    id BIGSERIAL PRIMARY KEY,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('RECEIVE', 'AUDIT', 'SALE', 'DAMAGE', 'ADJUSTMENT')),
    quantity INTEGER NOT NULL,
    notes TEXT,
    product_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create lottery_games table
CREATE TABLE lottery_games (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    barcode VARCHAR(50) UNIQUE,
    pack_count INTEGER NOT NULL CHECK (pack_count >= 1),
    ticket_price DECIMAL(10,2) NOT NULL,
    pack_cost DECIMAL(10,2) NOT NULL,
    current_stock INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT true,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

-- Create fuel_deliveries table
CREATE TABLE fuel_deliveries (
    id BIGSERIAL PRIMARY KEY,
    fuel_type VARCHAR(20) NOT NULL CHECK (fuel_type IN ('REGULAR_87', 'MIDGRADE_89', 'PREMIUM_91', 'PREMIUM_93', 'DIESEL', 'E85')),
    gallons DECIMAL(10,3) NOT NULL,
    cost_per_gallon DECIMAL(10,4) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    delivery_date TIMESTAMP NOT NULL,
    supplier_name VARCHAR(100),
    delivery_ticket_number VARCHAR(50),
    notes TEXT,
    received_by BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    FOREIGN KEY (received_by) REFERENCES users(id)
);

-- Create fuel_prices table
CREATE TABLE fuel_prices (
    id BIGSERIAL PRIMARY KEY,
    fuel_type VARCHAR(20) NOT NULL CHECK (fuel_type IN ('REGULAR_87', 'MIDGRADE_89', 'PREMIUM_91', 'PREMIUM_93', 'DIESEL', 'E85')),
    price_per_gallon DECIMAL(10,4) NOT NULL,
    effective_date TIMESTAMP NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    updated_by BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Create service_logs table
CREATE TABLE service_logs (
    id BIGSERIAL PRIMARY KEY,
    service_type VARCHAR(20) NOT NULL CHECK (service_type IN ('BILL_PAY', 'CHECK_CASHING', 'MONEY_ORDER', 'PHONE_CARD', 'GIFT_CARD_SALE', 'ATM_FEE', 'OTHER')),
    amount DECIMAL(10,2) NOT NULL,
    customer_reference VARCHAR(100),
    notes TEXT,
    service_date TIMESTAMP NOT NULL,
    handled_by BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    FOREIGN KEY (handled_by) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_low_stock ON products(current_stock, reorder_threshold);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_cashier ON transactions(cashier_id);
CREATE INDEX idx_transaction_items_product ON transaction_items(product_id);
CREATE INDEX idx_transaction_items_transaction ON transaction_items(transaction_id);
CREATE INDEX idx_inventory_transactions_product ON inventory_transactions(product_id);
CREATE INDEX idx_inventory_transactions_user ON inventory_transactions(user_id);
CREATE INDEX idx_fuel_deliveries_type_date ON fuel_deliveries(fuel_type, delivery_date);
CREATE INDEX idx_fuel_prices_type_date ON fuel_prices(fuel_type, effective_date);
CREATE INDEX idx_service_logs_type_date ON service_logs(service_type, service_date);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON promotions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transaction_items_updated_at BEFORE UPDATE ON transaction_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_transactions_updated_at BEFORE UPDATE ON inventory_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lottery_games_updated_at BEFORE UPDATE ON lottery_games FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fuel_deliveries_updated_at BEFORE UPDATE ON fuel_deliveries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fuel_prices_updated_at BEFORE UPDATE ON fuel_prices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_logs_updated_at BEFORE UPDATE ON service_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 
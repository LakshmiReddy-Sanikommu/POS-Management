-- Sample Data for Gas Station Application

-- Insert sample categories
INSERT INTO categories (name, tax_rate, description) VALUES
('Beverages', 0.0875, 'Soft drinks, water, energy drinks'),
('Snacks', 0.0875, 'Chips, candy, nuts'),
('Tobacco', 0.2500, 'Cigarettes, cigars, tobacco products'),
('Alcohol', 0.1000, 'Beer, wine, spirits'),
('Food', 0.0000, 'Hot food, sandwiches (tax-exempt)'),
('Auto', 0.0875, 'Motor oil, windshield fluid, car accessories'),
('Lottery', 0.0000, 'Lottery tickets and games'),
('Phone Cards', 0.0875, 'Prepaid phone cards');

-- Insert sample admin user (password is "admin123" hashed with BCrypt)
INSERT INTO users (username, email, password, first_name, last_name, phone) VALUES
('admin', 'admin@gasstation.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'System', 'Administrator', '555-0001'),
('manager1', 'manager@gasstation.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'John', 'Manager', '555-0002'),
('cashier1', 'cashier1@gasstation.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Jane', 'Cashier', '555-0003'),
('cashier2', 'cashier2@gasstation.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Bob', 'Smith', '555-0004');

-- Insert user roles
INSERT INTO user_roles (user_id, role) VALUES
(1, 'ADMIN'),
(2, 'MANAGER'),
(3, 'CASHIER'),
(4, 'CASHIER');

-- Insert sample products
INSERT INTO products (name, barcode, cost, price, current_stock, reorder_threshold, food_stamp_eligible, category_id, description) VALUES
-- Beverages
('Coca-Cola 20oz', '049000028910', 1.25, 2.49, 48, 12, false, 1, 'Classic Coca-Cola 20oz bottle'),
('Pepsi 20oz', '012000161018', 1.25, 2.49, 36, 12, false, 1, 'Pepsi Cola 20oz bottle'),
('Water 16.9oz', '035000521019', 0.50, 1.99, 120, 24, false, 1, 'Dasani water 16.9oz bottle'),
('Red Bull 8.4oz', '902794001139', 2.25, 3.99, 24, 6, false, 1, 'Red Bull energy drink 8.4oz'),

-- Snacks
('Lays Chips Classic', '028400064316', 1.50, 2.99, 30, 8, true, 2, 'Lays Classic potato chips'),
('Snickers Bar', '040000000013', 0.75, 1.79, 48, 12, true, 2, 'Snickers chocolate bar'),
('Doritos Nacho', '028400064323', 1.50, 2.99, 24, 8, true, 2, 'Doritos Nacho Cheese'),

-- Tobacco
('Marlboro Red', '028200000013', 5.50, 8.99, 20, 5, false, 3, 'Marlboro Red cigarettes'),
('Newport 100s', '028200000020', 5.50, 8.99, 15, 5, false, 3, 'Newport 100s menthol'),

-- Auto
('Motor Oil 5W30', '071611006041', 4.25, 7.99, 12, 3, false, 6, 'Valvoline 5W30 motor oil'),
('Windshield Fluid', '071611006042', 2.50, 4.99, 8, 2, false, 6, 'Windshield washer fluid');

-- Insert sample lottery games
INSERT INTO lottery_games (name, barcode, pack_count, ticket_price, pack_cost, current_stock, description) VALUES
('Powerball', '850123456789', 1, 2.00, 0.00, 0, 'Multi-state lottery draw game'),
('Mega Millions', '850123456790', 1, 2.00, 0.00, 0, 'Multi-state lottery draw game'),
('$5 Crossword', '850123456791', 30, 5.00, 120.00, 5, '$5 scratch-off crossword game'),
('$10 Gold Rush', '850123456792', 20, 10.00, 140.00, 3, '$10 scratch-off gold rush game'),
('$20 Diamond', '850123456793', 10, 20.00, 140.00, 2, '$20 scratch-off diamond game');

-- Insert sample fuel prices
INSERT INTO fuel_prices (fuel_type, price_per_gallon, effective_date, updated_by) VALUES
('REGULAR_87', 3.299, CURRENT_TIMESTAMP, 1),
('MIDGRADE_89', 3.599, CURRENT_TIMESTAMP, 1),
('PREMIUM_91', 3.899, CURRENT_TIMESTAMP, 1),
('DIESEL', 3.799, CURRENT_TIMESTAMP, 1);

-- Insert sample fuel delivery
INSERT INTO fuel_deliveries (fuel_type, gallons, cost_per_gallon, total_cost, delivery_date, supplier_name, delivery_ticket_number, received_by) VALUES
('REGULAR_87', 8000.000, 2.850, 22800.00, CURRENT_TIMESTAMP - INTERVAL '1 day', 'Shell Fuel Supply', 'DEL-2024-001', 1),
('PREMIUM_91', 2000.000, 3.150, 6300.00, CURRENT_TIMESTAMP - INTERVAL '1 day', 'Shell Fuel Supply', 'DEL-2024-002', 1);

-- Insert sample promotion
INSERT INTO promotions (name, description, promotion_type, discount_value, start_date, end_date, min_purchase_amount) VALUES
('Buy 2 Get 10% Off Snacks', 'Get 10% off when you buy 2 or more snack items', 'PERCENTAGE', 10.00, CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP + INTERVAL '30 days', 5.00),
('$1 Off Energy Drinks', 'Save $1 on any energy drink purchase', 'FIXED_AMOUNT', 1.00, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP + INTERVAL '15 days', NULL);

-- Link promotions to eligible products
INSERT INTO promotion_products (promotion_id, product_id) VALUES
(1, 5), -- Lays chips
(1, 6), -- Snickers
(1, 7), -- Doritos
(2, 4); -- Red Bull

-- Insert sample transactions
INSERT INTO transactions (transaction_number, subtotal, tax_amount, total_amount, payment_method, transaction_date, cashier_id) VALUES
('TXN-20241201-001', 7.47, 0.65, 8.12, 'CASH', CURRENT_TIMESTAMP - INTERVAL '2 hours', 3),
('TXN-20241201-002', 4.98, 0.44, 5.42, 'CREDIT_CARD', CURRENT_TIMESTAMP - INTERVAL '1 hour', 3),
('TXN-20241201-003', 12.96, 1.13, 14.09, 'DEBIT_CARD', CURRENT_TIMESTAMP - INTERVAL '30 minutes', 4);

-- Insert transaction items
INSERT INTO transaction_items (quantity, unit_price, total_price, product_id, transaction_id) VALUES
-- Transaction 1
(1, 2.49, 2.49, 1, 1), -- Coca-Cola
(1, 2.99, 2.99, 5, 1), -- Lays chips
(1, 1.99, 1.99, 3, 1), -- Water

-- Transaction 2
(2, 2.49, 4.98, 2, 2), -- 2x Pepsi

-- Transaction 3
(1, 3.99, 3.99, 4, 3), -- Red Bull
(3, 2.99, 8.97, 7, 3); -- 3x Doritos

-- Insert inventory transactions for the sales
INSERT INTO inventory_transactions (transaction_type, quantity, product_id, user_id, notes) VALUES
('SALE', -1, 1, 3, 'Sale transaction TXN-20241201-001'),
('SALE', -1, 5, 3, 'Sale transaction TXN-20241201-001'),
('SALE', -1, 3, 3, 'Sale transaction TXN-20241201-001'),
('SALE', -2, 2, 3, 'Sale transaction TXN-20241201-002'),
('SALE', -1, 4, 4, 'Sale transaction TXN-20241201-003'),
('SALE', -3, 7, 4, 'Sale transaction TXN-20241201-003');

-- Update product stock after sales
UPDATE products SET current_stock = current_stock - 1 WHERE id IN (1, 5, 3, 4);
UPDATE products SET current_stock = current_stock - 2 WHERE id = 2;
UPDATE products SET current_stock = current_stock - 3 WHERE id = 7;

-- Insert sample service logs
INSERT INTO service_logs (service_type, amount, customer_reference, notes, service_date, handled_by) VALUES
('BILL_PAY', 85.50, 'Electric Bill - Account #12345', 'Paid electric bill for customer', CURRENT_TIMESTAMP - INTERVAL '3 hours', 3),
('CHECK_CASHING', 150.00, 'Payroll Check', 'Cashed payroll check, charged 2% fee', CURRENT_TIMESTAMP - INTERVAL '1 hour', 4),
('PHONE_CARD', 25.00, 'Verizon $25 Card', 'Sold prepaid phone card', CURRENT_TIMESTAMP - INTERVAL '45 minutes', 3); 
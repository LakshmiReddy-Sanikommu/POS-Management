-- Sample Data for Gas Station Application (MySQL version)
USE gasstation;

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
('Monster Energy', '070847811169', 2.50, 4.29, 18, 6, false, 1, 'Monster Energy drink 16oz'),
('Coffee Black', '043000054321', 0.75, 1.89, 60, 15, false, 1, 'Hot black coffee 12oz'),

-- Snacks
('Lays Chips Classic', '028400064316', 1.50, 2.99, 30, 8, true, 2, 'Lays Classic potato chips'),
('Snickers Bar', '040000000013', 0.75, 1.79, 48, 12, true, 2, 'Snickers chocolate bar'),
('Doritos Nacho', '028400064323', 1.50, 2.99, 24, 8, true, 2, 'Doritos Nacho Cheese'),
('Kit Kat Bar', '034000000036', 0.85, 1.89, 36, 10, true, 2, 'Kit Kat chocolate wafer bar'),
('Pringles Original', '038000845016', 1.75, 3.49, 20, 5, true, 2, 'Pringles Original potato crisps'),

-- Tobacco
('Marlboro Red', '028200000013', 5.50, 8.99, 20, 5, false, 3, 'Marlboro Red cigarettes'),
('Newport 100s', '028200000020', 5.50, 8.99, 15, 5, false, 3, 'Newport 100s menthol'),
('Camel Lights', '012300000031', 5.25, 8.79, 18, 5, false, 3, 'Camel Light cigarettes'),

-- Alcohol
('Bud Light 12pk', '018200000041', 8.50, 12.99, 24, 6, false, 4, 'Budweiser Light 12-pack cans'),
('Corona 6pk', '076200000052', 6.25, 9.99, 18, 4, false, 4, 'Corona Extra 6-pack bottles'),

-- Food
('Hot Dog', '999000000001', 1.25, 2.99, 50, 10, true, 5, 'All-beef hot dog'),
('Pizza Slice', '999000000002', 2.00, 4.99, 8, 2, true, 5, 'Pepperoni pizza slice'),
('Sandwich Ham', '999000000003', 3.50, 6.99, 12, 3, true, 5, 'Ham and cheese sandwich'),

-- Auto
('Motor Oil 5W30', '071611006041', 4.25, 7.99, 12, 3, false, 6, 'Valvoline 5W30 motor oil'),
('Windshield Fluid', '071611006042', 2.50, 4.99, 8, 2, false, 6, 'Windshield washer fluid'),
('Air Freshener', '071611006043', 1.25, 2.99, 25, 5, false, 6, 'Pine tree air freshener'),

-- Phone Cards
('Verizon $25', '999000000011', 23.00, 25.00, 10, 2, false, 8, 'Verizon $25 prepaid card'),
('AT&T $50', '999000000012', 46.00, 50.00, 8, 2, false, 8, 'AT&T $50 prepaid card');

-- Insert sample lottery games
INSERT INTO lottery_games (name, barcode, pack_count, ticket_price, pack_cost, current_stock, description) VALUES
('Powerball', '850123456789', 1, 2.00, 0.00, 0, 'Multi-state lottery draw game'),
('Mega Millions', '850123456790', 1, 2.00, 0.00, 0, 'Multi-state lottery draw game'),
('Daily Pick 3', '850123456791', 1, 1.00, 0.00, 0, 'Daily pick 3 numbers'),
('$1 Lucky 7s', '850123456792', 40, 1.00, 28.00, 8, '$1 scratch-off lucky 7s game'),
('$5 Crossword', '850123456793', 30, 5.00, 120.00, 5, '$5 scratch-off crossword game'),
('$10 Gold Rush', '850123456794', 20, 10.00, 140.00, 3, '$10 scratch-off gold rush game'),
('$20 Diamond', '850123456795', 10, 20.00, 140.00, 2, '$20 scratch-off diamond game');

-- Insert sample fuel prices
INSERT INTO fuel_prices (fuel_type, price_per_gallon, effective_date, updated_by) VALUES
('REGULAR_87', 3.299, NOW(), 1),
('MIDGRADE_89', 3.599, NOW(), 1),
('PREMIUM_91', 3.899, NOW(), 1),
('PREMIUM_93', 4.099, NOW(), 1),
('DIESEL', 3.799, NOW(), 1),
('E85', 2.999, NOW(), 1);

-- Insert sample fuel deliveries
INSERT INTO fuel_deliveries (fuel_type, gallons, cost_per_gallon, total_cost, delivery_date, supplier_name, delivery_ticket_number, received_by) VALUES
('REGULAR_87', 8000.000, 2.850, 22800.00, DATE_SUB(NOW(), INTERVAL 1 DAY), 'Shell Fuel Supply', 'DEL-2024-001', 1),
('PREMIUM_91', 2000.000, 3.150, 6300.00, DATE_SUB(NOW(), INTERVAL 1 DAY), 'Shell Fuel Supply', 'DEL-2024-002', 1),
('DIESEL', 3000.000, 3.050, 9150.00, DATE_SUB(NOW(), INTERVAL 2 DAY), 'BP Fuel Distribution', 'DEL-2024-003', 2);

-- Insert sample promotions
INSERT INTO promotions (name, description, promotion_type, discount_value, start_date, end_date, min_purchase_amount) VALUES
('Buy 2 Get 10% Off Snacks', 'Get 10% off when you buy 2 or more snack items', 'PERCENTAGE', 10.00, DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), 5.00),
('$1 Off Energy Drinks', 'Save $1 on any energy drink purchase', 'FIXED_AMOUNT', 1.00, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_ADD(NOW(), INTERVAL 15 DAY), NULL),
('Hot Food Combo Deal', '$2 off when you buy hot dog + drink', 'FIXED_AMOUNT', 2.00, DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_ADD(NOW(), INTERVAL 20 DAY), 4.00);

-- Link promotions to eligible products
INSERT INTO promotion_products (promotion_id, product_id) VALUES
-- Snack promotion
(1, 7), -- Lays chips
(1, 8), -- Snickers
(1, 9), -- Doritos
(1, 10), -- Kit Kat
(1, 11), -- Pringles
-- Energy drink promotion
(2, 4), -- Red Bull
(2, 5), -- Monster
-- Hot food combo
(3, 16), -- Hot dog
(3, 1), -- Coca-Cola
(3, 2), -- Pepsi
(3, 6); -- Coffee

-- Insert sample transactions
INSERT INTO transactions (transaction_number, subtotal, tax_amount, total_amount, payment_method, transaction_date, cashier_id, notes) VALUES
('TXN-20241201-001', 7.47, 0.65, 8.12, 'CASH', DATE_SUB(NOW(), INTERVAL 2 HOUR), 3, 'Regular customer purchase'),
('TXN-20241201-002', 4.98, 0.44, 5.42, 'CREDIT_CARD', DATE_SUB(NOW(), INTERVAL 1 HOUR), 3, 'Card payment'),
('TXN-20241201-003', 12.96, 1.13, 14.09, 'DEBIT_CARD', DATE_SUB(NOW(), INTERVAL 30 MINUTE), 4, 'Large snack purchase'),
('TXN-20241201-004', 25.00, 0.00, 25.00, 'CASH', DATE_SUB(NOW(), INTERVAL 15 MINUTE), 3, 'Phone card sale'),
('TXN-20241201-005', 8.98, 0.78, 9.76, 'CREDIT_CARD', DATE_SUB(NOW(), INTERVAL 5 MINUTE), 4, 'Tobacco purchase');

-- Insert transaction items
INSERT INTO transaction_items (quantity, unit_price, total_price, product_id, transaction_id) VALUES
-- Transaction 1
(1, 2.49, 2.49, 1, 1), -- Coca-Cola
(1, 2.99, 2.99, 7, 1), -- Lays chips
(1, 1.99, 1.99, 3, 1), -- Water

-- Transaction 2
(2, 2.49, 4.98, 2, 2), -- 2x Pepsi

-- Transaction 3
(1, 3.99, 3.99, 4, 3), -- Red Bull
(3, 2.99, 8.97, 9, 3), -- 3x Doritos

-- Transaction 4
(1, 25.00, 25.00, 22, 4), -- Verizon card

-- Transaction 5
(1, 8.99, 8.99, 12, 5); -- Marlboro Red

-- Insert inventory transactions for the sales
INSERT INTO inventory_transactions (transaction_type, quantity, product_id, user_id, notes) VALUES
('SALE', -1, 1, 3, 'Sale transaction TXN-20241201-001'),
('SALE', -1, 7, 3, 'Sale transaction TXN-20241201-001'),
('SALE', -1, 3, 3, 'Sale transaction TXN-20241201-001'),
('SALE', -2, 2, 3, 'Sale transaction TXN-20241201-002'),
('SALE', -1, 4, 4, 'Sale transaction TXN-20241201-003'),
('SALE', -3, 9, 4, 'Sale transaction TXN-20241201-003'),
('SALE', -1, 22, 3, 'Sale transaction TXN-20241201-004'),
('SALE', -1, 12, 4, 'Sale transaction TXN-20241201-005'),
-- Inventory receipts
('RECEIVE', 100, 1, 2, 'Weekly beverage delivery'),
('RECEIVE', 50, 7, 2, 'Snack restocking'),
('RECEIVE', 200, 3, 2, 'Water bottle delivery'),
('AUDIT', 0, 4, 1, 'Monthly inventory count - Red Bull'),
('ADJUSTMENT', -2, 8, 2, 'Damaged Snickers bars');

-- Update product stock after sales
UPDATE products SET current_stock = current_stock - 1 WHERE id IN (1, 7, 3, 4, 22, 12);
UPDATE products SET current_stock = current_stock - 2 WHERE id = 2;
UPDATE products SET current_stock = current_stock - 3 WHERE id = 9;

-- Apply inventory receipts and adjustments
UPDATE products SET current_stock = current_stock + 100 WHERE id = 1;
UPDATE products SET current_stock = current_stock + 50 WHERE id = 7;
UPDATE products SET current_stock = current_stock + 200 WHERE id = 3;
UPDATE products SET current_stock = current_stock - 2 WHERE id = 8;

-- Insert sample service logs
INSERT INTO service_logs (service_type, amount, customer_reference, notes, service_date, handled_by) VALUES
('BILL_PAY', 85.50, 'Electric Bill - Account #12345', 'Paid electric bill for customer', DATE_SUB(NOW(), INTERVAL 3 HOUR), 3),
('CHECK_CASHING', 150.00, 'Payroll Check', 'Cashed payroll check, charged 2% fee', DATE_SUB(NOW(), INTERVAL 1 HOUR), 4),
('PHONE_CARD', 25.00, 'Verizon $25 Card', 'Sold prepaid phone card', DATE_SUB(NOW(), INTERVAL 45 MINUTE), 3),
('MONEY_ORDER', 500.00, 'Money Order #789123', 'Issued money order for rent payment', DATE_SUB(NOW(), INTERVAL 2 HOUR), 4),
('ATM_FEE', 3.50, 'ATM Transaction', 'ATM usage fee collected', DATE_SUB(NOW(), INTERVAL 30 MINUTE), 3),
('GIFT_CARD_SALE', 50.00, 'Amazon Gift Card', 'Sold $50 Amazon gift card', DATE_SUB(NOW(), INTERVAL 20 MINUTE), 3);

-- Verify data insertion
SELECT 'Database setup completed successfully!' as status;
SELECT COUNT(*) as total_categories FROM categories;
SELECT COUNT(*) as total_products FROM products;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_transactions FROM transactions;
SELECT COUNT(*) as total_lottery_games FROM lottery_games;
SELECT COUNT(*) as total_fuel_prices FROM fuel_prices; 
-- Update existing promotions to use the new JSON structure

-- Update "Buy 2 Get 10% Off Snacks" promotion
UPDATE promotions 
SET eligible_product_ids = JSON_ARRAY(7, 8, 9, 10, 11), -- Lays, Snickers, Doritos, Kit Kat, Pringles
    eligible_category_ids = JSON_ARRAY(2) -- Snacks category
WHERE name = 'Buy 2 Get 10% Off Snacks';

-- Update "$1 Off Energy Drinks" promotion  
UPDATE promotions 
SET eligible_product_ids = JSON_ARRAY(4, 5) -- Red Bull, Monster
WHERE name = '$1 Off Energy Drinks';

-- Update "Hot Food Combo Deal" promotion
UPDATE promotions 
SET eligible_product_ids = JSON_ARRAY(16, 1, 2, 6), -- Hot dog, Coca-Cola, Pepsi, Coffee
    eligible_category_ids = JSON_ARRAY(5, 1) -- Food and Beverages categories
WHERE name = 'Hot Food Combo Deal'; 
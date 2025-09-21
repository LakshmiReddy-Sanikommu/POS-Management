-- Modify promotions table to include eligible products and categories directly
-- This migration removes the junction table and adds JSON columns

-- Drop the junction table
DROP TABLE IF EXISTS promotion_products;

-- Add new columns to promotions table for eligible products and categories
ALTER TABLE promotions 
ADD COLUMN eligible_product_ids JSON,
ADD COLUMN eligible_category_ids JSON;

-- Add comments for clarity
COMMENT ON COLUMN promotions.eligible_product_ids IS 'JSON array of product IDs eligible for this promotion. Empty/null means all products are eligible.';
COMMENT ON COLUMN promotions.eligible_category_ids IS 'JSON array of category IDs eligible for this promotion. Empty/null means all categories are eligible.'; 
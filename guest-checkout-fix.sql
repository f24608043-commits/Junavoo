-- Fix for Guest Checkout
-- Run this SQL in your Supabase SQL Editor to allow guest checkout

-- The orders table likely has a NOT NULL constraint on user_id
-- This migration allows NULL values for user_id to support guest checkout

-- First, check if the column exists and its constraints
-- Then modify it to allow NULL values

ALTER TABLE orders 
ALTER COLUMN user_id DROP NOT NULL;

-- This allows orders to be created without a user_id (guest checkout)
-- The checkout page already handles this by using session?.user?.id || null

-- If you have RLS policies that might be blocking guest orders, you may need to add:
-- CREATE POLICY "Allow guest orders" ON orders
-- FOR INSERT
-- TO anon
-- WITH CHECK (true);

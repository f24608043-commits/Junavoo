
-- Add hover_image and price_eur columns to products table
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS hover_image text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS price_eur numeric DEFAULT NULL;

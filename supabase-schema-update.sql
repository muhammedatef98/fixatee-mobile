-- Add media_urls column to orders table
-- Run this in Supabase SQL Editor to update existing database

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS media_urls TEXT[];

-- Add comment to explain the column
COMMENT ON COLUMN orders.media_urls IS 'Array of Supabase Storage URLs for uploaded photos/videos';

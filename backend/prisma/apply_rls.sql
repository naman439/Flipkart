-- Supabase Row Level Security (RLS) Setup Script
-- This script enables RLS and defines policies for the new UUID schema.

-- 1. PROFILES (Own data only)
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
ON "profiles" FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON "profiles" FOR UPDATE 
USING (auth.uid() = id);

-- 2. CARTS (Owner only)
ALTER TABLE "carts" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cart" 
ON "carts" FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own cart" 
ON "carts" FOR ALL 
USING (auth.uid() = user_id);

-- 3. CART_ITEMS (Linked to user's cart)
ALTER TABLE "cart_items" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cart items" 
ON "cart_items" FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM "carts" 
    WHERE "carts".id = "cart_items".cart_id 
    AND "carts".user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage their own cart items" 
ON "cart_items" FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM "carts" 
    WHERE "carts".id = "cart_items".cart_id 
    AND "carts".user_id = auth.uid()
  )
);

-- 4. ORDERS (Owner only)
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders" 
ON "orders" FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
ON "orders" FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 5. ORDER_ITEMS (Linked to user's order)
ALTER TABLE "order_items" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order items" 
ON "order_items" FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM "orders" 
    WHERE "orders".id = "order_items".order_id 
    AND "orders".user_id = auth.uid()
  )
);

-- 6. WISHLISTS (Owner only)
ALTER TABLE "wishlists" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own wishlist" 
ON "wishlists" FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own wishlist" 
ON "wishlists" FOR ALL 
USING (auth.uid() = user_id);

-- 7. PUBLIC TABLES (Products and Categories)
-- Everyone can view, but no one can modify via public API
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access for Products" ON "products" FOR SELECT USING (true);

ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access for Categories" ON "categories" FOR SELECT USING (true);

ALTER TABLE "product_images" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access for Product Images" ON "product_images" FOR SELECT USING (true);

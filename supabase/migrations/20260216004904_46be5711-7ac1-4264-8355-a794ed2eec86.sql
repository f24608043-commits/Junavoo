
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles: admins can read all, users can read own
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can insert categories" ON public.categories FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update categories" ON public.categories FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete categories" ON public.categories FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  cost NUMERIC(10,2),
  sku TEXT NOT NULL UNIQUE,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  short_description TEXT,
  long_description TEXT,
  image TEXT DEFAULT '/placeholder.svg',
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  billing_name TEXT,
  billing_email TEXT,
  billing_phone TEXT,
  billing_address TEXT,
  billing_city TEXT,
  billing_zip TEXT,
  shipping_name TEXT,
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_zip TEXT,
  payment_method TEXT DEFAULT 'cod',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users can insert own order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Admins can view all order items" ON public.order_items FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Coupons table
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount NUMERIC(10,2) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active coupons" ON public.coupons FOR SELECT USING (active = true);
CREATE POLICY "Admins can manage coupons" ON public.coupons FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Newsletter subscribers
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view subscribers" ON public.subscribers FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Seed categories
INSERT INTO public.categories (name, slug) VALUES
  ('Home and Kitchen', 'home-kitchen'),
  ('Machines & Electronic', 'electronics'),
  ('Toys', 'toys'),
  ('Hardware', 'hardware'),
  ('Beddings', 'beddings'),
  ('Gym & Sports', 'gym-sports'),
  ('Cosmetics', 'cosmetics'),
  ('Baby Products', 'baby-products'),
  ('Garden & Outdoor', 'garden-outdoor'),
  ('Auto Accessories', 'auto-accessories'),
  ('Cleaning & Household Supplies', 'cleaning'),
  ('Mobile Accessories', 'mobile-accessories');

-- Seed products (will link to categories by slug)
INSERT INTO public.products (name, price, cost, sku, rating, stock, short_description, long_description, category_id, featured)
SELECT p.name, p.price, p.price * 0.7, p.sku, p.rating, p.stock, p.short_desc, p.long_desc, c.id, p.featured
FROM (VALUES
  ('Non-Stick Cookware Set', 49.99, 'HK-001', 4.5, 25, 'Premium 10-piece non-stick cookware set for everyday cooking.', 'This premium 10-piece non-stick cookware set includes everything you need for everyday cooking. Features durable non-stick coating, heat-resistant handles, and is dishwasher safe.', 'home-kitchen', true),
  ('Compact Blender', 34.99, 'ME-001', 4.3, 40, 'Powerful 600W compact blender for smoothies and shakes.', 'This powerful 600W compact blender makes quick work of smoothies, shakes, and soups. Features multiple speed settings, a pulse function, and BPA-free pitcher.', 'electronics', true),
  ('Remote Control Car', 29.99, 'TY-001', 4.6, 30, 'High-speed remote control car with rechargeable battery.', 'This high-speed remote control car features a rechargeable battery, 2.4GHz remote for long-range control, and durable construction for indoor and outdoor play.', 'toys', false),
  ('Electric Drill Machine', 59.99, 'HW-001', 4.4, 20, 'Cordless electric drill with 20V lithium-ion battery.', 'Professional-grade cordless electric drill featuring a 20V lithium-ion battery, variable speed trigger, LED work light, and includes a set of drill bits.', 'hardware', true),
  ('Luxury Memory Foam Pillow', 24.99, 'BD-001', 4.7, 50, 'Ergonomic memory foam pillow for restful sleep.', 'This ergonomic memory foam pillow contours to your head and neck for optimal support. Features breathable cover, hypoallergenic material, and maintains shape over time.', 'beddings', false),
  ('Adjustable Dumbbell Set', 89.99, 'GS-001', 4.8, 15, 'Adjustable dumbbell set ranging from 5 to 25 lbs.', 'This adjustable dumbbell set replaces 5 sets of weights. Quick-change mechanism allows switching between 5, 10, 15, 20, and 25 lbs. Compact design saves space.', 'gym-sports', true),
  ('Vitamin C Face Serum', 19.99, 'CS-001', 4.5, 60, 'Brightening vitamin C serum with hyaluronic acid.', 'This brightening face serum combines 20% vitamin C with hyaluronic acid for hydration and anti-aging benefits. Suitable for all skin types, paraben-free.', 'cosmetics', false),
  ('Baby Safety Walker', 44.99, 'BP-001', 4.2, 18, 'Adjustable baby walker with activity tray and safety stoppers.', 'This adjustable baby walker features an interactive activity tray, safety stoppers, easy-fold design, and padded seat. Suitable for babies 6-18 months.', 'baby-products', false),
  ('Solar Garden Light', 14.99, 'GO-001', 4.1, 100, 'Set of 4 waterproof solar-powered garden lights.', 'These solar-powered garden lights charge during the day and automatically illuminate your garden at night. Waterproof IP65 rated, stainless steel construction.', 'garden-outdoor', false),
  ('Car Phone Mount', 12.99, 'AA-001', 4.3, 80, 'Universal car phone mount with 360 rotation.', 'This universal car phone mount features 360 rotation, one-touch release, and fits phones up to 6.7 inches. Strong suction cup for dashboard or windshield mounting.', 'auto-accessories', false),
  ('Microfiber Mop Set', 22.99, 'CH-001', 4.4, 35, 'Complete microfiber mop set with washable pads.', 'This complete microfiber mop set includes a telescopic handle, 360 swivel head, and 4 washable microfiber pads. Works on all floor types.', 'cleaning', false),
  ('Fast Charging Power Bank', 27.99, 'MA-001', 4.6, 45, '20000mAh power bank with fast charging and dual USB ports.', 'This 20000mAh power bank features 18W fast charging, dual USB-A and USB-C ports, LED battery indicator, and can charge two devices simultaneously.', 'mobile-accessories', false)
) AS p(name, price, sku, rating, stock, short_desc, long_desc, cat_slug, featured)
JOIN public.categories c ON c.slug = p.cat_slug;

-- Seed coupons
INSERT INTO public.coupons (code, discount) VALUES
  ('SAVE10', 10.00),
  ('WELCOME5', 5.00);

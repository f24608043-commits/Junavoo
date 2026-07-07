

# Junavo — Minimal E-Commerce Store

## Overview
A complete, lightweight marketplace-style e-commerce website with 12 categories, 12 demo products, full admin inventory control, dark mode, and maximum performance.

## Phase 1: Foundation & Design System
- Set up minimal design system: white background, neutral blue accent, sans-serif font, soft shadows, rounded corners
- Dark mode toggle with localStorage persistence
- Sticky header with logo, search bar, account/wishlist/cart icons, and navigation menu
- Footer with quick links, categories, and copyright
- Mobile-first responsive layout

## Phase 2: Core Pages (User-Facing)
- **Homepage**: Hero banner, 12-category grid, featured products, promo banner, best sellers, newsletter signup
- **Shop page**: Sidebar filters (category, price, rating, availability), product grid with sorting & pagination
- **Category page**: Dynamic route showing filtered products
- **Product detail page**: Image, title, price, rating, stock, quantity selector, add to cart/wishlist, description/specs/reviews tabs, related products
- **Cart page**: Product list, quantity update, remove, coupon field, totals, checkout button
- **Checkout page**: Billing/shipping form, payment method selection (COD + card placeholder), order summary
- **Order confirmation page**
- **Static pages**: About Us, Contact Us, FAQ, Privacy Policy, Terms & Conditions, Refund Policy

## Phase 3: Backend Setup (Supabase/Lovable Cloud)
- Database tables: users/profiles, categories, products, orders, order_items, coupons, newsletter_subscribers
- Row-level security policies
- 12 categories and 12 demo products seeded
- User authentication (register/login)
- Admin role management

## Phase 4: E-Commerce Functionality
- Add to cart / remove / update quantity (with persistence)
- Wishlist functionality
- Product search
- Coupon system (fixed discount)
- Order placement with automatic stock reduction
- Out-of-stock prevention
- Cart persistence across sessions

## Phase 5: My Account
- Login & registration
- View order history
- Track order status
- Update profile

## Phase 6: Admin Panel (/admin)
- Protected admin route with role-based access
- **Dashboard**: Total orders, revenue, profit, products count, low stock alerts, total users
- **Product management**: Add, edit, delete products; update stock/price/category; mark as featured
- **Category management**: Add, edit, delete categories
- **Order management**: View orders & details, change status (Pending → Processing → Shipped → Delivered → Cancelled)
- **Inventory control**: Stock quantities, automatic reduction on order, low stock indicators, out-of-stock marking

## Design Principles Throughout
- No heavy animations or sliders
- Lazy loading for images
- Reusable card-based components
- Clean semantic HTML with minimal CSS/JS
- Simple state management (React context + TanStack Query)
- Mobile-first responsive grid system


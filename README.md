# 🛍️ Flipkart Clone — Full-Stack E-Commerce Platform

> A production-grade Flipkart clone built with **Next.js 16**, **Express.js**, **PostgreSQL (Supabase)**, and **Prisma ORM**. Achieves near 1:1 visual and functional parity with the 2025 Flipkart website.

🔗 **Live Demo**: [flipkart-gold-six.vercel.app](https://flipkart-gold-six.vercel.app)  
🔗 **Backend API**: [flipkart-1yht.onrender.com/api/health](https://flipkart-1yht.onrender.com/api/health)

---

## 📸 Preview

| Home Page | Product Detail | Category Page |
|---|---|---|
| Full product grid with category rows | Image carousel, specs, delivery estimate | Themed rows, filters, pagination |

---

## 🚀 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.2.1 (App Router) | React framework with SSR/CSR |
| **React** | 19.2.4 | UI library |
| **Vanilla CSS** | — | Styling (Flipkart design system) |
| **Axios** | 1.14.0 | HTTP client with interceptors |
| **Zustand** | 5.0.12 | Cart & global state management |
| **Swiper.js** | 12.1.3 | Image carousels |
| **React Hot Toast** | 2.6.0 | Toast notifications |
| **React Icons** | 5.6.0 | Icon library |
| **js-cookie** | 3.0.5 | Cookie-based auth token management |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 18+ | Runtime |
| **Express.js** | 4.18.3 | REST API framework |
| **Prisma ORM** | 5.10.2 | Type-safe database client |
| **Nodemailer** | 6.9.11 | Transactional email (order confirmations) |
| **jsonwebtoken** | 9.0.2 | JWT-based authentication |
| **bcryptjs** | 2.4.3 | Password hashing |
| **Helmet** | 7.1.0 | HTTP security headers |
| **Morgan** | 1.10.0 | HTTP request logging |
| **CORS** | 2.8.5 | Cross-origin request handling |
| **express-async-errors** | 3.1.1 | Async error propagation |

### Database & Infrastructure
| Service | Purpose |
|---|---|
| **PostgreSQL** (via Supabase) | Primary relational database |
| **Supabase** | Managed PostgreSQL + Auth |
| **Vercel** | Frontend deployment (Next.js) |
| **Render** | Backend deployment (Express) |
| **Gmail SMTP** | Email delivery via Nodemailer |

---

## ✨ Features

### 🛒 Core E-Commerce
- **Product Catalog** — Grid layout with 10 categories (Electronics, Mobiles, Fashion, Beauty, Appliances, Toys, Groceries, Sports, Books, Home)
- **Product Detail Page** — Full image carousel, star ratings, detailed specifications, stock status
- **Search** — Real-time debounced search across title, description, and category
- **Smart Filtering** — Dynamic filters by brand, price range, rating, and product specifications (JSONB-powered)
- **Shopping Cart** — Add/remove/update, live price breakdown (MRP, discount, final price)
- **Checkout Flow** — Multi-step form with address selection and order placement
- **Order Management** — Order confirmation page with unique Order ID + full order history

### 🏠 Address Management
- **Address Book** — Save multiple delivery addresses in your profile
- **Smart Pincode Auto-fill** — Enter 6-digit pincode to auto-fill City and State via `api.postalpincode.in`
- **State Dropdown** — All 36 Indian States and Union Territories
- **Checkout ↔ Profile Sync** — Addresses added during checkout are saved to your profile; profile addresses appear at checkout

### 📦 Delivery Intelligence
- **Category-based Delivery Dates** — Electronics, Mobiles get faster delivery than Grocery or Books
- **Metro Express Delivery** — Pincodes in Delhi, Mumbai, Bangalore, Chennai trigger an "Express Delivery" badge
- **Real-time Estimates** — Delivery dates shown on product page based on pincode + category

### 📧 Email Notifications
- **Order Confirmation Emails** — Rich HTML template sent automatically on order placement
- **Itemized Invoice** — Shows each item, price at purchase, totals, and shipping address
- **Nodemailer + Gmail SMTP** — Secured via Gmail App Password

### 👤 Authentication
- **JWT-based Auth** — Stateless token auth with 7-day expiry
- **Supabase Auth Integration** — OTP and social login ready
- **Protected Routes** — Cart, orders, wishlist, profile require authentication
- **Auto-redirect** — 401 responses globally redirect to login

### 💖 Wishlist
- **Toggle Wishlist** — Add/remove products from wishlist
- **Persistent** — Wishlist saved in PostgreSQL per user
- **Move to Cart** — One-click move from wishlist to cart

### 🎨 UI/UX
- **Flipkart-accurate Navbar** — Logo, search bar, login/cart/wishlist icons, category nav strip
- **Loading Skeletons** — Skeleton screens while data loads
- **Toast Notifications** — Success/error feedback for all actions
- **Fully Responsive** — Mobile, tablet, and desktop layouts
- **Image Lazy Loading** — Optimized image loading performance

---

## 📁 Project Structure

```
Flipkart/
├── backend/
│   ├── config/
│   │   ├── db.js                   # Prisma singleton client
│   │   └── supabase.js             # Supabase admin client
│   ├── controllers/
│   │   ├── auth.controller.js      # Login, signup, profile management
│   │   ├── product.controller.js   # Products, categories, search, filters
│   │   ├── cart.controller.js      # Cart CRUD
│   │   ├── order.controller.js     # Order placement + email trigger
│   │   ├── wishlist.controller.js  # Wishlist toggle
│   │   └── address.controller.js   # User address CRUD
│   ├── middleware/
│   │   ├── auth.middleware.js      # JWT verification
│   │   └── error.middleware.js     # Global error handler + Prisma error mapping
│   ├── prisma/
│   │   ├── schema.prisma           # DB schema (10 models)
│   │   └── seed_enterprise.js      # Seeds 500+ products across 10 categories
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── cart.routes.js
│   │   ├── order.routes.js
│   │   ├── wishlist.routes.js
│   │   └── address.routes.js
│   ├── services/
│   │   └── email.service.js        # Nodemailer HTML email template
│   ├── scripts/                    # Data scraping and seeding utilities
│   ├── .env                        # Environment config (not committed)
│   └── server.js                   # Express entry point
│
└── frontend/
    ├── app/
    │   ├── page.js                 # Home — category rows layout
    │   ├── categories/[slug]/      # Category Landing Page (CLP)
    │   ├── products/[id]/          # Product Detail Page (PDP) with delivery estimate
    │   ├── cart/                   # Cart page
    │   ├── checkout/               # Checkout with smart address form
    │   ├── order-success/[id]/     # Order confirmation
    │   ├── orders/                 # Order history
    │   ├── wishlist/               # Wishlist
    │   ├── profile/                # User profile + address book
    │   └── auth/login|signup/      # Authentication pages
    ├── components/
    │   ├── Navbar.jsx              # Full Flipkart-style navbar
    │   ├── ProductCard.jsx         # Product grid card
    │   ├── AddressManager.jsx      # Smart address form with pincode auto-fill
    │   ├── ImageGrid.jsx           # Product image gallery
    │   ├── LoadingSkeleton.jsx     # Skeleton loading states
    │   └── clp/                   # Category Landing Page components
    ├── context/
    │   └── AuthContext.js          # Global auth + cart state
    ├── services/api/
    │   ├── axios.js                # Axios instance with JWT interceptors + 401 handler
    │   ├── auth.api.js
    │   ├── products.api.js
    │   ├── cart.api.js
    │   ├── orders.api.js
    │   ├── wishlist.api.js
    │   └── address.api.js
    └── [next.config, tailwind.config, etc.]
```

---

## 🗄️ Database Schema (PostgreSQL / Supabase)

| Table | Key Fields | Description |
|---|---|---|
| `profiles` | id, name, email, phone, avatarUrl | User accounts |
| `addresses` | fullName, phone, addressLine1, city, state, postalCode | User saved addresses |
| `categories` | name, slug, imageUrl | Product categories |
| `products` | title, price, discountPrice, rating, brand, specifications (JSONB), thumbnail | Product catalog |
| `product_images` | productId, imageUrl, displayOrder | Product gallery images |
| `carts` | userId | One cart per user |
| `cart_items` | cartId, productId, quantity | Cart line items |
| `orders` | userId, shippingSnapshot fields, finalAmount, status | Order header |
| `order_items` | orderId, productId, title, priceAtPurchase, quantity | Order line items (price/title snapshotted) |
| `wishlists` | userId, productId | Wishlist entries |

> **Data Snapshotting**: `order_items` stores `title` and `priceAtPurchase` at the time of purchase so order history remains accurate even if products change later.

---

## ⚙️ REST API Endpoints

```
Auth:
  POST   /api/auth/register
  POST   /api/auth/login
  GET    /api/auth/me              (protected)
  PUT    /api/auth/profile         (protected)

Products:
  GET    /api/products             ?search=&category=&sort=&brand=&minPrice=&maxPrice=&page=&limit=
  GET    /api/products/home-layout
  GET    /api/products/featured
  GET    /api/products/filters     ?category=&search=
  GET    /api/products/:id
  GET    /api/categories

Cart (protected):
  GET    /api/cart
  POST   /api/cart/add
  PUT    /api/cart/update
  DELETE /api/cart/remove/:itemId
  DELETE /api/cart/clear

Orders (protected):
  POST   /api/orders
  GET    /api/orders
  GET    /api/orders/:id

Wishlist (protected):
  GET    /api/wishlist
  POST   /api/wishlist/toggle
  DELETE /api/wishlist/:productId

Addresses (protected):
  GET    /api/addresses
  POST   /api/addresses
  PUT    /api/addresses/:id
  DELETE /api/addresses/:id
  PATCH  /api/addresses/:id/default
```

---

## 🛠️ Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL or a [Supabase](https://supabase.com) project
- npm 9+

### 1. Clone & Install

```bash
git clone https://github.com/naman439/Flipkart.git
cd Flipkart
```

```bash
# Backend
cd backend
cp .env.example .env       # Fill in your credentials
npm install                # Also runs prisma generate via postinstall
npx prisma db push         # Push schema to your PostgreSQL DB
npm run seed:enterprise    # Seed 500+ products across 10 categories
npm run dev                # http://localhost:3050
```

```bash
# Frontend (in a new terminal)
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:3050/api" > .env.local
npm install
npm run dev                # http://localhost:3000
```

### 2. Backend Environment Variables (`backend/.env`)

```env
# Database
DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/postgres"

# Auth
JWT_SECRET="your_strong_secret_key"
JWT_EXPIRES_IN="7d"

# Server
PORT=3050
NODE_ENV=development

# Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_16_char_app_password
EMAIL_FROM="Flipkart Clone <your@gmail.com>"

# CORS
FRONTEND_URL=http://localhost:3000

# Supabase (optional - for Auth)
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your_anon_key"
```

### 3. Frontend Environment Variables (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3050/api
```

---

## 🚀 Production Deployment

### Frontend → Vercel
1. Push to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Set **Root Directory** to `frontend`
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend.onrender.com/api`
5. Deploy

### Backend → Render
1. Connect repository to [Render](https://render.com)
2. Set **Root Directory** to `backend`
3. Set **Build Command**: `npm install && npx prisma generate`
4. Set **Start Command**: `npm start`
5. Add all Environment Variables from the table above
6. Set `NODE_ENV` = `production`

> **Important**: Use Supabase's **Transaction Pooler URL (Port 6543)** for `DATABASE_URL` and **Session Mode URL (Port 5432)** for `DIRECT_URL` for optimal performance on Render.

---

## 🏗️ Architecture Decisions

| Decision | Reason |
|---|---|
| **Prisma ORM** | Type-safe queries, auto-migrations, excellent DX |
| **JSONB for specs** | Product specifications vary per category; JSONB allows flexible key-value pairs without schema changes |
| **Data Snapshotting** | Order items store `title` + `priceAtPurchase` so order history stays accurate forever |
| **Zustand over Redux** | Lightweight, no boilerplate, perfect for cart/auth scope |
| **Axios Interceptors** | Centralized JWT injection + global 401 redirect in one place |
| **Supabase Connection Pooler** | Prevents connection exhaustion on Render's stateless environment |
| **Cache-Control Headers** | Categories (5 min), home layout (60s), products (30s) — dramatically reduces DB load |
| **binaryTargets in Prisma** | Ensures Prisma generates compatible binaries for both macOS (dev) and Render Linux (prod) |
| **postinstall → prisma generate** | Guarantees Prisma client is always generated even if the CI build command is misconfigured |

---

## 📊 Performance Optimizations

- **Single Nested Query for Home Layout** — Replaced N+1 queries (one per category) with a single Prisma nested select
- **HTTP Cache-Control Headers** — Static-ish endpoints cached at CDN/browser level
- **Debounced Search** — 500ms delay prevents API flooding during typing
- **Image Lazy Loading** — Products images load only when in viewport
- **Prisma Connection Singleton** — Prevents multiple DB connections during Next.js hot reloads

---

## 📬 Email Notification Sample

On every successful order, the customer receives a full HTML email with:
- Order ID and order date
- Itemized list of products (name, quantity, price)
- Total breakdown (subtotal + tax + delivery)
- Complete shipping address

---

## 📄 License

MIT License — feel free to use this project for learning and portfolio purposes.

---

<p align="center">Built with ❤️ — Flipkart Clone by <a href="https://github.com/naman439">naman439</a></p>

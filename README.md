# 🛍️ Flipkart Clone – Full-Stack E-Commerce Application

A production-ready Flipkart clone built with **Next.js**, **Node.js + Express**, **MySQL**, and **Prisma ORM**. Replicates Flipkart's UI/UX with complete e-commerce functionality.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), Vanilla CSS |
| **Backend** | Node.js + Express.js |
| **Database** | MySQL |
| **ORM** | Prisma |
| **Auth** | JWT (JSON Web Tokens) |
| **Email** | Nodemailer |
| **State** | React Context API |

---

## ✨ Features

### Core
- ✅ Product listing with grid layout (Flipkart-style)
- ✅ Category sidebar filter + debounced search + sort options
- ✅ Product detail page with image carousel and specifications
- ✅ Shopping cart (add, remove, update quantity, price breakdown)
- ✅ Multi-step checkout with shipping address form
- ✅ Order placement with confirmation page + Order ID
- ✅ JWT-based authentication (login/signup)

### Good-to-Have
- ✅ Wishlist (add/remove, move to cart)
- ✅ Order history with pagination
- ✅ Email notification on order placement (Nodemailer)
- ✅ Loading skeletons for better UX
- ✅ Toast notifications (success/error)
- ✅ Debounced search (500ms)
- ✅ Product sorting (price, rating, newest, discount)
- ✅ Pagination for product listing
- ✅ Lazy loading images
- ✅ Fully responsive (mobile, tablet, desktop)

---

## 📁 Project Structure

```
Flipkart Clone/
├── backend/
│   ├── config/db.js              # Prisma client singleton
│   ├── controllers/              # Business logic
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── cart.controller.js
│   │   ├── order.controller.js
│   │   └── wishlist.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT protection
│   │   └── error.middleware.js   # Global error handler
│   ├── prisma/
│   │   ├── schema.prisma         # DB schema (8 tables)
│   │   └── seed.js               # Sample data (30 products)
│   ├── routes/                   # Express route definitions
│   ├── services/
│   │   └── email.service.js      # Nodemailer
│   ├── .env.example
│   └── server.js
│
└── frontend/
    ├── app/                      # Next.js App Router pages
    │   ├── page.js               # Home
    │   ├── products/page.js      # Product listing
    │   ├── products/[id]/page.js # Product detail
    │   ├── cart/page.js
    │   ├── checkout/page.js
    │   ├── order-success/[id]/   # Order confirmation
    │   ├── orders/page.js        # Order history
    │   ├── wishlist/page.js
    │   └── auth/login|signup
    ├── components/               # Reusable UI components
    │   ├── Navbar.jsx
    │   ├── ProductCard.jsx
    │   ├── Footer.jsx
    │   └── LoadingSkeleton.jsx
    ├── context/
    │   ├── AuthContext.js        # JWT auth state
    │   └── CartContext.js        # Cart state
    ├── hooks/
    │   ├── useDebounce.js
    │   └── useWishlist.js
    ├── services/api/             # Axios API layer
    └── utils/helpers.js
```

---

## 🗄️ Database Schema

| Table | Description |
|---|---|
| `users` | User accounts (email, bcrypt password) |
| `categories` | Product categories with slug |
| `products` | Products with images (JSON), specs (JSON), pricing |
| `carts` | One cart per user |
| `cart_items` | Individual cart product rows with quantity |
| `orders` | Order header with shipping + payment info |
| `order_items` | Line items per order (price snapshot) |
| `wishlists` | User-product wishlist entries |

---

## ⚙️ REST API Endpoints

```
Auth:
  POST   /api/auth/register
  POST   /api/auth/login
  GET    /api/auth/me         (protected)
  PUT    /api/auth/profile    (protected)

Products:
  GET    /api/products          ?search=&category=&sort=&page=&limit=
  GET    /api/products/:id
  GET    /api/products/featured
  GET    /api/products/categories

Cart (protected):
  GET    /api/cart
  POST   /api/cart/add
  PUT    /api/cart/update
  DELETE /api/cart/remove
  DELETE /api/cart/clear

Orders (protected):
  POST   /api/orders
  GET    /api/orders
  GET    /api/orders/:id

Wishlist (protected):
  GET    /api/wishlist
  POST   /api/wishlist         (toggle add/remove)
  DELETE /api/wishlist/:productId
```

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm 9+

### 1. Clone & Install

```bash
# Backend
cd backend
cp .env.example .env       # Fill in your MySQL credentials & JWT secret
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed               # Seeds 6 categories + 30 products
npm run dev                # http://localhost:5000

# Frontend
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
npm install
npm run dev                # http://localhost:3000
```

### 2. Environment Variables

**Backend `.env`:**
```
DATABASE_URL="mysql://root:password@localhost:3306/flipkart_clone"
JWT_SECRET="your_secret_key"
JWT_EXPIRES_IN="7d"
PORT=5000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:3000
```

**Frontend `.env.local`:**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🚀 Deployment

| Service | Platform |
|---|---|
| **Frontend** | [Vercel](https://vercel.com) – `cd frontend && vercel` |
| **Backend** | [Render](https://render.com) or [Railway](https://railway.app) |
| **Database** | [Neon](https://neon.tech) (free MySQL/Postgres) or [Supabase](https://supabase.com) |

**Deployment Steps:**
1. Push to GitHub
2. Connect Vercel to `frontend/` folder
3. Deploy backend to Render (set all env vars)
4. Update `NEXT_PUBLIC_API_URL` in Vercel env to your Render URL
5. Update `FRONTEND_URL` in Render env to your Vercel URL
6. Run `npx prisma migrate deploy` on your production DB

---

## 💡 Assumptions

1. Payment is simulated (COD, UPI, Card options shown but not processed)
2. Product images use Unsplash URLs (free, no API key needed)
3. Email notifications require valid SMTP credentials to send (gracefully skipped if not configured)
4. Stock is decremented on order placement
5. Cart is per-user and persisted in the database

---

## 🧪 Interview Walkthrough

### Architecture Decisions
- **Prisma ORM** — type-safe queries, easy migrations, great DX
- **JWT in localStorage** — simple stateless auth; refresh tokens can be added for production
- **React Context** — lightweight over Redux for this scope; no extra bundle size
- **Prisma transactions** — order placement atomically creates order, decrements stock, clears cart
- **Debounced search** — reduces API calls from keystroke-level to 500ms intervals
- **CSS Variables** — Flipkart design tokens centralized for easy theming

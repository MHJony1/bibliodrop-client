<div align="center">

<img src="https://raw.githubusercontent.com/MHJony1/bibliodrop-client/main/public/favicon.png" alt="BiblioDrop Logo" width="80" height="80" />

# 📚 BiblioDrop

### *Your Favorite Books, Delivered Luxury to You*

> A full-stack Online Book Delivery Management System connecting readers with local libraries and independent book owners — with doorstep delivery, Stripe payments, and role-based dashboards.

<br/>

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-6C47FF?style=for-the-badge)](https://bibliodrop-client-nu.vercel.app)
[![Client Repo](https://img.shields.io/badge/GitHub-Client_Repo-181717?style=for-the-badge&logo=github)](https://github.com/your-username/bibliodrop-client)
[![Server Repo](https://img.shields.io/badge/GitHub-Server_Repo-181717?style=for-the-badge&logo=github)](https://github.com/your-username/bibliodrop-server)

<br/>

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

</div>

---

## 🌟 Overview

**BiblioDrop** is a comprehensive digital platform that bridges the gap between readers and local book providers. Traditional libraries require physical visits — BiblioDrop eliminates that barrier entirely.

Readers can browse curated collections, pay delivery fees via Stripe, and track their orders in real time. Librarians manage their inventory and delivery pipeline. Admins oversee the entire ecosystem with analytics and moderation tools.

> **"Democratizing access to books — one doorstep at a time."**

---

## 🔗 Live Links

| Resource | URL |
|---|---|
| 🌐 Live Website | [https://bibliodrop-client-nu.vercel.app](https://bibliodrop-client-nu.vercel.app) |
| 🖥️ Client Repository | [GitHub — Client](https://github.com/MHJony1/bibliodrop-client) |
| ⚙️ Server Repository | [GitHub — Server](https://github.com/MHJony1/bibliodrop-server) |

---

## ✨ Features

### 👤 For Readers
- Browse, search, filter, and sort the entire book catalog
- Request doorstep delivery via **Stripe** payment integration
- Track delivery status: `Pending → Dispatched → Delivered`
- Leave **verified reviews** only after confirmed delivery
- Manage personal **Reading List** and **Wishlist**
- Full delivery history with spending analytics

### 📚 For Librarians
- Add and manage book inventory with **imgBB** image hosting
- Books enter a `Pending Approval` state before going public
- Toggle published/unpublished status for approved books
- Manage delivery pipeline and update order statuses
- Dashboard with earnings, pending requests, and analytics charts

### 🛡️ For Admins
- Approve or reject books from the **Approval Queue**
- Manage all users: assign roles, delete accounts
- Full control over all listings — unpublish or delete any book
- View all platform transactions with complete audit trail
- Analytics dashboard with user stats, revenue, and category pie chart

### 🔧 Platform-Wide
- **Role-based authentication** with Better Auth (email/password + Google OAuth)
- **JWT** secured via HTTP-only cookies on all protected API routes
- Animated UI with **Framer Motion** throughout
- Skeleton loaders, toast notifications, and a custom 404 page
- Fully responsive across mobile, tablet, and desktop
- **Dark / Light mode** toggle with persistent preference
- Server-side pagination on the Browse Books page

---

## 🛠️ Tech Stack

### Frontend
| Technology | Role |
|---|---|
| **Next.js 15** (App Router) | Core full-stack framework |
| **React 19** | UI component library |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Animations & page transitions |
| **Swiper.js** | Hero carousel / sliders |
| **Recharts** | Dashboard data visualization |

### Backend
| Technology | Role |
|---|---|
| **Node.js** | Server runtime |
| **Express.js** | REST API framework |
| **MongoDB** (Atlas) | Primary database |
| **JWT** | Stateless authentication tokens |
| **Stripe** | Payment processing |

### Services & APIs
| Service | Role |
|---|---|
| **Better Auth** | Authentication provider (OAuth + credentials) |
| **imgBB API** | Image hosting for book covers & avatars |
| **Stripe API** | Delivery fee payment gateway |
| **Vercel** | Client & Server deployment |

---

## 📦 NPM Packages

### Client-Side

| Package | Purpose |
|---|---|
| `next` | Core framework with App Router |
| `react` / `react-dom` | UI rendering |
| `framer-motion` | Animations and transitions |
| `swiper` | Touch-friendly carousels |
| `react-hook-form` | Form handling and validation |
| `react-hot-toast` | Toast notification system |
| `lucide-react` | Primary icon library |
| `react-icons` | Extended icons (FA, MD, GI, IO) |
| `recharts` | Charts for dashboard analytics |
| `tailwindcss` | Utility-first CSS framework |
| `axios` | HTTP client for API calls |
| `@stripe/stripe-js` | Stripe frontend SDK |
| `@stripe/react-stripe-js` | Stripe React components |

### Server-Side

| Package | Purpose |
|---|---|
| `express` | Node.js web framework |
| `mongodb` | MongoDB native driver |
| `jsonwebtoken` | JWT generation and verification |
| `cors` | Cross-origin resource sharing |
| `dotenv` | Environment variable management |
| `stripe` | Stripe server-side SDK |
| `cookie-parser` | HTTP cookie parsing |

---

## 📁 Project Structure

### 🖥️ Client — `bibliodrop-client`

```
bibliodrop-client/
│
├── 📁 public/
│   └── favicon.png
│
├── 📁 src/
│   │
│   ├── 📁 app/                               # Next.js App Router
│   │   ├── 📁 aboutUs/                       # About Us page
│   │   ├── 📁 api/                           # Better Auth API handlers
│   │   ├── 📁 auth/                          # Login & Register pages
│   │   ├── 📁 browsebooks/                   # Public book catalog page
│   │   ├── 📁 dashboard/
│   │   │   ├── 📁 admin/                     # Admin dashboard & controls
│   │   │   ├── 📁 librarian/                 # Librarian inventory & delivery mgmt
│   │   │   ├── 📁 user/                      # Reader history, wishlist, reviews
│   │   │   └── layout.js                     # Shared dashboard sidebar layout
│   │   ├── 📁 payment/                       # Stripe checkout & success page
│   │   ├── 📁 unauthorized/                  # 403 Unauthorized page
│   │   ├── globals.css
│   │   ├── layout.js                         # Root layout (Navbar + Footer)
│   │   ├── not-found.js                      # Custom 404 page
│   │   └── page.js                           # Home page
│   │
│   ├── 📁 components/
│   │   ├── 📁 booksrelated/                  # BookCard, BookGrid, BookDetails UI
│   │   ├── 📁 dashboardrelated/              # Charts, stat cards, data tables
│   │   ├── 📁 homepage/                      # Hero, FeaturedBooks, Categories, etc.
│   │   └── 📁 shared/
│   │       └── SkeletonLoader.jsx            # Global skeleton loading component
│   │
│   └── 📁 lib/                               # Auth config, API helpers, utils
│
├── .env.local                               
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package.json
├── postcss.config.mjs
└── README.md
```

---

### ⚙️ Server — `bibliodrop-server`

```
bibliodrop-server/
│
├── index.js                                  # Express app entry point
│   │                                         # ── MongoDB Atlas connection
│   │                                         # ── Global middleware setup
│   │                                         # ── All REST API route definitions
│   │
│   ├── 📌 Books API
│   │   ├── GET    /api/books                 # Browse (filter, sort, paginate)
│   │   ├── GET    /api/books/:id             # Single book details
│   │   ├── POST   /api/books                 # Add book (Librarian) → Pending Approval
│   │   ├── PATCH  /api/books/:id             # Edit book details
│   │   ├── PATCH  /api/books/:id/status      # Publish / Unpublish toggle
│   │   └── DELETE /api/books/:id             # Delete book
│   │
│   ├── 📌 Users API
│   │   ├── GET    /api/users                 # All users (Admin)
│   │   ├── PATCH  /api/users/role            # Change user role (Admin)
│   │   └── DELETE /api/users/:id             # Delete user (Admin)
│   │
│   ├── 📌 Deliveries API
│   │   ├── GET    /api/deliveries            # All deliveries (Admin / Librarian)
│   │   ├── POST   /api/deliveries            # Create delivery request (Reader)
│   │   └── PATCH  /api/deliveries/:id        # Update status → Dispatched / Delivered
│   │
│   ├── 📌 Reviews API
│   │   ├── GET    /api/reviews/:bookId       # Get reviews for a book
│   │   └── POST   /api/reviews               # Post review (verified delivery only)
│   │
│   ├── 📌 Payments API
│   │   └── POST   /api/payments              # Create Stripe payment intent
│
├── .env                                      
├── .gitignore
├── package.json
├── package-lock.json
└── vercel.json                               # Vercel deployment config
```

---

## 🔐 Role-Based Access

| Feature | Guest | Reader | Librarian | Admin |
|---|:---:|:---:|:---:|:---:|
| Browse Books | ✅ | ✅ | ✅ | ✅ |
| View Book Details | ✅ | ✅ | ✅ | ✅ |
| Request Delivery | ❌ | ✅ | ❌ | ❌ |
| Leave Reviews | ❌ | ✅* | ❌ | ❌ |
| Add Books | ❌ | ❌ | ✅ | ❌ |
| Manage Inventory | ❌ | ❌ | ✅ | ✅ |
| Update Delivery Status | ❌ | ❌ | ✅ | ❌ |
| Approve Books | ❌ | ❌ | ❌ | ✅ |
| Manage All Users | ❌ | ❌ | ❌ | ✅ |
| View All Transactions | ❌ | ❌ | ❌ | ✅ |

> \* Only users with a `Delivered` status for that specific book can leave a review.
---

## 📄 License

This project is built for educational and assessment purposes.

---

<div align="center">

Made with ❤️ by **Mahmudul Hasan Jony**


</div>

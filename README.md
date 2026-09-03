# MEMORA — "Capture Moments. Create Memories." 📸✨

> **MEMORA** is a full-stack photography studio booking & customized photo products e-commerce platform built for the Indian market.

---

## 🚀 Key Highlights & Features

### 1. 👥 Three Role-Based Portals (RBAC)
- **Customer Portal**:
  - Search & filter verified studios across major Indian cities (Chennai, Bengaluru, Mumbai, Delhi, Hyderabad).
  - Side-by-side comparison matrix of studios (amenities, camera gear, ratings, pricing).
  - Date & slot reservations with **20% advance calculation** and unique booking IDs (`MEM-BKG-XXXX`).
  - E-Commerce photo store with **Live 3D-Style Photo Customizer** (upload photo from device, engraved couple names, anniversary dates, solid teak wood frames, sizes).
  - Cart, coupon discounts (`WELCOME10`, `MEMORA500`, `FESTIVE20`), Razorpay simulation (INR ₹).
  - Order tracking with **Visual 10-Step Timeline Tracker** & **Printable Tax Invoices (PDF/Print)**.
  - Digital Proof Reviewer with 1-click customer approval or revision requests.
  - Saved Wishlists, Address Book, and Notifications center.

- **Shop Owner / Studio Seller Portal**:
  - Comprehensive seller KPI dashboard (daily/monthly revenue, active jobs, low-stock warnings).
  - **10-Stage Horizontal Kanban Photo Job Board** with drag/click advancing:
    `New Order → Photo Upload → Editing → Proof Upload → Customer Approval → Printing → QC Checklist → Ready → Out for Delivery → Completed`
  - Studio profile & portfolio CRUD with image galleries.
  - Photoshoot packages & pricing manager with deliverable checklists.
  - Bookings calendar with client contact info.
  - Proof uploader & customer comment tracker.
  - Real-time inventory & stock replenishment.
  - Revenue trends and monthly payout breakdowns.

- **Super Administrator Portal**:
  - Executive KPI analytics (Total GMV, 10% Platform Commission Take-Rate, Active Studios, Total Orders).
  - Studio verification & moderation queue (1-click Approve / Suspend).
  - Photoshoot category taxonomy manager.
  - Promotional discount coupon code engine.
  - Registered user directory & activation toggles.
  - Customer dispute tickets & resolution desk.
  - Category-level sales and booking volume reports.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express.js, TypeScript, JWT Authentication, Multer (25MB photo uploads), Morgan.
- **Database**: MongoDB with Mongoose (with automated fallback to embedded `mongodb-memory-server` for instant local execution without external dependencies).

---

## 🔑 Demo Test Credentials (1-Click Switcher in UI)

| Role | Email | Password | Quick Features |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@memora.com` | `Customer@123` | Studio booking, 3D customizer, orders stepper |
| **Shop Owner** | `owner@memora.com` | `Owner@123` | 10-Stage Kanban Board, Package & Studio CRUD |
| **Admin** | `admin@memora.com` | `Admin@123` | 10% Commission KPIs, Moderation, Coupon CRUD |

---

## 🏃 Getting Started

### 1. Backend Setup & Seeding
```bash
cd backend
npm install
npm run seed      # Seeds studios, packages, customizable products, orders & Kanban jobs
npm run dev       # Starts backend on http://localhost:5000
```

### 2. Frontend Setup (Web)
```bash
cd frontend
npm install
npm run dev       # Starts web app on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

### 3. Mobile App Setup (iOS & Android)
```bash
cd mobile
npm install
npm start         # Starts Expo dev server for iOS, Android & Expo Go
```

- Press `a` to launch on Android Emulator
- Press `i` to launch on iOS Simulator
- Scan the QR code with **Expo Go** on your physical phone!

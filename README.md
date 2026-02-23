## Ekic University Digital Portal

Modern, mobile-first student and admin portal for Ekic University in Mitaboni, Machakos – designed for African connectivity realities, presidential-level branding, and long‑term growth.

---

### Vision

- **Dual-portal experience** for Students and Admin/Staff, sharing a single secure backend.
- **Kenya-aware**: M‑Pesa‑first payments, KCSE‑aligned grading, HELB‑friendly finance flows.
- **Resilient by design**: Works gracefully on slow or intermittent networks with offline views for core student journeys.

---

### Architecture Overview

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router, TanStack Query, Zustand.
- **Backend**: Node.js + Express, Prisma, PostgreSQL.
- **Auth**: JWT access tokens + HTTP‑only refresh tokens, role‑based access control (RBAC).
- **Data**: Prisma schema tailored for Kenyan university operations (students, staff, programs, courses, fees, payments, announcements, documents).
- **Real-time & UX**: Socket.io (planned) for live announcements, Recharts for analytics, shadcn/ui for a cohesive design system.
- **Offline‑first** (planned): Service worker + IndexedDB caching for timetable, announcements, basic profile and fees.
- **Deployment** (planned): Docker, docker‑compose, Nginx reverse proxy, GitHub Actions CI.

---

### Repository Layout

- **`/src`** – React frontend
  - **`/components`** – shared UI and sections (landing page, student components, shadcn primitives in `components/ui`)
  - **`/pages`**
    - marketing pages: `Index`, `About`, `Academics`, `Admissions`, `Fees`, `News`, `Gallery`, `Contact`, `PrivacyPolicy`
    - portals: `StudentDashboard`, `AdminDashboard`
    - auth: `Auth` (legacy Supabase-based experience – being migrated to JWT/Express)
  - **`/hooks`**
    - `use-toast` – app‑wide notifications
    - `use-mobile` – helpers for mobile breakpoints
    - `useLocalStorage` – typed localStorage hook for offline‑sensitive state
    - `useAuth` – **new** JWT/RBAC‑ready auth store (Zustand)
  - **`/lib`**
    - `utils.ts` – `cn` helper and UI utilities
    - `api.ts` – **new** Axios instance with token & refresh interceptors
    - `apiRoutes.ts` – **new** typed API route map (AUTH/STUDENTS/ADMIN/PUBLIC)
  - **`/integrations/supabase`** – existing Supabase client and edge functions (used by the legacy MVP flows)
  - **Student‑specific components** in `components/student/*` (timetable, announcements, bookings)

- **`/backend`** – Express + Prisma API (new)
  - `src/config/env.ts` – environment configuration (port, DB URL, JWT secrets, CORS origin)
  - `src/prisma/client.ts` – Prisma client singleton
  - `src/utils/jwt.ts` – JWT helpers (sign/verify access & refresh tokens)
  - `src/middleware/auth.ts` – authentication + RBAC middleware
  - `src/controllers/auth.controller.ts` – register/login/refresh/logout handlers
  - `src/routes/auth.routes.ts` – `/api/auth/*` routes
  - `src/app.ts` – Express app, CORS, Helmet, logging, route mounting
  - `src/server.ts` – HTTP server bootstrap
  - `prisma/schema.prisma` – full university data model
  - `.env.example` – backend environment template

---

### Getting Started (Local)

#### 1. Prerequisites

- **Node.js** 20+
- **npm** 10+
- **PostgreSQL** 14+ (local instance or container)

#### 2. Install frontend dependencies

```bash
npm install
```

#### 3. Backend setup

```bash
cd backend
npm install

# copy env template and point DATABASE_URL to your Postgres instance
cp .env.example .env

# generate Prisma client & run initial migrations (will create all tables)
npm run prisma:generate
npm run prisma:migrate

# optional: when seed script is added
# npm run prisma:seed

# start API in dev mode
npm run dev
```

By default the backend listens on `http://localhost:4000`.

#### 4. Frontend dev server

From the project root:

```bash
npm run dev
```

The Vite dev server will start on `http://localhost:5173`.

You can now access:

- **Public site**: landing, about, academics, admissions, etc.
- **Student/Admin dashboards**: existing Supabase‑backed demo dashboards.

As the new Express/JWT backend is wired in, the auth and portal routes will be migrated to use `/api/*` instead of Supabase.

---

### Environment Configuration

- **Frontend** (`.env` in project root)

```bash
VITE_API_BASE_URL=http://localhost:4000
```

- **Backend** (`backend/.env`)

```bash
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://ekic:ekic@localhost:5432/ekic
JWT_ACCESS_SECRET=replace-with-strong-access-secret
JWT_REFRESH_SECRET=replace-with-strong-refresh-secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

These values are aligned with local development; production will use separate secrets and managed Postgres.

---

### Current Status vs. Target Vision

- **Already in place**
  - Modern React + TypeScript + Tailwind + shadcn/ui frontend.
  - Rich, branded marketing site tailored to a Kenyan private institution.
  - Student and admin dashboards powered by Supabase (auth, students, fees, content).
  - New **Express + Prisma backend skeleton** with:
    - production‑grade Prisma schema for users, students, staff, programs, courses, fees, payments, announcements, and documents.
    - JWT auth controller and middleware.
    - Typed Axios client, auth store, and route map ready for full API integration.

- **Being implemented next**
  - **Phase 1**: Dedicated auth pages and layouts for Ekic University with JWT‑based flows:
    - `LoginForm`, `RegisterForm`, `ForgotPassword`, `ResetPassword` (React Hook Form + Zod).
    - `MainLayout` with responsive navbar, online/offline indicator, and Sheng toggle.
  - **Phase 2**: Student portal pages under `src/pages/student/*` using TanStack Query against the new `/api/students/*` endpoints:
    - Dashboard widgets (academics, finance, timetable, announcements).
    - Digital ID with QR code and download.
    - Fee balance, M‑Pesa mock payments, receipts.
  - **Phase 3**: Admin portal under `src/pages/admin/*`:
    - Student management, course & schedule management, fee configuration, grade uploads, announcements, bulk messaging, and analytics.
  - **Phase 4**: Offline‑first & Kenya‑specific enhancements:
    - Service worker, IndexedDB caching, background sync queue.
    - M‑Pesa STK‑push simulation endpoints and flows.
    - Real‑time notifications via WebSockets and browser push.

---

### Design & UX Principles

- **Mobile‑first**: layouts and components are optimised for small screens first, with progressive enhancement for larger devices.
- **Low‑bandwidth aware**:
  - Minimal blocking assets above the fold.
  - Caching strategy that prioritises timetable, announcements, and profile data.
- **African excellence branding**:
  - Palette inspired by Kenyan flag blue, green, and gold.
  - Typography using `Inter` for clean, legible UI on low‑density displays.
  - Room for contextual content: President’s welcome note, Mitaboni‑specific photography, Sheng‑friendly microcopy.

---

### Demo Accounts (planned)

Seed data and demo credentials will be wired into the backend seed script, targeting:

- **Student**: `student@ekic.ac.ke` / `Student123!`
- **Admin**: `admin@ekic.ac.ke` / `Admin123!`
- **Registrar**: `registrar@ekic.ac.ke` / `Registrar123!`

Until the seed script is finalised, you can create users directly through the auth API or database for local testing.

---

### Roadmap Highlights

- **Short term**
  - Complete migration of auth and portals from Supabase auth to JWT/Express.
  - Implement student Digital ID card with QR verification endpoint.
  - Build M‑Pesa mock payment API and UI flow.

- **Medium term**
  - Add offline‑first behaviour (service worker + IndexedDB).
  - Introduce analytics dashboards for admin (enrolment, fees, graduation readiness).
  - Add CSV/Excel bulk import for students and grades.

- **Long term**
  - Integrate real M‑Pesa APIs.
  - Extend finance to HELB/loan tracking.
  - Harden compliance for DPA 2019 (audit logs, consent flows, retention policies).

---

### Contributing

- Use **TypeScript strict‑friendly code** (`no any` where practical).
- Prefer **TanStack Query** for data fetching and caching and **Zustand** for UI/session state.
- Keep components **accessible (WCAG 2.1 AA)** and tested on mobile viewport widths.
- When adding Kenya‑specific logic (KCSE, HELB, M‑Pesa), include a short comment explaining the business rule and local context.


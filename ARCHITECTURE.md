# DSIB Tech E-Commerce Platform Architecture

This document serves as the high-level map for the project's architecture, matching the production-grade requirements.

## 1. Folder Structure (Turborepo)
- `apps/frontend/`: Next.js 15 App Router codebase.
- `apps/backend/`: Node.js/Express.js RESTful API.
- `packages/ui/`: Shared UI components (ShadCN).
- `packages/config/`: Shared tooling config (Tailwind, ESLint, TypeScript).

## 2. Database Schema
Located at `apps/backend/prisma/schema.prisma`. Uses PostgreSQL and Prisma ORM. It includes models for `User`, `Address`, `Category`, `Product`, `Review`, `Order`, and `OrderItem`.

## 3. Design System
- Tailwind CSS configured at `apps/frontend/tailwind.config.ts`.
- Deep Blue (`#0B1F3A`), Electric Cyan (`#00D9FF`), and CTA Orange (`#FF8A00`) applied as primary CSS variables in `apps/frontend/src/app/globals.css`.

## 4. Homepage Architecture
The homepage is built using a feature-based structure:
- **Hero Section**: `apps/frontend/src/features/home/Hero.tsx` (Framer motion animated banners).
- **Categories**: `apps/frontend/src/features/home/CategoryShowcase.tsx`.
- **Featured**: `apps/frontend/src/features/home/TrendingProducts.tsx`.

## 5. Authentication Architecture
- **Backend**: JWT-based auth with access/refresh tokens. Middleware located at `apps/backend/src/middlewares/authMiddleware.ts`.
- **Frontend**: API client caching auth state using Zustand. Protected routes implemented via Next.js middleware (`apps/frontend/src/middleware.ts`).

## 6. API Architecture
- Strict RESTful format (`/api/v1/...`).
- Controllers: `apps/backend/src/controllers/` (Business logic entry).
- Services: `apps/backend/src/services/` (Database transactions with Prisma).
- Routes: `apps/backend/src/routes/` (Express router definitions).
- Uniform Response wrapper: `{ success: boolean, message: string, data: any }`.

## 7. Component Structure
- `src/components/ui/`: Pure ShadCN components (Button, Input, Dialog).
- `src/components/shared/`: Reusable complex components (Navbar, ProductCard).
- `src/features/`: Domain-specific components (e.g., `features/cart`, `features/checkout`).

## 8. State Management
- **Zustand**: Global UI state. Located at `apps/frontend/src/store/useCartStore.ts` (Cart state, Wishlist).
- **React Query**: Server state. Used inside custom hooks `apps/frontend/src/hooks/useProducts.ts` for fetching, caching, and pagination.

## 9. Deployment Foundation
- **Vercel** ready for `apps/frontend`.
- **AWS/Railway** ready for `apps/backend` (using standard Express `npm start` and `dotenv`).
- **PostgreSQL** ready for Neon DB.

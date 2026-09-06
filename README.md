# College Discovery & Rank Predictor Backend 🎓

[![NestJS](https://img.shields.io/badge/Framework-NestJS-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma_v7-2D3748.svg)](https://www.prisma.io/)
[![Database](https://img.shields.io/badge/Database-Neon_PostgreSQL-green.svg)](https://neon.tech/)

A production-ready, highly scalable backend API built for a **College Discovery & Discussion Platform**. The system provides multi-parametric college search, dynamic fee/rank comparison matrices, an admission probability engine, stateless JWT authentication, and community Q&A capabilities.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** NestJS (Modular Architecture, Dependency Injection, Guards, Pipes)
- **Language:** TypeScript (Strict Mode, DTO Validation via `class-validator`)
- **Database:** Neon PostgreSQL (Serverless connection pooling via `@prisma/adapter-pg`)
- **ORM:** Prisma v7
- **Auth:** Passport-JWT & Bcrypt (Stateless token authentication)

---

## ✨ Core Feature Modules

1. **Multi-Parametric Search & Filtering (`GET /colleges`)**
   - Search by keyword (`name`, `city`), state, rating boundaries (`minRating`), and maximum tuition fee (`maxFee`).
   - Integrated asynchronous `Promise.all` count queries for efficient pagination metadata.
2. **SEO-Friendly College Profiles (`GET /colleges/:slug`)**
   - Direct slug-based queries (`nit-agartala`) eager-loading associated courses, cutoffs, and reviews.
3. **Comparison Matrix (`POST /colleges/compare`)**
   - Accepts 2–3 college IDs to compute tuition ranges and placement aggregations side by side.
4. **Rank Predictor Engine (`GET /predictor`)**
   - Algorithmically evaluates entrance exam ranks against historical cutoff boundaries (High, Moderate, and Low probability tiers).
5. **JWT Authentication (`/auth`)**
   - User registration with Bcrypt hashing and 7-day signed JWT access token issuance.
6. **Saved Items & Community Q&A (`/saved`, `/questions`)**
   - User bookmarks for colleges/comparisons (`JwtAuthGuard` protected) and discussion forums.

---

## ⚡ Quick Start & Local Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL or Neon Database connection string

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/YOUR_GITHUB_USERNAME/college-discovery-backend.git
cd college-discovery-backend
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
\`\`\`env
DATABASE_URL="postgresql://user:password@ep-example.neon.tech/neondb?sslmode=require"
JWT_SECRET="your_super_secret_jwt_key"
PORT=3000
\`\`\`

### 4. Database Setup & Migrations
\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

### 5. Start the Server
\`\`\`bash
npm run start:dev
\`\`\`
The application will be running at `http://localhost:3000`. Access Swagger UI docs at `http://localhost:3000/api`.

---

## 📸 API Testing & Verification


### Swagger API Documentation (`/api`)
![Swagger UI](./assets/swagger-ui.png)

---

## 🛣️ API Endpoints Summary

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/colleges` | No | Search & filter colleges with pagination |
| `GET` | `/colleges/:slug` | No | Fetch detailed college profile by slug |
| `POST` | `/colleges/compare` | No | Compare 2-3 colleges side-by-side |
| `GET` | `/predictor` | No | Predict admission probability based on rank |
| `POST` | `/auth/register` | No | Register a new user |
| `POST` | `/auth/login` | No | Authenticate user & generate JWT |
| `POST` | `/saved/colleges` | Yes | Bookmark a college to user profile |
| `GET` | `/saved/colleges` | Yes | Get all saved colleges for logged-in user |
| `POST` | `/questions` | Yes | Post a question to the community forum |
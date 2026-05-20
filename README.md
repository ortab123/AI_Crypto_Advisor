# AI Crypto Advisor

A full-stack web application that provides personalized cryptocurrency investment insights powered by AI.

## What It Does

Users register, complete a short onboarding quiz (risk tolerance, experience level, preferred assets), and land on a personalized dashboard showing:

- **Live crypto prices** for their selected assets (via CoinGecko API)
- **AI-generated investment advice** tailored to their profile (via Groq / LLaMA 3.1)
- **Social trend voting** — users can vote on market sentiment per coin
- **Community feedback** — upvote/downvote feature for AI responses
- **Profile & settings** management

## Tech Stack

| Layer       | Tech                                    |
| ----------- | --------------------------------------- |
| Frontend    | React 18, TypeScript, Vite, TailwindCSS |
| Backend     | Node.js, Express, TypeScript            |
| Database    | PostgreSQL (Prisma ORM)                 |
| AI          | Groq API — LLaMA 3.1 8B                 |
| Crypto data | CoinGecko Demo API                      |
| Auth        | JWT (access + refresh tokens)           |

## Live Demo

- **Frontend:** https://ai-crypto-advisor-pearl.vercel.app
- **Backend API:** https://ai-crypto-advisor-yqyg.onrender.com

## Project Structure

```
/
├── frontend/          # React app (Vite)
├── backend/           # Express API server
├── database/          # Prisma schema & migrations
└── render.yaml        # Render deployment config
```

## Running Locally

### Prerequisites

- Node.js 20+
- PostgreSQL (or use the production DB URL below for read-only inspection)

### Backend

```bash
cd backend
npm install
# create a .env file (see backend/.env.example)
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Viewing the Live Database Locally

No database client needs to be installed. As long as you have **Node.js**, you can browse the production database visually using Prisma Studio.

### Steps

**1. Clone the repository**

```bash
git clone <repo-url>
cd "Moveo Coding Task"
```

**2. Set the database URL**

On macOS/Linux:

```bash
export DATABASE_URL="postgresql://ai_crypto_advisor_ytgj_user:NrlygkTor90Waa5Zp6U5LYvUmiJf8JxC@dpg-d865k977f7vs739md3ug-a.oregon-postgres.render.com/ai_crypto_advisor_ytgj"
```

On Windows (PowerShell):

```powershell
$env:DATABASE_URL="postgresql://ai_crypto_advisor_ytgj_user:NrlygkTor90Waa5Zp6U5LYvUmiJf8JxC@dpg-d865k977f7vs739md3ug-a.oregon-postgres.render.com/ai_crypto_advisor_ytgj"
```

**3. Launch Prisma Studio**

```bash
npx prisma studio --schema=./database/schema.prisma
```

Prisma Studio will open at **http://localhost:5555** — no install required, `npx` handles it automatically.

You will see the live production database with all tables: `User`, `OnboardingAnswer`, `AIAdvice`, `Feedback`, `SocialTrend`, and more.

### Direct connection (if you have `psql` installed)

```bash
psql "postgresql://ai_crypto_advisor_ytgj_user:NrlygkTor90Waa5Zp6U5LYvUmiJf8JxC@dpg-d865k977f7vs739md3ug-a.oregon-postgres.render.com/ai_crypto_advisor_ytgj"
```

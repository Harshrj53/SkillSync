# SkillSync – AI-Powered Interview & Resume Preparation Platform

A full-stack, production-ready web application for interview prep, resume building, and skill tracking with AI feedback.

---

## Tech Stack

| Layer     | Technology                                    |
|-----------|-----------------------------------------------|
| Frontend  | React 18 + Vite, Tailwind CSS v3, Recharts    |
| Backend   | Node.js, Express.js (Controller→Service→Repo) |
| Database  | PostgreSQL (Supabase hosted or local)         |
| Auth      | JWT + bcrypt                                  |
| AI        | OpenAI `gpt-4o-mini` (resume feedback)       |

---

## Project Structure

```
SkillSync/
├── backend/
│   ├── config/         # DB connection + init script
│   ├── controllers/    # HTTP layer (req/res)
│   ├── services/       # Business logic
│   ├── repositories/   # DB queries (raw SQL via pg)
│   ├── models/         # schema.sql
│   ├── routes/         # Express routers
│   ├── middleware/     # JWT auth + error handler
│   ├── utils/          # jwt, hash, scoring helpers
│   ├── data/           # questions.json
│   └── server.js
└── frontend/
    └── src/
        ├── api/        # Axios instance
        ├── context/    # AuthContext
        ├── components/ # Navbar, Spinner, ProtectedRoute
        └── pages/      # Dashboard, ResumeBuilder, InterviewPractice, SkillTracker
```

---

## Local Setup

### Prerequisites
- Node.js ≥ 18
- PostgreSQL (local) **or** a [Supabase](https://supabase.com) free account

---

### 1. Clone the repo

```bash
git clone https://github.com/your-username/skillsync.git
cd skillsync
```

### 2. Set up Backend

```bash
cd backend
npm install

# Copy env file and fill in values
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/skillsync
JWT_SECRET=your_long_random_secret_here
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=sk-...          # optional – leave blank to disable AI feedback
FRONTEND_URL=http://localhost:5173
```

### 3. Set up the Database

**Option A – Local PostgreSQL:**
```bash
# Create the database
psql -U postgres -c "CREATE DATABASE skillsync;"

# Apply schema
npm run db:init
```

**Option B – Supabase:**
1. Go to [supabase.com](https://supabase.com) → New Project
2. Copy the **Connection String** (Settings → Database → URI)
3. Paste it as `DATABASE_URL` in `.env`
4. Open Supabase **SQL Editor**, paste contents of `backend/models/schema.sql`, and run it

### 4. Start Backend

```bash
cd backend
npm run dev
# → API running on http://localhost:5000
```

---

### 5. Set up Frontend

```bash
cd frontend
npm install

cp .env.example .env
# .env default: VITE_API_BASE_URL=http://localhost:5000/api
```

### 6. Start Frontend

```bash
cd frontend
npm run dev
# → App running on http://localhost:5173
```

---

## API Documentation

### Auth
| Method | Endpoint         | Auth | Body                            | Response           |
|--------|-----------------|------|---------------------------------|--------------------|
| POST   | /api/auth/signup | ❌   | `{name, email, password}`       | `{user, token}`    |
| POST   | /api/auth/login  | ❌   | `{email, password}`             | `{user, token}`    |
| GET    | /api/auth/me     | ✅   | –                               | `{user}`           |

### Resume
| Method | Endpoint                  | Auth | Description            |
|--------|--------------------------|------|------------------------|
| POST   | /api/resume              | ✅   | Create resume          |
| GET    | /api/resume/:userId      | ✅   | List user's resumes    |
| PUT    | /api/resume/:id          | ✅   | Update resume          |
| DELETE | /api/resume/:id          | ✅   | Delete resume          |
| POST   | /api/resume/:id/feedback | ✅   | Get AI feedback        |

### Interview
| Method | Endpoint                       | Auth | Description          |
|--------|-------------------------------|------|----------------------|
| GET    | /api/interview/questions       | ✅   | Get all questions    |
| POST   | /api/interview/submit          | ✅   | Submit & score       |
| GET    | /api/interview/results/:userId | ✅   | Session history      |

### Skills
| Method | Endpoint             | Auth | Description       |
|--------|---------------------|------|-------------------|
| POST   | /api/skills          | ✅   | Add skill         |
| PUT    | /api/skills/:id      | ✅   | Update progress   |
| GET    | /api/skills/:userId  | ✅   | List skills       |
| DELETE | /api/skills/:id      | ✅   | Delete skill      |

---

## Deployment

### Database → Supabase (Free)
1. Create project at [supabase.com](https://supabase.com)
2. Run `backend/models/schema.sql` in SQL Editor
3. Copy the database URI

---

### Backend → Render (via Blueprint)

1. Sign in to [Render](https://render.com).
2. Click **New +** and select **Blueprint**.
3. Connect your **SkillSync** GitHub repository.
4. Render will automatically detect the `backend/render.yaml` file.
5. Provide the required Environment Variables when prompted:
   - `DATABASE_URL`: Your Supabase connection string.
   - `FRONTEND_URL`: Your Vercel app URL (you can update this later).
   - `OPENAI_API_KEY`: (Optional) Your OpenAI key for resume feedback.
6. Click **Apply**. Render will deploy your API.

---

### Frontend → Vercel (Optimized)

1. Sign in to [Vercel](https://vercel.com).
2. Click **Add New > Project**.
3. Select your **SkillSync** repository.
4. **IMPORTANT**: Set the **Root Directory** to `frontend`.
5. Add an Environment Variable:
   - `VITE_API_BASE_URL`: Your Render backend URL + `/api` (e.g., `https://skillsync-api.onrender.com/api`).
6. Click **Deploy**. Vercel will handle the routing via the included `vercel.json`.

---

### Final URLs format

```
Frontend:  https://skillsync-xyz.vercel.app
Backend:   https://skillsync-api.onrender.com
Database:  postgresql://... (Supabase)
```

---

## Environment Variables Reference

### Backend
```env
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=sk-...
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend
```env
VITE_API_BASE_URL=https://your-api.onrender.com/api
```

---

## Quick Verification (curl)

```bash
# Health check
curl http://localhost:5000/health

# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Get questions (replace TOKEN)
curl http://localhost:5000/api/interview/questions \
  -H "Authorization: Bearer TOKEN"
```

---

## Features

- ✅ JWT authentication (signup / login)
- ✅ Resume CRUD with AI feedback (OpenAI)
- ✅ 12-question mock interview with keyword scoring
- ✅ Skill tracking with progress bars (0–100%)
- ✅ Dashboard with Recharts analytics
- ✅ Fully responsive, light-mode UI
- ✅ Protected routes, global error handling
- ✅ Controller → Service → Repository architecture
- ✅ Deployable on Vercel + Render + Supabase

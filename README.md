# EduCentre — Coaching Centre Management Platform

Vite + React (JSX) + Tailwind CSS frontend with a full **Node.js + Express + MongoDB** backend.

## Quick start

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env → set MONGODB_URI (MongoDB Atlas or local MongoDB) and a strong JWT_SECRET
npm install
npm run seed    # creates demo users + sample data
npm run dev     # http://localhost:5000
```

### 2. Frontend

```bash
# from project root
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api  (already default)
npm install
npm run dev     # http://localhost:5173
```

### Demo accounts (password for all: `password123`)

| Email                 | Role    |
|-----------------------|---------|
| admin@educentre.in    | Admin   |
| teacher@educentre.in   | Teacher |
| student@example.com     | Student |

## What was implemented

- JWT authentication (bcrypt password hashing), including account registration and token restoration through the API
- Role-based access control (admin / teacher / student)
- Students CRUD fully wired to the API (list, create, edit, delete)
- API endpoints for Teachers, Courses, Batches, Attendance, Fees, Materials, Announcements, Dashboard
- Seed script with realistic coaching-centre data
- The frontend API client (`src/services/api.js`) sends the stored bearer token with authenticated requests. Login and registration require a working backend; they do not silently create demo sessions.

For local development with MongoDB running on this computer, set `MONGODB_URI=mongodb://127.0.0.1:27017/educentre` in `backend/.env`. Use a long, unique `JWT_SECRET`; demo accounts are available only after running the seed script.

## Project structure

```
educentre-vite/
├── backend/                 # Express + MongoDB API
│   ├── src/
│   │   ├── models/          # Mongoose schemas
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/      # auth, error handler
│   │   ├── config/
│   │   ├── seed.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── src/                     # React frontend (UI unchanged)
│   ├── services/api.js      # REST client
│   ├── hooks/useAuth.jsx    # real login + demo fallback
│   └── pages/Admin/StudentsPage.jsx  # fully API-driven
└── package.json
```

## Production notes

- Deploy backend to any Node host (Render, Railway, Fly.io, etc.)
- Set `FRONTEND_ORIGIN` to your Vercel domain
- Set `VITE_API_URL` to the deployed API URL and rebuild the frontend
- Use a strong `JWT_SECRET` and restrict Atlas network access

See `backend/README.md` for full API documentation.

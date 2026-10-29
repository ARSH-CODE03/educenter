# EduCentre Backend

Node.js + Express + MongoDB Atlas backend for the EduCentre coaching centre management platform.

## Setup

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and allow network access (0.0.0.0/0 for development).
3. Copy connection string.

```bash
cd backend
cp .env.example .env
# Edit .env – set MONGODB_URI and JWT_SECRET
npm install
npm run seed   # loads demo data + users
npm run dev    # starts on http://localhost:5000
```

## Demo accounts (after seed)

| Email                 | Password     | Role    |
|-----------------------|--------------|---------|
| admin@educentre.in    | password123  | admin   |
| rakesh@educentre.in   | password123  | teacher |
| aarav@example.com     | password123  | student |

## API

Base URL: `http://localhost:5000/api`

All protected routes require header: `Authorization: Bearer <token>`

Response format:

```json
{ "success": true, "data": {}, "message": "Completed" }
```

### Auth
- POST /auth/register
- POST /auth/login
- GET  /auth/me

### Resources
- GET/POST /students , PUT/DELETE /students/:id
- GET/POST /teachers
- GET/POST /courses
- GET/POST /batches
- GET/POST /attendance
- GET/POST /fees
- GET/POST /materials
- GET/POST /announcements
- GET /dashboard

## Production

Set `NODE_ENV=production`, strong `JWT_SECRET`, exact `FRONTEND_ORIGIN`, and use Atlas network restrictions + least-privilege DB user.

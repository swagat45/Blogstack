# Blogstack

Full-stack blog application with authentication, posts, comments, image upload, and profile management.

## Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Express, MongoDB, Mongoose
- Auth: JWT in HTTP-only cookies

## Local setup

1. Create `backend/.env` from `backend/.env.example`.
2. Create `frontend/.env.local` from `frontend/.env.example`.
3. Install dependencies in both apps:
   - `cd backend && npm install`
   - `cd frontend && npm install`
4. Start the backend:
   - `cd backend && npm run dev`
5. Start the frontend:
   - `cd frontend && npm run dev`

## Default local URLs

- Frontend: `http://127.0.0.1:5173`
- Backend: `http://127.0.0.1:5000`

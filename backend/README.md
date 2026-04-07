# UAAMS Backend (Node + Express + MongoDB, MVC)

This backend replaces frontend-only localStorage flows with a role-based API for:

- Auth and role sessions (`student`, `university`, `blogger`, `admin`)
- University approvals (admin)
- Student and university profiles
- Dynamic university application forms
- Applications with payment, status updates, roll numbers, and admission letters
- Announcements and blog posts

## 1) Setup

1. Copy env template:

```bash
cp .env.example .env
```

Set SMTP values in `.env` if you want credential emails sent automatically when a university creates a blogger.

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

Server runs at `http://localhost:5000` by default.

## 2) Seed Demo Data

```bash
npm run seed
```

Seed creates demo users and baseline data for frontend testing.

## 3) API Base URL

All endpoints are under:

`/api`

Health endpoint:

`GET /api/health`

## 4) High-Level Route Groups

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

- `GET /api/universities`
- `GET /api/universities/:id`
- `GET /api/universities/:id/form`
- `GET /api/universities/me/profile`
- `PUT /api/universities/me/profile`
- `GET /api/universities/me/form`
- `PUT /api/universities/me/form`
- `GET /api/universities/me/bloggers`
- `POST /api/universities/me/bloggers`
- `PATCH /api/universities/me/bloggers/:bloggerId/status`

- `GET /api/students/me/profile`
- `PUT /api/students/me/profile`
- `GET /api/students/recommendations`

- `POST /api/applications`
- `GET /api/applications/me`
- `GET /api/applications/:id`
- `PATCH /api/applications/:id/payment`
- `GET /api/applications/university/me`
- `PATCH /api/applications/:id/status`
- `PATCH /api/applications/:id/roll-number`
- `PATCH /api/applications/:id/admission-letter`

- `GET /api/announcements`
- `GET /api/announcements/university/:universityId`
- `POST /api/announcements`
- `PATCH /api/announcements/:id`
- `DELETE /api/announcements/:id`

- `GET /api/blogs`
- `GET /api/blogs/:id`
- `POST /api/blogs`
- `PATCH /api/blogs/:id`
- `DELETE /api/blogs/:id`

- `GET /api/admin/stats`
- `GET /api/admin/universities`
- `PATCH /api/admin/universities/:id/review`
- `GET /api/admin/students`
- `GET /api/admin/bloggers`
- `PATCH /api/admin/users/:id/status`

## 5) Auth

Use `Authorization: Bearer <token>` for protected routes.

## 6) Notes

- File uploads are represented by URL/string fields in this version.
- Payment flow is metadata-based (transaction reference and amount validation).
- Structure follows MVC with `models`, `controllers`, `routes`, and `middleware`.

# Backend - To-Do List Application

Express.js API server providing user authentication, tasks CRUD, and email notifications. Integrates with PostgreSQL and documents endpoints with Swagger.

## Features
- User registration, login, and account endpoints
- JWT-based authentication (Bearer token)
- Password hashing with bcrypt
- Password reset flow via email
- CRUD operations for tasks per user
- Input validation and robust error handling
- Security best practices (Helmet, CORS)
- OpenAPI docs at /docs

## Getting Started

1. Install dependencies
   - Node.js LTS recommended
   - Run:
     - npm install

2. Configure environment
   - Copy `.env.example` to `.env` and set values
   - Ensure PostgreSQL DB is reachable (from Database container)
   - Tables required:
     - users(id UUID PK, email UNIQUE, password_hash TEXT, name TEXT, reset_token TEXT NULL, reset_token_expires TIMESTAMP NULL, created_at TIMESTAMP, updated_at TIMESTAMP)
     - tasks(id UUID PK, user_id UUID FK->users(id), title TEXT, description TEXT NULL, completed BOOLEAN, due_date TIMESTAMP NULL, created_at TIMESTAMP, updated_at TIMESTAMP)

3. Run the server
   - Development: `npm run dev`
   - Production: `npm start`
   - Visit API docs at: `http://localhost:${PORT}/docs` (default port 3000)

## Environment Variables

See `.env.example` for the full list. Key values:
- PORT, HOST
- JWT_SECRET, JWT_TTL
- SITE_URL
- DATABASE_URL or POSTGRES_URL/POSTGRES_USER/POSTGRES_PASSWORD/POSTGRES_DB/POSTGRES_PORT
- SMTP_HOST/SMTP_PORT/SMTP_SECURE/SMTP_USER/SMTP_PASS or EMAIL_SERVICE
- EMAIL_FROM
- CORS_ORIGIN (comma-separated origins)
- LOG_FORMAT

## API

- Health: GET `/`
- Auth:
  - POST `/api/auth/register`
  - POST `/api/auth/login`
  - GET `/api/auth/me` (Bearer token)
  - POST `/api/auth/request-password-reset`
  - POST `/api/auth/reset-password`
- Tasks (Bearer token required):
  - GET `/api/tasks`
  - POST `/api/tasks`
  - GET `/api/tasks/:id`
  - PUT `/api/tasks/:id`
  - PATCH `/api/tasks/:id`
  - DELETE `/api/tasks/:id`

## Security

- JWT tokens are required for all `/api/tasks` endpoints and `/api/auth/me`
- Passwords are hashed with bcrypt
- Request bodies validated with express-validator
- Helmet and CORS configured; set CORS_ORIGIN in .env

## Notes
- This backend expects the database schema to exist (see Database container).
- Do not commit your `.env` file.

# Neon Setup Guide

## 1. Create a Neon project
1. Go to https://neon.tech and sign in or sign up.
2. Create a new project.
3. Create a branch or database for your app.
   - If the interface asks for `main` or `dev`, choose one and keep its connection string.

## 2. Copy your Neon connection string
1. In the Neon dashboard, find the branch/database you created.
2. Copy the full Postgres URL.
3. Make sure it includes SSL settings, for example:
   - `postgresql://user:pass@host:5432/dbname?sslmode=require&channel_binding=require`

## 3. Configure the app env
1. Open `.env` or `.env.local` in the repo root.
2. Replace the database section with:
   ```env
   DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require&channel_binding=require
   ```
3. Remove or ignore the old `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` values if they are no longer needed.

## 4. Apply the schema to Neon
1. Install dependencies if needed:
   ```bash
   npm install
   ```
2. Push the schema to Neon:
   ```bash
   npm run db:push
   ```
3. If you prefer migrations instead of push:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

## 5. Verify connectivity
1. Start the app:
   ```bash
   npm run dev
   ```
2. Open `http://localhost:3000`.
3. If the app starts and does not show DB connection errors, Neon is configured correctly.

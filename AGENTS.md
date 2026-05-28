# AGENTS.md

## Cursor Cloud specific instructions

### Project Overview

This is a Node.js/Express web application for managing a charity youth football tournament (Torneo Benéfico) for CD San Roque EFF. It uses MongoDB (Mongoose) as the database and serves a static vanilla HTML/CSS/JS frontend.

### Running the Application

1. **MongoDB must be running first.** Start it with:
   ```
   mongod --dbpath /data/db --bind_ip 127.0.0.1 --fork --logpath /tmp/mongodb-logs/mongod.log
   ```

2. **Start the dev server:**
   ```
   npm run dev
   ```
   This uses nodemon for auto-restart on file changes. The server runs on port 3000.

3. **Seed the database (optional, for fresh data):**
   ```
   npm run seed
   ```

### Environment Variables

The `.env` file (not committed) requires:
- `MONGO_URI` — MongoDB connection string (e.g., `mongodb://127.0.0.1:27017/torneo-futbol`)
- `JWT_SECRET` — Any string for JWT signing
- `ADMIN_PASSWORD` — Plaintext password for admin login
- `PORT` — Server port (defaults to 3000)

### Key Gotchas

- The server gracefully degrades without MongoDB — API routes return hardcoded defaults, but write operations won't work.
- Admin login uses plaintext password comparison against `ADMIN_PASSWORD` env var (username is always "admin").
- No ESLint, Prettier, or test framework is configured in this project.
- No automated tests exist. Validate changes by running the server and testing endpoints manually.
- The frontend fetches data from `/api/*` endpoints via browser fetch calls. Static files are served from `/public`.

### Available npm scripts

See `package.json`:
- `npm start` — production mode (`node servidor.js`)
- `npm run dev` — development mode with nodemon
- `npm run seed` — populate MongoDB with initial tournament data

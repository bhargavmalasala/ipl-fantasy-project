# Stumpr IPL Tracker

Full-stack IPL-style scoreboard and analytics app with admin match management, public leaderboards, player comparisons, and cap awards.

## Overview

This repository contains two apps:

- client: React + Vite frontend
- server: Express + Firebase Firestore backend

The app supports:

- Season-wise leaderboard
- Match history and match-level entries
- Player profile statistics
- 1v1 player comparison
- Cap awards (Orange, Red, Blue, Yellow, Black)
- Admin-protected match create/delete

## Tech Stack

Frontend:

- React 19
- Vite
- React Router
- Axios
- Tailwind CSS
- Recharts

Backend:

- Node.js + Express
- Firebase Admin SDK (Firestore)
- JWT auth
- bcrypt
- dotenv

## Repository Structure

	IPL/
	|-- client/
	|   |-- src/
	|   |   |-- api/
	|   |   |-- components/
	|   |   \-- pages/
	|   \-- package.json
	|-- server/
	|   |-- config/
	|   |-- controllers/
	|   |-- middleware/
	|   |-- routes/
	|   \-- package.json
	\-- README.md

## Requirements

- Node.js 18+
- npm
- Firebase project with Firestore enabled

## Configuration Reference

Server environment variables:

	PORT=5000
	CORS_ORIGIN=http://localhost:5173,http://localhost:3000

	JWT_SECRET=replace_with_strong_secret
	JWT_EXPIRES_IN=2h
	JWT_TRUSTED_DEVICE_EXPIRES_IN=30d

	ADMIN_EMAIL=your_admin_email
	ADMIN_PASSWORD_HASH=your_bcrypt_hash

	# Option A: pass Firebase service account JSON as a string
	FIREBASE_SERVICE_ACCOUNT_JSON={...}

Firebase credential resolution order:

1. Use FIREBASE_SERVICE_ACCOUNT_JSON when provided.
2. Otherwise use server/serviceAccountKey.json.

Important: never commit real secrets or production service account files.

Admin password hash generation example:

	node -e "import('bcrypt').then(async b => { console.log(await b.default.hash('your_password', 10)); process.exit(0); })"

## Client Environment

The client API base URL is read from VITE_API_URL. If not set, it defaults to:

	http://localhost:5000/api

Set in client/.env for local or deployment:

	VITE_API_URL=https://your-api-domain/api

## Authentication

- Admin login endpoint: POST /api/auth/login
- JWT is stored in localStorage as token
- Remember this device is supported with longer expiry

Login request body:

	{
	  "email": "admin@example.com",
	  "password": "your_password",
	  "rememberMe": true
	}

Login response:

	{
	  "token": "<jwt>",
	  "expiresIn": "30d"
	}

## API Reference

Base URL:

	/api

Public endpoints:

- GET /seasons
- GET /seasons/:year/leaderboard
- GET /seasons/:year/matches
- GET /seasons/:year/all-matches
- GET /seasons/:year/player/:name
- GET /seasons/:year/compare/:player1/:player2
- GET /seasons/:year/caps

Protected endpoints (admin JWT required):

- POST /seasons/:year/matches
- DELETE /seasons/:year/matches/:matchId

Authorization header format:

	Authorization: Bearer <token>

## Match Data Notes

- Matches are stored per season in Firestore under seasons/{year}/matches
- Player entries are stored in each match subcollection: entries
- winnerName is stored in the match document and used for win-based metrics

## Caching Strategy (Frontend)

To improve perceived performance, the frontend uses localStorage cache for:

- seasons list
- leaderboard by season
- matches by season
- caps by season

Behavior:

- TTL is 5 minutes
- Cached data is shown immediately when available
- Network request still runs and refreshes cache in background

This gives near-instant repeat loads while keeping data fresh.

## Deployment Notes

### Frontend (Vercel)

- client/vercel.json rewrites all routes to index.html for SPA routing
- Set VITE_API_URL in Vercel environment variables

### Backend

- Deploy server as a Node.js service (Render, Railway, Fly.io, VPS, etc.)
- Configure CORS_ORIGIN with frontend domain(s)
- Configure all required environment variables in hosting provider

Example CORS_ORIGIN value:

	https://your-frontend.vercel.app,http://localhost:5173

## Available Scripts

Client (client/package.json):

- npm run dev
- npm run build
- npm run preview
- npm run lint

Server (server/package.json):

- npm start

## Troubleshooting

1. CORS blocked error

- Ensure frontend origin is included in CORS_ORIGIN

2. 401/403 on protected routes

- Ensure token is present and not expired
- Re-login if needed

3. Firebase initialization errors

- Verify FIREBASE_SERVICE_ACCOUNT_JSON is valid JSON
- Or ensure server/serviceAccountKey.json exists and is valid

4. Data appears old

- Frontend cache TTL is 5 minutes
- Hard refresh or wait for automatic refresh call completion

## Security Recommendations

- Do not commit serviceAccountKey.json with real credentials
- Use strong JWT_SECRET in production
- Keep admin password only as bcrypt hash (ADMIN_PASSWORD_HASH)
- Rotate secrets periodically

## Future Improvements

- Add test coverage for controllers and routes
- Add rate limiting for auth endpoint
- Add centralized request logging and monitoring
- Add CI pipeline for lint/build checks


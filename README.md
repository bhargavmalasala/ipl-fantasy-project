# Stumpr IPL Tracker

Stumpr IPL Tracker is a production-oriented full-stack cricket analytics platform designed to mirror real league operations end to end. It supports structured match ingestion by season, automatic leaderboard generation, deep player analytics, head-to-head comparisons, and cap award computation (Orange, Red, Blue, Yellow, Black) from live season data. The system combines a React-based analytics dashboard with an Express and Firebase backend, uses token-based admin authentication for secure match management, and applies caching plus parallelized data aggregation for fast, scalable reads. Built as more than a score viewer, it models how a real sports operations product handles data integrity, role-based access, season context, and analytics delivery in a production-ready workflow.

This README is intentionally written as an engineering showcase for interview review.

## Product Summary

Stumpr is designed around two user modes:

- Public analytics mode: leaderboard, match history, player profiles, season caps, and player-vs-player comparison.
- Privileged operations mode: authenticated admin dashboard for match creation, updates, and deletion.

Core capabilities delivered:

- Dynamic, season-aware leaderboard.
- Match history with normalized entry ranking and winner highlights.
- Player profile stats (wins, totals, average, best, worst, history).
- Head-to-head comparison dataset generation.
- Award engine for Orange, Red, Blue, Yellow, and Black caps.
- Token-based admin authentication with trusted-device session support.

## Technical Stack

Frontend:

- React 19 + Vite
- React Router
- Axios
- Tailwind CSS
- Recharts

Backend:

- Node.js + Express (ES modules)
- Firebase Admin SDK + Firestore
- JWT for stateless auth
- bcrypt for credential verification

## Architecture

High-level structure:

    client (presentation + route composition + cached API consumption)
      -> axios API layer
      -> Express REST API
      -> Firestore (season/match/entry data model)

Repository layout:

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

Design choices:

- Clear separation of concerns between routing, controller logic, and middleware.
- Firestore model optimized for season scoping and incremental growth.
- Stateless backend auth to keep API horizontally scalable.

## Firestore Data Model

Collections:

- seasons/{year}
- seasons/{year}/matches/{matchId}
- seasons/{year}/matches/{matchId}/entries/{entryId}

Important match document fields:

- matchNumber
- matchName
- date
- winnerName
- winningPoints
- createdAt
- updatedAt

Why this model works well:

- Natural partitioning by season.
- Match metadata and player entries are decoupled.
- Enables efficient season-level reads and computed analytics.

## API Surface

Base path: /api

Public analytics endpoints:

- GET /seasons
- GET /seasons/:year/leaderboard
- GET /seasons/:year/matches
- GET /seasons/:year/all-matches
- GET /seasons/:year/player/:name
- GET /seasons/:year/compare/:player1/:player2
- GET /seasons/:year/caps

Protected operations endpoints:

- POST /seasons/:year/matches
- DELETE /seasons/:year/matches/:matchId

Auth endpoint:

- POST /api/auth/login

## Authentication and Session Strategy

Security model:

- Admin identity validated against environment-configured email and bcrypt password hash.
- JWT signed with server secret and required for privileged endpoints.
- Authorization handled by middleware using Bearer tokens.

Session behavior:

- Standard session expiry (default: 2h via JWT_EXPIRES_IN).
- Trusted-device expiry (default: 30d via JWT_TRUSTED_DEVICE_EXPIRES_IN).
- Frontend supports rememberMe to request long-lived tokens on known devices.
- Route guard clears invalid/expired tokens to avoid stale auth state.

## Performance Engineering

### Backend optimization

Problem solved:

- Early implementations performed sequential Firestore subcollection reads inside loops, which increased latency with match count.

Optimization implemented:

- Introduced batched parallel entry loading using Promise.all.
- Reused in-memory entries-by-match maps across controllers within a request lifecycle.

Endpoints benefiting from this optimization:

- leaderboard
- matches
- player profile
- compare players
- caps

### Frontend optimization

Caching strategy:

- LocalStorage-based cache with 5-minute TTL.
- Keys include resource type + season for safe segmentation.
- Stale-while-refresh behavior: show cached data instantly, then refresh in background.

Cached resources:

- seasons
- leaderboard by season
- matches by season
- caps by season

Result:

- Significantly improved perceived load time on repeat visits and route revisits.

## Cap Engine Logic

Award calculations are generated server-side from season data:

- Orange Cap: highest total points.
- Red Cap: highest single-match points.
- Black Cap: lowest non-zero single-match points.
- Yellow Cap: highest average points.
- Blue Cap: most wins.

Blue Cap reliability improvement:

- Wins are counted using persisted winnerName at match level.
- Prevents inconsistent rank entries from causing zero/blank Blue Cap states.

## Reliability and Defensive Programming

Implemented safeguards:

- Input validation for auth and match operations.
- Graceful null/empty checks while aggregating stats.
- Numeric normalization for points/rank data.
- Fallback logic for missing values (for example, lowest score when no non-zero values exist).
- Controlled CORS allowlist with origin normalization.

## Frontend UX Design Decisions

- Route-level loading states for data-heavy pages.
- Protected route boundaries around admin dashboard.
- Season selectors across analytics pages for context switching.
- Footer-level aggregate context (total matches, seasons, latest match).
- Visual ranking emphasis and winner highlights to improve scanability.

## Deployment and Runtime Concerns

Frontend deployment characteristics:

- SPA rewrite strategy in client/vercel.json for deep-link routing compatibility.

Backend deployment characteristics:

- Environment-driven CORS allowlist for secure cross-origin requests.
- Environment-driven Firebase credential resolution.
- Environment-driven JWT policies for session control.

## Selected Engineering Trade-offs

- Firestore subcollections for entries: cleaner logical model, at the cost of extra reads that required parallelization work.
- Stateless JWT auth: simpler horizontal scaling, with explicit token expiry/refresh responsibilities on client UX.
- LocalStorage cache: strong UX performance gains, with bounded staleness via TTL.

## What This Project Demonstrates

- Full-stack product ownership across frontend, backend, and data model.
- Practical performance tuning based on real bottlenecks.
- Security fundamentals in authentication and route protection.
- Ability to evolve implementation from feature-complete to production-minded.
- Strong handling of edge cases in analytics computation.

## Next-Level Enhancements (Roadmap)

- Automated tests for analytics aggregations and auth flows.
- Rate limiting + login hardening for brute-force resistance.
- Structured logging and request tracing for faster debugging.
- Materialized summary collections for constant-time leaderboard reads.
- CI pipeline for lint, build, and automated API checks.


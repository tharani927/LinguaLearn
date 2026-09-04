# LinguaLearn — Automated Testing Suite & Verification Guide

## 1. Testing Strategy

LinguaLearn implements a multi-tier test pyramid:
1. **Unit Tests:** Isolated testing of pure business logic functions (JWT token issuance, password validation, streak calculations, deterministic AI feedback generation).
2. **API Integration Tests:** Supertest executing real HTTP requests against live Express endpoints and the PostgreSQL database.
3. **Build Smoke Tests:** Vite static analysis compilation and Docker container health checks.

---

## 2. Test Execution Commands

```bash
# Navigate to backend directory
cd backend

# Run entire test suite
npm test

# Run tests with test coverage reporting
npm run test:coverage

# Run tests in continuous watch mode during development
npm run test:watch
```

---

## 3. Test Coverage Summary

| Test Suite | File | Tests | Status |
| :--- | :--- | :--- | :--- |
| **Auth Service Unit Tests** | `tests/unit/authService.test.js` | 4 tests | Passed |
| **Gamification Service Unit Tests** | `tests/unit/gamificationService.test.js` | 4 tests | Passed |
| **AI Pedagogical Service Unit Tests** | `tests/unit/aiService.test.js` | 4 tests | Passed |
| **Full API Integration Suite** | `tests/api/api.test.js` | 14 tests | Passed |
| **Total Test Suite** | **4 Suites** | **26 Tests** | **100% Passed** |

---

## 4. API Integration Test Matrix

- `POST /api/auth/register` (New user creation, duplicate rejection)
- `POST /api/auth/login` (Valid credentials, invalid password rejection)
- `GET /api/courses` (Course list retrieval, query parameter filtering)
- `GET /api/courses/:id` (Syllabus and lesson list)
- `GET /api/lessons/:id` (Lesson content and vocabulary banks)
- `GET /api/assessments/:id` (Question fetching)
- `POST /api/assessments/:id/submit` (Grading and AI feedback generation)
- `GET /api/adaptive/mistakes` (Mistake vault retrieval)
- `GET /api/adaptive/skills` (5-dimension skill profile scores)
- `GET /api/gamification/badges` (Milestone badges)
- `GET /api/admin/dashboard` (Admin KPI summary)
- `GET /api/analytics/difficult-topics` (Error rate analysis)
- `GET /api/analytics/at-risk` (At-risk student flags)
- `GET /api/health` (Service telemetry)

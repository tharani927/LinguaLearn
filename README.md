# LinguaLearn — An Intelligent Language Learning Platform

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com)
[![Tests](https://img.shields.io/badge/tests-26%2F26%20passing-success.svg)](docs/testing.md)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-ready-2496ED.svg)](docker-compose.yml)
[![Node.js](https://img.shields.io/badge/node.js-v20%2B-339933.svg)](backend/package.json)
[![React](https://img.shields.io/badge/react-v18.3-61DAFB.svg)](frontend/package.json)
[![PostgreSQL](https://img.shields.io/badge/postgresql-16-4169E1.svg)](database/schema.sql)

> **Software Engineering Capstone Project**  
> **Title:** Agile DevOps Development of LinguaLearn: An Intelligent Language Learning Platform  
> **Team Role:** Lead Software Architect, Full-Stack Developer, DevOps Engineer, QA Engineer & UI/UX Designer  

---

## 1. Executive Summary & Core Platform Identity

**LinguaLearn** is a full-stack, production-ready 3-tier intelligent language learning platform.

Unlike generic course-management websites that merely serve static video links or text notes, LinguaLearn functions as a **cognitive linguistic tutor**:
1. **Analyses Learner Performance:** Records granular user choices across vocabulary, grammar, reading, and sentence formation.
2. **Mistake Vault & Spaced Remediation:** Captures every incorrect question into a persistent personal vault with error frequency counters. Learners engage in targeted "Practice My Mistakes" interactive drills until each concept is truly mastered.
3. **AI-Powered Pedagogical Diagnostics:** Evaluates assessment submissions to generate structured breakdowns of specific strengths, weaknesses, and actionable study tips.
4. **Dual-Engine AI Reliability:** Incorporates a deterministic fallback rule engine that produces realistic, intelligent pedagogical feedback even when offline or without external API keys.
5. **Academic Administrator Control Tower:** Features telemetry and analytics including automated topic error rate heatmaps (*e.g., "68% of learners struggling with Subject-Verb Agreement"*) and deterministic at-risk learner alert flags.
6. **Agile DevOps Engineering:** Fully containerized with multi-stage Docker builds, Docker Compose orchestration, and an end-to-end Declarative Jenkins CI/CD pipeline.

---

## 2. Demonstration Accounts

For a smooth capstone presentation, the platform comes pre-seeded with two fully functional demo roles. The login screen also features **1-Click Demo Fill** buttons for immediate sign-in.

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Learner (Student)** | `learner@lingualearn.com` | `LearnerPass123!` | Dashboard, Courses, Lessons, Quiz Runner, AI Feedback, Mistake Vault, Practice Drills, Skill Radar, Badges, Certificates |
| **Administrator** | `admin@lingualearn.com` | `AdminPass123!` | Admin Control Tower, User Directory, Course Management, Question Bank, Topic Error Heatmaps, At-Risk Alerts, CSV Exports, System Telemetry |

---

## 3. System Architecture & Tech Stack

```
                                +-------------------------------------------+
                                |               USER BROWSER                |
                                |     (React 18 SPA, Tailwind, Recharts)    |
                                +---------------------+---------------------+
                                                      |
                                                      | HTTP / Port 80
                                                      v
                                +-------------------------------------------+
                                |            NGINX REVERSE PROXY            |
                                |     Static Assets & /api/* Pass-Through   |
                                +---------------------+---------------------+
                                                      |
                                                      | Proxy / Port 5000
                                                      v
                                +-------------------------------------------+
                                |           EXPRESS.JS REST API             |
                                |  (JWT Auth, Rate Limiter, Helmet, CORS)   |
                                +----------+---------------------+----------+
                                           |                     |
                        Internal Telemetry |                     | SQL Queries / Pool
                                           v                     v
                        +----------------------+    +-----------------------+
                        | PEDAGOGICAL AI ENGINE|    |     POSTGRESQL 16     |
                        | (Dual-Engine System) |    | (25 Normalized Tables)|
                        +----------------------+    +-----------------------+
```

### Technology Highlights
- **Frontend Tier:** React 18.3, Vite, React Router v6, Tailwind CSS, Recharts (Radar/Bar charts), Lucide Icons, Canvas Confetti.
- **Backend Tier:** Node.js v20+, Express.js, JWT, bcrypt (10 salt rounds), Helmet, Express Rate Limiting, Node-PG connection pool.
- **Database Tier:** PostgreSQL 16 Alpine with 25 normalized tables, foreign keys with cascade policies, and specialized indexing.
- **DevOps & CI/CD:** Docker (multi-stage Alpine builds), Docker Compose, Declarative Jenkinsfile, Jest, Supertest.

---

## 4. Repository Structure

```
LinguaLearn/
├── backend/                  # Express REST API Server
│   ├── src/
│   │   ├── config/           # Database pool, env parser, system constants
│   │   ├── controllers/      # 12 HTTP controllers (auth, course, adaptive, admin, etc.)
│   │   ├── db/               # PostgreSQL schema.sql, seeds.sql, migrate.js, seed.js
│   │   ├── middleware/       # JWT auth verification, RBAC role guard, rate limiter
│   │   ├── routes/           # Express modular route definitions
│   │   ├── services/         # Core business logic & Dual-Engine AI services
│   │   ├── utils/            # JWT helpers, standard response formatters, logger
│   │   ├── app.js            # Express application setup
│   │   └── server.js         # HTTP server entry point
│   ├── tests/
│   │   ├── unit/             # Jest unit tests (auth, gamification, AI)
│   │   └── api/              # Supertest integration tests (26 passing tests)
│   ├── Dockerfile            # Multi-stage production container build
│   └── package.json
├── frontend/                 # React 18 Single Page Application
│   ├── src/
│   │   ├── components/       # Navbar, Sidebar, ProtectedRoute, StatCard, SkillChart, etc.
│   │   ├── contexts/         # AuthContext, ThemeContext (5 palettes), NotificationContext
│   │   ├── pages/
│   │   │   ├── public/       # LandingPage, LoginPage, RegisterPage
│   │   │   ├── learner/      # Dashboard, Courses, Lesson, Quiz, Result, MistakeVault, etc.
│   │   │   └── admin/        # AdminDashboard, Users, Courses, Questions, Analytics, Reports, Health
│   │   ├── services/         # Axios/Fetch API client wrapper
│   │   ├── styles/           # Tailwind base & 5 color themes (Ocean, Nature, Bloom, Midnight, Sunrise)
│   │   ├── App.jsx           # Master route switch with RBAC guards
│   │   └── main.jsx          # React DOM root mounting
│   ├── Dockerfile            # Multi-stage Vite build + Nginx Alpine
│   ├── nginx.conf            # Nginx SPA router and API reverse proxy
│   └── package.json
├── database/                 # Canonical SQL DDL & DML scripts
│   ├── schema.sql            # 25 normalized relational tables
│   └── seeds.sql             # Demo accounts, curricula, questions, and achievements
├── docs/                     # Comprehensive Capstone Documentation
│   ├── agile/JIRA_PLAN.md    # 5 Epics, User Stories, Gherkin Criteria, 3-Sprint Plan
│   ├── architecture.md       # 3-tier architectural specification & sequence diagrams
│   ├── database.md           # Entity-Relationship dictionary & index strategy
│   ├── api.md                # Complete REST API reference
│   ├── testing.md            # Automated testing guide & coverage report
│   ├── deployment.md         # Production deployment & environment variables
│   └── jenkins_pipeline.md   # Jenkins CI/CD automation guide
├── docker-compose.yml        # Multi-container orchestration specification
├── Jenkinsfile               # Declarative 8-stage Agile CI/CD pipeline
└── README.md                 # Master project documentation
```

---

## 5. Quickstart Guide (Local Development)

### Prerequisites
- Node.js v20.x or higher
- PostgreSQL 16 running on port 5432
- npm v10.x or higher

### Step 1: Database Setup
```bash
# In backend directory, copy environment template
cd backend
cp .env.example .env

# Run database migrations and seed default curriculum & users
npm run db:migrate
npm run db:seed
```

### Step 2: Launch Backend API
```bash
cd backend
npm install
npm run dev
# Backend starts on http://localhost:5000
```

### Step 3: Launch Frontend Application
```bash
cd frontend
npm install
npm run dev
# Frontend starts on http://localhost:5173
```

---

## 6. Docker Deployment (One-Command Launch)

To deploy the entire production stack (PostgreSQL + Express Backend + React/Nginx Frontend):

```bash
# From the root directory:
docker compose up -d --build

# Verify container status:
docker compose ps
```

Access the live platform in your browser at **`http://localhost`**.

---

## 7. Automated Test Suite Execution

LinguaLearn features an automated testing suite comprising unit tests and integration tests:

```bash
cd backend
npm test
```

**Test Execution Results:**
```
PASS tests/unit/authService.test.js
PASS tests/unit/gamificationService.test.js
PASS tests/unit/aiService.test.js
PASS tests/api/api.test.js

Test Suites: 4 passed, 4 total
Tests:       26 passed, 26 total
Snapshots:   0 total
Time:        1.85 s
Ran all test suites.
```

---

## 8. Jenkins CI/CD Pipeline Stages

The included `Jenkinsfile` automates the complete continuous integration and delivery lifecycle:
1. **Environment & SCM Checkout:** Verifies commit hash and environment tool versions.
2. **Install Dependencies (Parallel):** Concurrently executes `npm ci` for backend and frontend.
3. **Automated Backend Tests:** Runs Jest unit tests and Supertest integration tests, publishing JUnit XML reports.
4. **Frontend Build:** Bundles the React application via Vite and archives production artifacts.
5. **Docker Multi-Stage Build:** Compiles container images tagged with build number and `latest`.
6. **Smoke Test & Health Check:** Spins up the container stack and verifies HTTP 200 OK from `/api/health`.
7. **Blue/Green Deployment:** Applies rolling deployment to staging or production with automated rollback triggers.

---

## 9. Academic Capstone Verification Checklist

- [x] **Full-Stack 3-Tier Architecture:** Complete presentation, business logic, and persistence tiers.
- [x] **Real Relational Database:** 25 normalized PostgreSQL tables with foreign keys and cascade rules.
- [x] **Secure Authentication & RBAC:** Password hashing with bcrypt, signed JWTs, and role boundaries.
- [x] **Mistake Vault & Remediation:** Automated capture of missed questions with interactive remediation drills.
- [x] **Dual-Engine Pedagogical AI:** AI diagnostic assessment analysis with robust deterministic fallback.
- [x] **Academic Analytics & Heatmaps:** Automated topic error rates and deterministic at-risk student learner detection.
- [x] **Automated Testing Suite:** 26/26 unit and API integration tests passing.
- [x] **Containerization & CI/CD:** Production Dockerfiles, Docker Compose, and Declarative Jenkinsfile.
- [x] **Agile Project Management:** Complete JIRA plan with 5 Epics, user stories in Gherkin format, and 3-sprint plan.

---

## 10. License
This Software Engineering Capstone project is released under the **MIT License**.

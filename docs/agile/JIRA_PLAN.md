# LinguaLearn — Agile Scrum Project Management & JIRA Plan

**Project Title:** Agile DevOps Development of LinguaLearn: An Intelligent Language Learning Platform  
**Methodology:** Agile Scrum  
**Sprint Cadence:** 2-Week Sprints (Total 3 Sprints = 6 Weeks)  
**Team Composition:** Product Owner, Scrum Master, Full-Stack Engineers, DevOps Engineer, QA Engineer, UI/UX Designer  

---

## 1. Agile Framework & Governance

### 1.1 Story Estimation Standard (Fibonacci Scale)
- **1 pt:** Minor cosmetic adjustment, copy update, or simple configuration flag.
- **2 pts:** Simple component addition or isolated CRUD endpoint with unit test.
- **3 pts:** Feature requiring backend route, database query, and frontend form interaction.
- **5 pts:** Complex multi-step flow (e.g., interactive quiz session, JWT authentication flow).
- **8 pts:** Complex algorithm or cross-cutting feature (e.g., adaptive mistake remediation, AI pedagogical analysis).
- **13 pts:** Architectural epic spanning database migrations, micro-services, or complete CI/CD automation pipeline.

### 1.2 Definition of Done (DoD)
A story is only marked as **DONE** when:
1. All functional Acceptance Criteria (Given/When/Then) pass verification.
2. Code follows clean architecture patterns with descriptive variable and function naming.
3. Unit tests achieve at least 80% statement coverage.
4. API integration tests verify edge cases, bad inputs, and authorization boundaries.
5. Code passes automated static analysis and lint checks without warnings.
6. Changes are reviewed and merged into the main branch via Pull Request.
7. Feature builds cleanly in Docker container and passes automated Jenkins smoke tests.

---

## 2. Epics Hierarchy

| Epic Key | Epic Title | Summary Description | Total Points |
| :--- | :--- | :--- | :--- |
| **EPIC-1** | User Authentication & Personalization | Secure JWT auth, RBAC, user profiles, theme customization, and goals | 18 pts |
| **EPIC-2** | Curriculum & Assessment Engine | Multi-language course catalog, lesson reader, vocabulary banks, and quizzes | 26 pts |
| **EPIC-3** | Adaptive Learning & Pedagogical AI | Mistake Vault, spaced remediation drills, AI diagnostics, and gamification | 34 pts |
| **EPIC-4** | Administrator Analytics & Reporting | System KPIs, topic error rate heatmaps, at-risk learner alerts, and CSV exports | 23 pts |
| **EPIC-5** | DevOps, Testing & CI/CD Pipeline | Docker multi-stage containers, Jenkinsfile automation, and automated test suites | 28 pts |

---

## 3. User Stories & Acceptance Criteria

### EPIC-1: User Authentication & Personalization

#### LL-101: Learner & Admin Registration and JWT Authentication
- **Role:** As a prospective learner or platform administrator
- **Story Statement:** I want to create an account and log in securely with JWT authentication, so that my learning progress and administrative permissions are safely guarded.
- **Priority:** P0 (Blocker) | **Story Points:** 5
- **Acceptance Criteria (Gherkin):**
  - **Scenario 1: Successful Registration**
    - *Given* I submit a unique email, full name, target language, and a password containing at least 6 characters.
    - *When* the backend validates the payload.
    - *Then* my password is salted and hashed using bcrypt (10 rounds), a user record is inserted, and a signed JWT bearer token is returned.
  - **Scenario 2: Duplicate Email Rejection**
    - *Given* an account already exists with `learner@lingualearn.com`.
    - *When* a new registration request is sent with the same email.
    - *Then* the server returns a `409 Conflict` status code with a descriptive error message.

#### LL-102: User Profile & Visual Theme Customization
- **Role:** As an active language learner
- **Story Statement:** I want to personalize my study preferences, target language, daily goal, and select from 5 color themes, so that my learning experience feels tailored and engaging.
- **Priority:** P1 (High) | **Story Points:** 3
- **Acceptance Criteria:**
  - *Given* an authenticated user on the `/profile` page.
  - *When* the user switches theme to "Ocean", "Nature", "Bloom", "Midnight", or "Sunrise".
  - *Then* the DOM attribute `data-theme` updates immediately, applying CSS variables without page reload.

---

### EPIC-2: Curriculum & Assessment Engine

#### LL-201: Multi-Language Course Catalog & Syllabus Viewer
- **Role:** As an enrolled language learner
- **Story Statement:** I want to browse courses filtered by language (Spanish, French, German, Japanese) and proficiency level, so that I can find courses appropriate for my skill.
- **Priority:** P0 | **Story Points:** 5
- **Acceptance Criteria:**
  - *Given* a visitor or logged-in learner accessing `/courses`.
  - *When* filtering by language `Spanish` and level `Beginner`.
  - *Then* only courses matching both criteria are displayed with lesson counts and enrollment status.

#### LL-202: Interactive Lesson Reader with Vocabulary Pronunciation
- **Role:** As an enrolled learner
- **Story Statement:** I want to study structured lesson notes, grammar callouts, and vocabulary cards with phonetics, so that I understand rules before taking tests.
- **Priority:** P1 | **Story Points:** 5
- **Acceptance Criteria:**
  - *Given* a learner viewing a lesson on `/lessons/:id`.
  - *When* the learner clicks "Mark Completed".
  - *Then* the lesson progress status is updated to `completed`, 20 XP points are credited to the points ledger, and celebratory confetti triggers.

#### LL-203: Timed Multi-Format Assessment Quiz
- **Role:** As a learner testing retention
- **Story Statement:** I want to complete timed assessments containing multiple-choice, true/false, and fill-in-the-blank questions, so that I can validate my knowledge.
- **Priority:** P0 | **Story Points:** 8
- **Acceptance Criteria:**
  - *Given* an active assessment session with a 10-minute timer.
  - *When* the user answers questions and submits before the countdown ends.
  - *Then* each answer is graded against the database, total score is calculated, and result record is persisted.

---

### EPIC-3: Adaptive Learning & Pedagogical AI

#### LL-301: AI-Powered Pedagogical Diagnostic Feedback
- **Role:** As a learner who has completed a quiz
- **Story Statement:** I want an AI-generated assessment analysis detailing my strengths, weaknesses, and targeted advice, so that I know exactly how to improve.
- **Priority:** P0 | **Story Points:** 8
- **Acceptance Criteria:**
  - *Given* an assessment submission resulting in an 80% score with missed grammar questions.
  - *When* the grading engine invokes `aiService.generateAssessmentFeedback`.
  - *Then* structured AI feedback is produced detailing strengths, weaknesses with accuracy metrics, and pedagogical recommendations, falling back deterministically if no external LLM key is configured.

#### LL-302: Automated Mistake Vault & Spaced Remediation Drill
- **Role:** As a learner who made mistakes during an assessment
- **Story Statement:** I want all incorrectly answered questions automatically archived into my Mistake Vault for targeted re-practice, so that I master challenging concepts.
- **Priority:** P0 | **Story Points:** 8
- **Acceptance Criteria:**
  - *Given* missed questions from an assessment attempt.
  - *When* results are saved.
  - *Then* records in `mistake_vault` are inserted/updated with incremented error counts.
  - *When* the learner passes the question during a practice drill (`/mistakes/practice`).
  - *Then* the mistake is marked `mastered = TRUE` and bonus XP is awarded.

#### LL-303: Daily Missions & Gamified Milestone Badges
- **Role:** As a motivated language learner
- **Story Statement:** I want daily 3-item checklists and unlockable milestone badges, so that I stay committed and maintain my daily learning streak.
- **Priority:** P1 | **Story Points:** 5
- **Acceptance Criteria:**
  - *Given* a learner completing 1 lesson, 1 vocabulary drill, and 1 assessment in a calendar day.
  - *When* all three mission items register as completed.
  - *Then* the daily mission status flips to complete and a +50 XP bonus is credited.

---

### EPIC-4: Administrator Analytics & Reporting

#### LL-401: Intelligent Topic Difficulty Error Heatmap
- **Role:** As an academic administrator
- **Story Statement:** I want to see which specific grammar topics students struggle with most, so that curriculum designers can improve lesson materials.
- **Priority:** P1 | **Story Points:** 5
- **Acceptance Criteria:**
  - *Given* historical question error logs across all student assessment attempts.
  - *When* visiting `/admin/analytics`.
  - *Then* the platform displays the highest error rate topic (e.g., "Subject-Verb Agreement — 68% Struggling") with statistical methodology.

#### LL-402: Deterministic At-Risk Learner Alert System
- **Role:** As an academic administrator
- **Story Statement:** I want an automated list of learners at risk due to either inactivity (&gt;7 days) or low average scores (&lt;50%), so that mentors can intervene proactively.
- **Priority:** P1 | **Story Points:** 5
- **Acceptance Criteria:**
  - *Given* a cohort of registered students.
  - *When* querying the at-risk API endpoint.
  - *Then* learners matching the risk rules are returned with severity tags (`HIGH` / `MEDIUM`) and days inactive.

#### LL-403: Relational CSV Report Export Engine
- **Role:** As a compliance officer or administrator
- **Story Statement:** I want to export learner progress, assessment results, and course completion rates as CSV files, so that I can perform external audit reviews.
- **Priority:** P2 | **Story Points:** 3
- **Acceptance Criteria:**
  - *Given* an administrator on `/admin/reports`.
  - *When* clicking "Export Progress CSV".
  - *Then* the browser receives a streaming download of formatted CSV records with standard headers.

---

### EPIC-5: DevOps, Testing & CI/CD Pipeline

#### LL-501: Multi-Stage Docker Containerization
- **Role:** As a DevOps engineer
- **Story Statement:** I want multi-stage Docker builds for the frontend, backend, and database with Docker Compose orchestration, so that the entire stack deploys deterministically anywhere.
- **Priority:** P0 | **Story Points:** 8
- **Acceptance Criteria:**
  - *Given* `docker-compose.yml`.
  - *When* running `docker compose up --build`.
  - *Then* all three containers start, pass health checks, and communicate over an isolated bridge network.

#### LL-502: Automated Jenkins CI/CD Pipeline
- **Role:** As a DevOps engineer
- **Story Statement:** I want an end-to-end Jenkinsfile defining build, test, Docker image compilation, and health check smoke stages, so that code changes are verified before release.
- **Priority:** P0 | **Story Points:** 13
- **Acceptance Criteria:**
  - *Given* a Git push to the repository.
  - *When* the Jenkins pipeline triggers.
  - *Then* all stages (Checkout, Dependencies, Tests, Build, Docker Build, Smoke Test) execute sequentially, with automated rollback on failure.

---

## 4. 3-Sprint Execution Plan

### Sprint 1: Foundation, Schema, Auth & Course Curriculum
- **Sprint Goal:** Establish 3-tier architecture, normalized PostgreSQL schema, JWT authentication, and course catalog.
- **Committed Stories:** LL-101, LL-102, LL-201, LL-202 (Total: 18 Story Points).
- **Deliverables:** Working backend authentication API, database migration/seed scripts, React SPA router, Course and Lesson pages.

### Sprint 2: Assessment Engine, AI Diagnostics & Mistake Vault
- **Sprint Goal:** Deliver interactive testing, automated grading, AI pedagogical feedback, and mistake remediation loop.
- **Committed Stories:** LL-203, LL-301, LL-302, LL-303 (Total: 26 Story Points).
- **Deliverables:** Quiz runner, AI diagnostic generator, Mistake Vault drill interface, and gamification points ledger.

### Sprint 3: Admin Analytics, CI/CD Automation & Capstone Delivery
- **Sprint Goal:** Implement administrative control tower, error heatmaps, Docker orchestration, and Jenkins CI/CD.
- **Committed Stories:** LL-401, LL-402, LL-403, LL-501, LL-502 (Total: 34 Story Points).
- **Deliverables:** Admin analytics dashboard, CSV export engine, Docker Compose stack, Jenkinsfile, and final Capstone package.

---

## 5. Sprint Retrospective & Continuous Improvement

### What Went Well
- Clean separation between business logic services, data controllers, and Express routes.
- Dual-engine AI feedback architecture guarantees that local demonstrations never fail even if external API limits are reached.
- Supertest integration testing caught database foreign key and parameter type edge cases early in the sprint cycle.

### Opportunities for Improvement
- Continue expanding automated E2E browser testing using Playwright in future sprints.
- Add real-time WebSocket notifications for instant streak reminders.

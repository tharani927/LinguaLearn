# LinguaLearn — Technical Architecture & System Design

## 1. High-Level System Architecture

LinguaLearn is architected as an intelligent, production-grade 3-tier web application built upon separation of concerns, defensive programming, and stateless REST principles.

```mermaid
graph TD
    Client["Client Browser (React 18 + Vite + Tailwind CSS)"]
    Nginx["Nginx Reverse Proxy (Port 80)"]
    API["Express.js REST API Backend (Port 5000)"]
    AI["Pedagogical AI Engine (OpenAI / Deterministic Rule Engine)"]
    DB[("PostgreSQL 16 Relational Database (Port 5432)")]

    Client -->|HTTP / SPA Navigation| Nginx
    Nginx -->|Proxy /api/*| API
    API -->|JWT Authentication & RBAC| API
    API -->|Async Node-PG Pool| DB
    API -->|Pedagogical Analysis| AI
```

---

## 2. Architectural Layers

### Tier 1: Presentation Layer (Frontend)
- **Framework:** React 18 with Vite for lightning-fast HMR and optimized tree-shaken builds.
- **Routing:** React Router v6 with declarative `ProtectedRoute` boundaries enforcing Role-Based Access Control (`learner` vs `admin`).
- **Styling & Theming:** Tailwind CSS combined with a custom 5-palette CSS variable theme engine (`ocean`, `nature`, `bloom`, `midnight`, `sunrise`) supporting Light, Dark, and System appearance modes.
- **Data Visualization:** Recharts rendering dynamic 5-dimension linguistic radar charts and error distribution bar charts.
- **State Management:** React Context API providing decoupled global providers for Authentication, Theme, and Real-Time Toast Notifications.

### Tier 2: Business Logic & Application Layer (Backend)
- **Runtime:** Node.js v20+ with Express.js REST API framework.
- **Security Middleware:** Helmet for security headers, CORS origin whitelisting, Express Rate Limiter (100 req/15 min), and custom JWT bearer verification middleware.
- **Service Layer Pattern:** Clean segregation between HTTP Controllers (request parsing & HTTP status handling) and Business Logic Services (business rules, calculations, and database transactions).
- **Dual-Engine AI Subsystem:** Dynamic orchestrator that interfaces with external LLM APIs when keys are present, seamlessly failing over to a deterministic pedagogical rule engine during offline or development runs.

### Tier 3: Persistence Layer (Database)
- **Engine:** PostgreSQL 16 Alpine.
- **Connection Management:** `node-postgres` (`pg`) connection pooling with parameterized queries preventing SQL injection vulnerabilities.
- **Data Integrity:** Strict foreign key constraints with `ON DELETE CASCADE`, composite uniqueness indices, and timestamp triggers.

---

## 3. Core Component Workflows

### 3.1 Adaptive Mistake Remediation Flow
```mermaid
sequenceDiagram
    autonumber
    actor Learner
    participant UI as React Frontend
    participant API as Express API
    participant AI as AI Engine
    participant DB as PostgreSQL

    Learner->>UI: Submits Assessment Answers
    UI->>API: POST /api/assessments/:id/submit
    API->>DB: Grade answers against question bank
    API->>AI: Generate Diagnostic Feedback (Strengths/Weaknesses)
    API->>DB: Insert into assessment_results & mistake_vault
    API-->>UI: Return Score & AI Feedback Report
    Learner->>UI: Clicks "Practice My Mistakes"
    UI->>API: GET /api/adaptive/mistakes?mastered=false
    API-->>UI: Returns unmastered questions
    Learner->>UI: Submits corrected answer
    UI->>API: POST /api/adaptive/mistakes/:id/practice
    API->>DB: Update mastered = TRUE, Award +15 XP
    API-->>UI: Confirmation + Confetti Animation
```

### 3.2 Role-Based Access Control (RBAC)
- **Learners:** Granted access to course catalogs, lesson viewers, quiz runners, mistake vault, personal progress profiler, and AI chatbot tutor.
- **Administrators:** Granted access to system KPIs, user management, course CRUD, question bank editor, at-risk learner reports, and infrastructure health telemetry.

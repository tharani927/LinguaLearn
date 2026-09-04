# LinguaLearn — REST API Reference Documentation

**Base URL:** `http://localhost:5000/api`  
**Authentication:** Bearer Token (`Authorization: Bearer <JWT>`)  
**Format:** `application/json`

---

## 1. Authentication Endpoints (`/api/auth`)

### Register Account
- **Endpoint:** `POST /api/auth/register`
- **Request Body:**
  ```json
  {
    "full_name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123!",
    "target_language": "Spanish",
    "proficiency_level": "Beginner"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": { "id": 3, "full_name": "Jane Doe", "email": "jane@example.com", "role": "learner" },
      "token": "eyJhbGciOiJIUzI1NiIsIn..."
    }
  }
  ```

### Login
- **Endpoint:** `POST /api/auth/login`
- **Request Body:** `{ "email": "learner@lingualearn.com", "password": "LearnerPass123!" }`
- **Response (200 OK):** Returns authenticated user profile and JWT token.

---

## 2. Curriculum & Lessons Endpoints (`/api/courses`, `/api/lessons`)

### Get Courses Catalog
- **Endpoint:** `GET /api/courses?language=Spanish&level=Beginner`
- **Response (200 OK):** Array of course objects with lesson counts and student enrollment status.

### Get Lesson Content & Vocabulary
- **Endpoint:** `GET /api/lessons/:id`
- **Response (200 OK):** Full lesson content, grammar notes, and associated vocabulary list.

### Complete Lesson
- **Endpoint:** `POST /api/lessons/:id/complete`
- **Response (200 OK):** Updates progress status to `completed` and awards +20 XP.

---

## 3. Assessment & Adaptive Learning Endpoints (`/api/assessments`, `/api/adaptive`)

### Submit Assessment
- **Endpoint:** `POST /api/assessments/:id/submit`
- **Request Body:**
  ```json
  {
    "answers": [
      { "question_id": 1, "user_answer": "está" },
      { "question_id": 2, "user_answer": "gracias" }
    ],
    "time_spent_seconds": 180
  }
  ```
- **Response (200 OK):** Score, pass status, and AI diagnostic feedback.

### Mistake Vault & Targeted Remediation
- **Endpoint:** `GET /api/adaptive/mistakes?mastered=false`
- **Endpoint:** `POST /api/adaptive/mistakes/:id/practice`
- **Request Body:** `{ "user_answer": "está" }`
- **Response (200 OK):** If correct, updates `mastered = TRUE` and awards +15 XP.

---

## 4. Administration & Analytics Endpoints (`/api/admin`, `/api/analytics`, `/api/reports`)

### Highest Error Rate Topic
- **Endpoint:** `GET /api/analytics/difficult-topics`
- **Response (200 OK):** Returns the highest error rate grammar concept with struggle percentage.

### At-Risk Learners
- **Endpoint:** `GET /api/analytics/at-risk`
- **Response (200 OK):** List of learners inactive for &gt;7 days or with average test scores &lt;50%.

### CSV Reports Export
- **Endpoint:** `GET /api/reports/progress?format=csv`
- **Response (200 OK):** Streamed CSV file attachment with standard headers.

---

## 5. Health & Infrastructure Telemetry (`/api/health`)

- **Endpoint:** `GET /api/health`
- **Response (200 OK):**
  ```json
  {
    "status": "healthy",
    "uptime": 142.3,
    "timestamp": "2026-09-03T20:25:00.000Z",
    "services": {
      "api": { "status": "operational", "latencyMs": 4 },
      "database": { "status": "connected" },
      "aiEngine": { "status": "operational", "mode": "deterministic_fallback" }
    }
  }
  ```

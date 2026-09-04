# LinguaLearn — Database Schema & Data Dictionary

## 1. Relational Schema Overview

The database is built on PostgreSQL 16 and comprises **25 normalized tables** organized into 6 functional domains:
1. **Identity & Security:** `roles`, `users`, `user_roles`, `user_profiles`, `user_tokens`
2. **Curriculum & Content:** `languages`, `courses`, `enrollments`, `lessons`, `lesson_progress`, `vocabulary`
3. **Assessment Engine:** `questions`, `assessments`, `assessment_questions`, `assessment_results`, `user_answers`
4. **Adaptive Intelligence & AI:** `skill_profiles`, `mistake_vault`, `ai_feedback`, `recommendations`
5. **Gamification & Accreditation:** `learning_streaks`, `daily_missions`, `achievements`, `user_achievements`, `points_ledger`, `certificates`
6. **Audit & Telemetry:** `activity_logs`

---

## 2. Table Data Dictionary

### Core Tables Summary

| Table Name | Primary Key | Description |
| :--- | :--- | :--- |
| `users` | `id` (SERIAL) | Master user account credentials, hashed password, and activation status |
| `user_profiles` | `user_id` (FK) | Learner profile data, target language, daily study goal, bio |
| `courses` | `id` (SERIAL) | Multi-language course catalog with difficulty levels and flag metadata |
| `lessons` | `id` (SERIAL) | Individual structured lessons with markdown content and grammar notes |
| `vocabulary` | `id` (SERIAL) | Vocabulary terms, phonetic pronunciations, and example sentences |
| `questions` | `id` (SERIAL) | Universal item bank with skill categories, prompts, and pedagogical notes |
| `assessments` | `id` (SERIAL) | Timed evaluations associated with courses and lessons |
| `assessment_results` | `id` (SERIAL) | Historical test attempts, percentage scores, and pass/fail status |
| `user_answers` | `id` (SERIAL) | Granular learner responses mapped to specific questions |
| `mistake_vault` | `id` (SERIAL) | Persistent mistake inventory with error counts and mastery status |
| `ai_feedback` | `id` (SERIAL) | AI pedagogical evaluation (strengths, weaknesses, study tips) |
| `skill_profiles` | `id` (SERIAL) | 5-dimension linguistic competency metrics (Grammar, Vocab, etc.) |
| `certificates` | `id` (SERIAL) | Cryptographically verifiable course completion accreditation |
| `activity_logs` | `id` (SERIAL) | System audit trail tracking all user and administrator actions |

---

## 3. Database Indexes & Performance Optimization

```sql
-- Fast user authentication lookup
CREATE INDEX idx_users_email ON users(email);

-- Rapid course filtering by language and level
CREATE INDEX idx_courses_language_level ON courses(language_id, level);

-- Fast lookup of unmastered mistakes for adaptive remediation
CREATE INDEX idx_mistake_vault_user_mastered ON mistake_vault(user_id, mastered);

-- Rapid skill retrieval for radar charts
CREATE INDEX idx_skill_profiles_user ON skill_profiles(user_id);

-- Assessment history timeline ordering
CREATE INDEX idx_assessment_results_user_time ON assessment_results(user_id, completed_at DESC);
```

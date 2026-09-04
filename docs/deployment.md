# LinguaLearn — Production Deployment & Docker Operations Guide

## 1. Prerequisites
- Docker Engine 24.0+ and Docker Compose v2.20+
- Port 80 (HTTP) and Port 5432 (PostgreSQL) available

---

## 2. Quickstart with Docker Compose

To launch the complete 3-tier production stack:

```bash
# Clone repository and navigate to root directory
cd LinguaLearn

# Build and start all three containers in background mode
docker compose up -d --build

# Inspect container status
docker compose ps
```

Once running, access:
- **Frontend Web Application:** `http://localhost`
- **Backend REST API:** `http://localhost:5000/api`
- **Health Telemetry:** `http://localhost:5000/api/health`

---

## 3. Container Services Architecture

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: lingualearn-db
    ports: ["5432:5432"]
    volumes: [postgres_data:/var/lib/postgresql/data]
    healthcheck: pg_isready

  backend:
    build: ./backend
    container_name: lingualearn-backend
    ports: ["5000:5000"]
    depends_on: postgres (healthy)
    healthcheck: wget http://localhost:5000/api/health

  frontend:
    build: ./frontend
    container_name: lingualearn-frontend
    ports: ["80:80"]
    depends_on: backend (healthy)
    healthcheck: wget http://localhost/
```

---

## 4. Environment Variables Reference

| Variable | Default Value | Purpose |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Node runtime environment |
| `PORT` | `5000` | Backend API server port |
| `DATABASE_URL` | `postgresql://postgres:postgrespassword@postgres:5432/lingualearn_db` | Relational database connection string |
| `JWT_SECRET` | `lingualearn_jwt_secret_key` | Secret key used to sign JWT authentication tokens |
| `JWT_EXPIRES_IN` | `7d` | Token validity period |
| `AI_ENGINE_MODE` | `deterministic_fallback` | AI mode (`gemini`, `openai`, or `deterministic_fallback`) |
| `CORS_ORIGIN` | `http://localhost,http://localhost:5173` | Allowed frontend origins |

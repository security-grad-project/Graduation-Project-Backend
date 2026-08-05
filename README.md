# 🛡️ Graduation Project — Backend

A **Security Operations Center (SOC)** backend platform built with **Node.js**, **TypeScript**, **Express**, **PostgreSQL** (via Prisma), and **Elasticsearch**. It powers real-time threat detection, alert management, log source monitoring, threat hunting, and custom dashboards for SOC analysts.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Modules & API Routes](#-modules--api-routes)
- [Database Models](#-database-models)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development (without Docker)](#local-development-without-docker)
  - [Running with Docker](#running-with-docker)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [API Documentation](#-api-documentation)

---

## 🔍 Overview

This backend serves as the core engine of a SOC (Security Operations Center) platform. It provides:

- **Authentication & Role-Based Access Control** — JWT-based auth with refresh token rotation for SOC Admins and SOC Analysts.
- **Alert Management** — Ingest, view, and triage security alerts with severity levels and MITRE ATT&CK tagging.
- **Detection Rules** — Create and manage detection rules linked to log sources and MITRE tactics.
- **Log Source Management** — Track and configure Elasticsearch-backed log sources (with agent, pipeline, ILM policy metadata).
- **Threat Hunting** — Run saved ES|QL / KQL hunting queries against Elasticsearch.
- **Discover** — Free-form Elasticsearch log exploration.
- **Dashboards** — Fully customizable analyst dashboards with panel-based layouts.
- **Device & Service Tracking** — Inventory of monitored devices and their associated services.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 22 |
| Language | TypeScript 5 |
| Framework | Express 5 |
| ORM | Prisma 7 (PostgreSQL adapter) |
| Database | PostgreSQL 16 |
| Search Engine | Elasticsearch 8.12 |
| Validation | Zod 4 |
| Auth | JWT (jsonwebtoken) + bcrypt |
| Email | Nodemailer |
| Logging | Winston + Morgan |
| API Docs | Swagger (swagger-jsdoc + swagger-ui-express) |
| Containerization | Docker + Docker Compose |
| Linting/Formatting | ESLint + Prettier |

---

## 🏗️ Architecture

```
Client (Frontend)
      │
      ▼
Express API (Port 3000)
      │
      ├── Middleware: Helmet, CORS, Rate Limiter, Morgan, Cookie Parser
      │
      ├── /api/v1/auth          ── Auth Module
      ├── /api/v1/alerts        ── Alerts Module
      ├── /api/v1/rules         ── Rules Module
      ├── /api/v1/devices       ── Device Module
      ├── /api/v1/services      ── Service Module
      ├── /api/v1/log-sources   ── Log Source Module
      ├── /api/v1/hunting       ── Threat Hunting Module
      ├── /api/v1/discover      ── Discover Module
      ├── /api/v1/dashboards    ── Dashboards Module
      ├── /api/v1/system        ── System Module
      │
      ├── PostgreSQL (via Prisma)   ── Structured Data
      └── Elasticsearch             ── Log & Event Data
```

---

## 📁 Project Structure

```
Graduation-Project-Backend/
├── prisma/
│   ├── schema.prisma          # Database schema & models
│   └── migrations/            # Prisma migration history
├── src/
│   ├── app.ts                 # Express app setup (middleware, routes, swagger)
│   ├── server.ts              # HTTP server entry point
│   ├── config/                # App config (env, limiter, elasticsearch client)
│   ├── common/
│   │   ├── errors/            # Global error handler
│   │   └── middlewares/       # Shared middlewares (auth, notFound, etc.)
│   ├── docs/                  # Swagger/OpenAPI configuration
│   ├── jobs/                  # Background jobs / scheduled tasks
│   ├── routes/
│   │   └── index.ts           # Central router aggregating all module routes
│   ├── scripts/               # Utility scripts (e.g. seeding)
│   ├── modules/
│   │   ├── Auth/              # Authentication & authorization
│   │   ├── Alerts/            # Security alert management
│   │   ├── Rule/              # Detection rule management
│   │   ├── Hunting/           # Threat hunting queries
│   │   ├── Discover/          # Elasticsearch log exploration
│   │   ├── Dashboards/        # Custom analyst dashboards
│   │   ├── System/            # System health & utilities
│   │   ├── device/            # Device inventory
│   │   ├── logSource/         # Log source configuration
│   │   └── service/           # Services per device
│   └── test/                  # Test files
├── .env.example               # Environment variable template
├── .prettierrc                # Prettier config
├── docker-compose.yml         # Production Docker Compose
├── docker-compose.dev.yml     # Development Docker Compose override
├── Dockerfile                 # Multi-stage Docker build
├── nodemon.json               # Nodemon config for dev hot-reload
├── prisma.config.ts           # Prisma config
├── tsconfig.json              # TypeScript compiler config
└── package.json
```

---

## 🔌 Modules & API Routes

All routes are prefixed with `/api/v1`.

| Module | Base Path | Description |
|---|---|---|
| Auth | `/auth` | Register, login, logout, refresh token, password reset |
| Alerts | `/alerts` | List, create, update, and triage security alerts |
| Rules | `/rules` | CRUD for detection rules with MITRE mapping |
| Devices | `/devices` | Device inventory management |
| Services | `/services` | Services associated with monitored devices |
| Log Sources | `/log-sources` | Elasticsearch log source configuration |
| Hunting | `/hunting` | Saved threat hunting queries (ES\|QL / KQL) |
| Discover | `/discover` | Free-form Elasticsearch log search |
| Dashboards | `/dashboards` | Analyst dashboard CRUD with panel layouts |
| System | `/system` | System info and utilities |

Additional special endpoints:

| Endpoint | Description |
|---|---|
| `GET /` | Root health ping |
| `GET /health` | Detailed health check (uptime, Elasticsearch status) |
| `GET /api-docs` | Swagger UI — interactive API documentation |

---

## 🗄️ Database Models

Managed by **Prisma** with **PostgreSQL**. Key models:

| Model | Description |
|---|---|
| `Analyst` | SOC analyst accounts (`SOC_ADMIN` / `SOC_ANALYST` roles) |
| `RefreshToken` | Refresh token store with revocation support |
| `AccessTokenBlacklist` | Blacklisted access tokens for secure logout |
| `PasswordResetToken` | Time-limited password reset tokens |
| `Alert` | Security alerts with severity, status, MITRE tags |
| `Rule` | Detection rules linked to log sources and MITRE tactics |
| `LogSource` | Elasticsearch log source metadata (agent, pipeline, ILM) |
| `HuntingQuery` | Saved threat hunting queries (ES\|QL / KQL) |
| `Device` | Monitored network devices |
| `Service` | Services running on monitored devices |
| `User` | End-users associated with services |
| `Dashboard` | Custom analyst dashboards with JSON panel layouts |

**Enums:**
- `Role` → `SOC_ANALYST`, `SOC_ADMIN`
- `Severity` → `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- `Status` → `OPEN`, `IN_PROGRESS`, `RESOLVED`, `FALSE_POSITIVE`, `IGNORED`, `OTHER`

---

## 🚀 Getting Started

### Prerequisites

- [Node.js 22+](https://nodejs.org/)
- [Docker](https://www.docker.com/) & Docker Compose (recommended)
- PostgreSQL 16+ (if running locally without Docker)
- Elasticsearch 8.12+ (if running locally without Docker)

---

### Local Development (without Docker)

**1. Clone the repository**

```bash
git clone https://github.com/security-grad-project/Graduation-Project-Backend.git
cd Graduation-Project-Backend
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

```bash
cp .env.example .env
# Edit .env with your local database and Elasticsearch credentials
```

**4. Run database migrations**

```bash
npx prisma migrate deploy
```

**5. Generate Prisma client**

```bash
npx prisma generate
```

**6. Start the development server**

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`.

---

### Running with Docker

Docker Compose will spin up the **API**, **PostgreSQL**, and **Elasticsearch** together.

**Development mode** (with hot-reload):

```bash
npm run docker:dev
```

**Production mode** (detached):

```bash
cp .env.example .env
# Fill in your secrets in .env
npm run docker:prod
```

Or build and run manually:

```bash
docker compose up --build
```

Services:

| Service | Container | Port |
|---|---|---|
| API | `graduation_backend` | `3000` |
| PostgreSQL | `graduation_postgres` | `5433 → 5432` |
| Elasticsearch | `elasticsearch` | internal only |

> **Note:** Elasticsearch is only exposed internally within the Docker network. The API communicates with it via `http://elasticsearch:9200`.

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
# App
NODE_ENV=development
PORT=3000
API_PORT=3000

# PostgreSQL
POSTGRES_DB=graduation_backend
POSTGRES_USER=graduation
POSTGRES_PASSWORD=change_me

# Prisma connection string
DATABASE_URL=postgresql://graduation:change_me@localhost:5432/graduation_backend?schema=public

# JWT
JWT_ACCESS_KEY=change-me-access-token-secret
ACCESS_TOKEN_EXPIRED_IN=1h
JWT_REFRESH_KEY=change-me-refresh-token-secret
REFRESH_TOKEN_EXPIRED_IN=7d

# Cookie
FRONTEND_URL=http://localhost:5173
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax

# Elasticsearch
ELASTICSEARCH_URL=http://elasticsearch:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=change_me

# SMTP / Email (for password reset)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM_EMAIL=
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run start:dev` | Start development server with Nodemon hot-reload |
| `npm start` | Start production server from compiled `dist/` |
| `npm run build` | Generate Prisma client + compile TypeScript |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Run Prettier formatter |
| `npm run docker:dev` | Run full stack in Docker (dev mode) |
| `npm run docker:prod` | Run full stack in Docker (production, detached) |
| `npm run docker:up` | Build and start Docker Compose |
| `npm run docker:build` | Build the production Docker image only |

---

## 📖 API Documentation

Interactive Swagger UI is available at:

```
http://localhost:3000/api-docs
```

It documents all available endpoints, request schemas, and response structures.

# 🛠️ RepoPulse – Detailed Implementation Plan

## Overview

RepoPulse is implemented in structured phases to ensure:
- Clear separation of concerns
- Incremental progress
- Testability at each stage
- Production-style architecture

Implementation is divided into:
1. Project Setup
2. Backend Core
3. Async Worker System
4. Metrics Engine
5. Read APIs & Caching
6. Frontend UI
7. Reliability & Observability
8. Final Polish

---

# Phase 1: Project Setup & Foundation

## 1.1 Repository Setup
- [ ] Initialize Git repository
- [ ] Create backend project (`npm init`)
- [ ] Setup folder structure:
src/
├── api/
├── services/
├── jobs/
├── models/
├── cache/
├── config/
└── utils/
- [ ] Setup `.env` for secrets
- [ ] Install core dependencies:
- express
- mongoose
- bullmq
- ioredis
- axios

## 1.2 Express Server
- [ ] Create `app.js`
- [ ] Add JSON middleware
- [ ] Add API versioning `/api/v1`
- [ ] Create `/system/health` endpoint (basic)
- [ ] Add global error handler

---

# Phase 2: Database Layer (MongoDB)

## 2.1 Repository Schema
- [ ] Create `Repository` model
- [ ] Fields:
- owner
- name
- fullName (unique)
- url
- status
- commitCount
- openIssues
- closedIssues
- contributorCount
- healthScore
- timestamps
- [ ] Add indexes (fullName unique, status optional)
- [ ] Add default values

## 2.2 Database Connection
- [ ] Setup MongoDB connection in config
- [ ] Handle connection errors
- [ ] Log DB status on startup

---

# Phase 3: Repository Ingestion API

## 3.1 Input Validation
- [ ] Validate `repoUrl`
- [ ] Normalize to `owner/name`
- [ ] Reject invalid GitHub URLs
- [ ] Extract owner & repo

## 3.2 POST /repos/analyze
- [ ] Controller:
- Read input
- Call service
- Return `pending`
- [ ] Service:
- Check for existing repo
- Create repo if new
- Set status = pending
- [ ] Return repositoryId

---

# Phase 4: Redis Queue & Worker

## 4.1 Queue Setup (BullMQ)
- [ ] Configure Redis connection
- [ ] Create `repo.queue.js`
- [ ] Add job enqueue function
- [ ] Configure retries & backoff

## 4.2 Worker Process
- [ ] Create `repo.worker.js`
- [ ] Listen to queue
- [ ] Log job start/end
- [ ] Update repo status:
- processing
- completed
- failed

---

# Phase 5: GitHub Data Ingestion

## 5.1 GitHub Service
- [ ] Setup GitHub API client with token
- [ ] Fetch repository metadata
- [ ] Fetch commits (last 30 days)
- [ ] Fetch issues (open/closed)
- [ ] Fetch contributors
- [ ] Handle pagination
- [ ] Handle rate limits

## 5.2 Worker Flow
- [ ] status → processing
- [ ] fetch GitHub data
- [ ] store raw counts
- [ ] status → completed
- [ ] on error → failed

---

# Phase 6: Metrics & Health Score Engine

## 6.1 Metrics Service
- [ ] Create `healthScore.service.js`
- [ ] Normalize commit score
- [ ] Normalize issue resolution score
- [ ] Normalize contributor score
- [ ] Combine weighted scores

## 6.2 Store Metrics
- [ ] Save metrics in repository document
- [ ] Validate numeric ranges (0–100)

---

# Phase 7: Read APIs

## 7.1 GET /repos/:id
- [ ] Fetch repository by id
- [ ] Return metadata + status
- [ ] Handle invalid id
- [ ] Handle 404

## 7.2 GET /repos/:id/metrics
- [ ] Fetch metrics from DB
- [ ] Return metrics JSON
- [ ] Handle processing state (202)
- [ ] Handle missing metrics

---

# Phase 8: Redis Caching

## 8.1 Redis Client
- [ ] Create redis client module
- [ ] Handle connection failure gracefully

## 8.2 Cache Metrics Endpoint
- [ ] Cache key: `repo:metrics:<repoId>`
- [ ] TTL (60–300 seconds)
- [ ] Cache hit/miss logic
- [ ] Fallback to DB

## 8.3 Cache Invalidation
- [ ] Clear cache when worker updates metrics

---

# Phase 9: Frontend Implementation (React)

## 9.1 Setup
- [ ] Create React app (Vite)
- [ ] Setup folder structure
- [ ] Create API service layer

## 9.2 Components
- [ ] RepoForm (submit repo)
- [ ] RepoStatus (polling)
- [ ] Loader
- [ ] ErrorBanner
- [ ] MetricsCard

## 9.3 API Integration
- [ ] POST analyze
- [ ] GET repo status
- [ ] GET metrics
- [ ] Poll every 3 seconds

## 9.4 UX Behavior
- [ ] Disable submit during loading
- [ ] Show status colors
- [ ] Show metrics only when completed
- [ ] Handle errors gracefully

---

# Phase 10: Reliability & Observability

## 10.1 System Health
- [ ] Enhance `/system/health`
- [ ] Check MongoDB
- [ ] Check Redis
- [ ] Check queue

## 10.2 Retry & Failure
- [ ] Configure BullMQ retries
- [ ] Status = failed on error
- [ ] Log errors with context

## 10.3 Logging
- [ ] Add structured logs
- [ ] Include repoId & jobId

---

# Phase 11: Testing

## 11.1 Manual Testing
- [ ] Valid repo submission
- [ ] Invalid repo submission
- [ ] Worker failure
- [ ] Metrics retrieval
- [ ] Cache hit/miss
- [ ] Frontend polling

## 11.2 Edge Cases
- [ ] Repo with no commits
- [ ] Repo with no issues
- [ ] Rate limit exceeded
- [ ] Redis down
- [ ] MongoDB down

---

# Phase 12: Final Polish & Documentation

## 12.1 README
- [ ] Project description
- [ ] Architecture diagram
- [ ] API documentation
- [ ] Setup instructions
- [ ] Interview explanation

## 12.2 Diagrams
- [ ] System architecture
- [ ] Data flow
- [ ] DB schema

## 12.3 Demo Readiness
- [ ] Seed data
- [ ] Sample screenshots
- [ ] Example curl commands

---

# Completion Criteria

RepoPulse is considered complete when:

- [ ] POST /repos/analyze works
- [ ] Worker processes GitHub data
- [ ] Metrics & health score computed
- [ ] Read APIs return correct data
- [ ] Redis caching works
- [ ] Frontend displays results
- [ ] Health endpoint works
- [ ] README written

---

# Timeline (Suggested)

| Phase | Time |
|------|------|
| Backend Core | 2–3 days |
| Worker & Metrics | 2 days |
| Read APIs & Cache | 1 day |
| Frontend MVP | 1–2 days |
| Polish & Docs | 1 day |

Total: ~7–9 days (part-time)

---

# Summary

This implementation plan ensures RepoPulse:
- Is built incrementally
- Follows backend engineering best practices
- Is scalable and maintainable
- Is interview-ready
- Demonstrates async system design
- Has both backend and frontend deliverables

RepoPulse is not just an app — it is a system design project.
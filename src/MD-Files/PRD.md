# 📄 Product Requirements Document (PRD)

## Product Name
RepoPulse

## Tagline
Scalable GitHub Project Intelligence Platform

---

## 1. 📌 Purpose & Vision

### Purpose
RepoPulse aims to provide deep, actionable insights into the health, activity, and sustainability of GitHub repositories using a scalable, event-driven backend architecture.

### Vision
To move beyond surface-level GitHub metrics (stars, forks) and answer:
- Is this project actively maintained?
- Is it at risk due to few contributors?
- Are issues handled efficiently?
- Can this project scale long-term?

---

## 2. 🎯 Target Users

### Primary Users
- Software engineers
- Open-source contributors
- Startup founders
- Engineering managers

### Secondary Users
- Recruiters evaluating engineering maturity
- Freelance clients assessing backend capability

---

## 3. 🧠 Problem Statement

Existing GitHub analytics tools:
- Focus on static metrics
- Do not scale well
- Perform heavy processing synchronously
- Lack backend system design depth

RepoPulse solves this by:
- Using asynchronous background processing
- Decoupling ingestion from computation
- Designing for horizontal scalability

---

## 4. 🧩 In-Scope Features (MVP)

### 4.1 Repository Ingestion

**Description**  
User submits a GitHub repository URL. System validates and registers the repository. Processing is triggered asynchronously.

**Requirements**
- Accept GitHub repo URL
- Normalize owner/repo format
- Store repo metadata in database
- Push processing job to queue

---

### 4.2 Asynchronous Job Processing

**Description**  
Heavy GitHub data fetching runs in background workers.

**Requirements**
- Use Redis-based job queue (BullMQ)
- Separate worker process
- Retry failed jobs
- Idempotent job execution

---

### 4.3 GitHub Data Collection

**Description**  
Fetch repository-related data from GitHub APIs.

**Data Collected**
- Repository metadata
- Commits (last 30 days)
- Issues (open vs closed)
- Contributors

**Requirements**
- Handle pagination
- Respect GitHub rate limits
- Graceful failure handling

---

### 4.4 Metrics & Analytics Engine

**Description**  
Convert raw GitHub data into meaningful metrics.

**Metrics**
- Commit count (last 30 days)
- Issue resolution ratio
- Contributor count
- Basic health score (weighted)

**Health Score Logic (Initial)**
- Commit activity: 40%
- Issue resolution: 40%
- Contributor diversity: 20%

---

### 4.5 Data Storage

**Databases**
- MongoDB: persistent data storage
- Redis: caching, queues, rate limiting

**Collections**
- repositories
- metrics_snapshots
- jobs (optional)
- system_logs (optional)

---

### 4.6 Public REST APIs

**Endpoints**
- POST /api/v1/repos/analyze
- GET  /api/v1/repos/:id
- GET  /api/v1/repos/:id/metrics
- GET  /api/v1/system/health

**Requirements**
- Fast response time
- Cached responses
- Versioned APIs

---

### 4.7 Caching Strategy

**Description**  
Reduce DB load and improve performance.

**Requirements**
- Cache frequently accessed metrics
- TTL-based cache invalidation
- Fallback to DB on cache miss

---

### 4.8 Minimal Frontend (Optional)

**Description**  
Lightweight React UI for demo purposes.

**Features**
- Submit repository
- View metrics
- Simple charts

Frontend is not core to MVP success.

---

## 5. 🏗️ System Architecture

### High-Level Flow

---

## 6. ⚙️ Non-Functional Requirements

### Performance
- API response < 200ms (cached)
- Background jobs non-blocking

### Scalability
- Horizontal scaling of workers
- Stateless API services

### Reliability
- Retry failed jobs
- Graceful degradation
- Health check endpoints

### Security
- Input validation
- API rate limiting
- Secure storage of GitHub tokens

### Observability
- Structured logs
- Job success/failure tracking
- Queue depth monitoring

---

## 7. 🚫 Out of Scope (Explicitly Excluded)

- OAuth authentication
- Multi-tenant SaaS billing
- Kubernetes deployment
- Advanced ML models
- Complex frontend UI

(These are future enhancements.)

---

## 8. 🗓️ Development Phases

### Phase 1 – Core Backend (MVP)
- Express API
- MongoDB integration
- GitHub API integration
- Queue + worker
- Basic metrics

### Phase 2 – Scalability & Reliability
- Redis caching
- Retry logic
- Rate limiting
- Dockerization

### Phase 3 – Polish
- README & diagrams
- Load testing
- Error handling
- Demo UI (optional)

---

## 9. 📊 Success Metrics

### Technical
- Background jobs process successfully
- API remains responsive during processing
- Cache hit ratio > 60%

### Career Impact
- Resume-ready project
- Clear system design story
- Demonstrable scalability concepts

---

## 10. 🧠 How This Will Be Explained (Interview Summary)

“RepoPulse is a scalable Node.js backend that asynchronously processes GitHub data using Redis queues and worker services to compute repository health metrics while keeping APIs fast and reliable.”

---

## 11. 🏁 Final Notes

- RepoPulse is not a toy project
- It prioritizes backend engineering principles
- It is intentionally scoped to be finishable while learning
- Even partial completion is valuable
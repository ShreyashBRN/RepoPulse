# 🗄️ RepoPulse – Database Design (MongoDB)

## Overview

RepoPulse uses MongoDB as its primary persistent datastore to manage:

1. Repository metadata and processing state  
2. Computed metrics and health score  
3. Job execution history (optional but recommended)  
4. Future historical metrics (snapshots)

Redis is used only for:
- Job queue (BullMQ)
- Caching
- Rate limiting  
and is NOT a source of truth.

MongoDB is the system of record.

---

## Core Collections

RepoPulse uses the following collections:

1. `repositories` (primary collection – MVP)
2. `metrics_snapshots` (future enhancement)
3. `job_logs` (optional but recommended)

---

# 1️⃣ Collection: `repositories`

This collection represents a GitHub repository that has been submitted for analysis.

It stores:
- Identity
- Processing status
- Latest computed metrics
- Health score

---

## Fields

| Field | Type | Description |
|------|------|-------------|
| `_id` | ObjectId | Primary key |
| `owner` | String | GitHub owner |
| `name` | String | Repository name |
| `fullName` | String | `owner/name` (unique) |
| `repoUrl` | String | Original submitted URL |
| `status` | String (enum) | `pending`, `processing`, `completed`, `failed` |
| `commitCount30d` | Number | Commits in last 30 days |
| `openIssues` | Number | Open issues count |
| `closedIssues` | Number | Closed issues count |
| `contributorCount` | Number | Number of contributors |
| `healthScore` | Number | Computed score (0–100) |
| `lastAnalyzedAt` | Date | Last worker completion time |
| `errorMessage` | String (nullable) | Failure reason if status = failed |
| `createdAt` | Date | Record creation time |
| `updatedAt` | Date | Last update time |

---

## Indexes

| Index | Purpose |
|------|---------|
| `fullName` (unique) | Prevent duplicate repositories |
| `status` | Query pending / failed jobs |
| `lastAnalyzedAt` | Future scheduling |

---

## Status Lifecycle

# 🎨 RepoPulse – UI Development Plan

## Overview

The RepoPulse frontend provides a simple and intuitive interface for users to:

1. Submit a GitHub repository URL
2. Track analysis status (pending / processing / completed / failed)
3. View computed repository metrics and health score
4. Interact with backend APIs in real time

The UI focuses on clarity, responsiveness, and minimalism.

---

## 🎯 UI Goals (MVP)

- Simple single-page interface
- Fast feedback to user
- Real-time status updates
- Clear visualization of repository health
- No authentication required
- Desktop-first responsive layout

---

## 🧩 Technology Stack

- React (Vite)
- Fetch / Axios for API calls
- Basic CSS or Tailwind (optional)
- No heavy UI frameworks required for MVP

---

## 🏗️ UI Architecture

### Folder Structure
src/
├── components/
│ ├── RepoForm.jsx
│ ├── RepoStatus.jsx
│ ├── MetricsCard.jsx
│ ├── Loader.jsx
│ ├── ErrorBanner.jsx
├── services/
│ └── api.js
├── App.jsx
└── main.jsx


---

## 📄 Main Screens (MVP)

### 1️⃣ Home Screen (Single Page App)

Sections:
- Header (RepoPulse title + tagline)
- Repository input form
- Status display
- Metrics display

---

## 🧱 Component Breakdown

### 1. RepoForm Component

**Purpose:**  
Accept GitHub repository URL and submit for analysis.

**UI Elements:**
- Text input field
- Submit button
- Loading indicator
- Error message display

**State:**
- `repoUrl`
- `loading`
- `error`
- `repoId`

**Behavior Flow:**
Poll GET /repos/:id every 3s → update status → stop polling on completed/failed

**State:**
- `status`
- `lastUpdated`

**Edge Cases:**
- API timeout
- Backend down
- Repo deleted

---

### 3. MetricsCard Component

**Purpose:**  
Display computed metrics and health score.

**UI Elements:**
- Commit count
- Open issues
- Closed issues
- Contributor count
- Health score (0–100)

**Render Only When:**
status === "completed"

**Edge Cases:**
- Metrics missing
- Partial data
- Health score = null

---

### 4. Loader Component

**Purpose:**  
Visual feedback for processing state.

**UI Elements:**
- Spinner / progress animation
- Text: "Analyzing repository..."

---

### 5. ErrorBanner Component

**Purpose:**  
Display API or system errors.

**Cases:**
- Backend unreachable
- Invalid repo URL
- Rate limit exceeded
- Job failed

---

## 🔌 API Integration Layer

### File: `services/api.js`

**Functions:**
- `analyzeRepo(repoUrl)` → POST /api/v1/repos/analyze
- `getRepo(repoId)` → GET /api/v1/repos/:id
- `getMetrics(repoId)` → GET /api/v1/repos/:id/metrics

**Responsibilities:**
- Centralize all HTTP calls
- Handle base URL
- Handle JSON parsing
- Throw clean errors

---

## 🔁 Polling Strategy

**Why Polling:**  
Backend processes asynchronously.

**Implementation Plan:**
- Start polling when repoId is received
- Poll every 3 seconds
- Stop polling when:
  - status = completed
  - status = failed

**Failure Handling:**
- Retry up to N times
- Show error message on failure

---

## 🧠 State Management Plan

### App-level State

- `repoId`
- `status`
- `metrics`
- `loading`
- `error`

Managed via:
- React `useState`
- React `useEffect`

No Redux needed for MVP.

---

## 🎨 UI/UX Design Guidelines

- Clean layout
- Large input field
- Clear status labels
- Color coding:
  - Pending → gray
  - Processing → blue
  - Completed → green
  - Failed → red
- Health score emphasized visually
- Mobile responsive layout

---

## 🧪 Testing Strategy

### Manual Testing

Test scenarios:
- Valid repository
- Invalid URL
- Slow GitHub response
- Backend down
- Multiple submissions
- Refresh browser during processing

---

## 📋 UI Development Checklist

### Phase 1 – Setup

- [ ] React project created
- [ ] Folder structure setup
- [ ] API service file created

---

### Phase 2 – Core Components

- [ ] RepoForm component built
- [ ] RepoStatus component built
- [ ] Loader component built
- [ ] ErrorBanner component built
- [ ] MetricsCard component built

---

### Phase 3 – API Integration

- [ ] POST /repos/analyze wired
- [ ] GET /repos/:id wired
- [ ] GET /repos/:id/metrics wired
- [ ] Polling logic implemented

---

### Phase 4 – UX & Polish

- [ ] Loading indicators
- [ ] Error handling
- [ ] Disable button during submit
- [ ] Clear success messages
- [ ] Responsive layout

---

### Phase 5 – Optional Enhancements

- [ ] Simple charts (health score)
- [ ] History of searched repos
- [ ] LocalStorage persistence
- [ ] Dark mode

---

## 🔮 Future UI Enhancements

- Trend charts using metrics_snapshots
- Compare two repositories
- Search history
- Authentication
- User dashboard

---

## 📌 Summary

RepoPulse UI will:
- Provide simple repository submission
- Show real-time analysis progress
- Display meaningful metrics
- Stay minimal and fast
- Be backend-driven
- Be extensible for future features

The UI is intentionally scoped for MVP while allowing future expansion.

---
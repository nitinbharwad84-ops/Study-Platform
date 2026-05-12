# AI Study Platform — Master Module List & Progress Tracker

> **Last Updated:** 2026-05-12  
> **Status:** Phase 1 Complete → Phase 2 In Progress  
> **PRD Reference:** [PRD.md](./PRD.md)

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 + CSS Variables (HSL) |
| Component Library | shadcn/ui |
| Icons | Lucide Icons |
| Animation | Framer Motion (minimal) |
| State Management | Zustand |
| Forms | React Hook Form + Zod |
| Tables | TanStack Table |
| Charts | Recharts |
| Backend | Next.js Route Handlers + Server Actions |
| Database | PostgreSQL (Supabase) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| AI Primary | NVIDIA NIM |
| AI Fallback | Grok |
| Future RAG Vector DB | pgvector |
| Hosting | Vercel |

---

## Implementation Phases Overview

| Phase | Name | Status |
|-------|------|--------|
| **Phase 1** | Project Setup & Initialization | `[x]` ✅ Complete |
| **Phase 2** | Complete UI Shell (All Pages, Dummy Data, No Backend) | `[/]` In Progress |
| **Phase 3** | MCQ Exam Module (Backend + Full Integration) | `[ ]` Not Started |
| **Phase 4** | Admin Panel Module (End-to-End with Auth & RBAC) | `[ ]` Not Started |
| **Phase 5** | Long Answer Exam Module *(Future)* | `[ ]` Not Started |
| **Phase 6** | AI RAG-Based Chatbot Module *(Future)* | `[ ]` Not Started |
| **Phase 7** | Analytics & Observability *(Future)* | `[ ]` Not Started |

---

## Phase 1 — Project Setup & Initialization

> **Goal:** Scaffold the Next.js project, install dependencies, configure theming, set up project structure, and establish foundational layouts.

| # | Task | Status |
|---|------|--------|
| 1.1 | Initialize Next.js 14 project with TypeScript & App Router | `[x]` ✅ |
| 1.2 | Install & configure Tailwind CSS v3 + CSS Variables | `[x]` ✅ |
| 1.3 | Install & configure shadcn/ui components (20 installed) | `[x]` ✅ |
| 1.4 | Install Lucide Icons, Framer Motion, Zustand, React Hook Form, Zod, TanStack Table, Recharts | `[x]` ✅ |
| 1.5 | Set up dark/light theme system (CSS variables + ThemeProvider + ThemeToggle) | `[x]` ✅ |
| 1.6 | Create app route group structure: `/(public)`, `/(student)`, `/(admin)` | `[x]` ✅ |
| 1.7 | Create shared layout components (StudentLayout, AdminLayout, PublicLayout) | `[x]` ✅ |
| 1.8 | Create student sidebar navigation component | `[x]` ✅ |
| 1.9 | Create admin sidebar navigation component | `[x]` ✅ |
| 1.10 | Create topbar component (profile avatar, theme toggle, page title) | `[x]` ✅ |
| 1.11 | Set up responsive sidebar behavior (persistent desktop, drawer mobile) | `[x]` ✅ |
| 1.12 | Create `.env.local.example` with placeholder env vars | `[x]` ✅ |
| 1.13 | Set up basic middleware placeholder for route protection | `[x]` ✅ |

---

## Phase 2 — Complete UI Shell (All Pages, Dummy Data, No Backend)

> **Goal:** Build ALL user-facing and admin-facing pages with dummy/mock data. No backend, no database, no authentication logic. All pages should look production-ready.

### 2A — Public Pages (Auth UI)

| # | Task | Status |
|---|------|--------|
| 2A.1 | Login page (`/login`) — email, password, show/hide toggle, forgot password link, loading state | `[x]` ✅ |
| 2A.2 | Register page (`/register`) — invite-only messaging, email validation UI, password creation, name fields | `[x]` ✅ |
| 2A.3 | Forgot Password page (`/forgot-password`) — email input, reason/message, request submission UI | `[x]` ✅ |

### 2B — Student Pages

| # | Task | Status |
|---|------|--------|
| 2B.1 | Student Dashboard (`/dashboard`) — welcome header, quick stats cards, recent activity, resume exam CTA, subject performance table, quick actions | `[x]` ✅ |
| 2B.2 | MCQ Exams page (`/mcq`) — subject selection, question count selector, timer mode selector (per-question / full exam), timer config, start exam button | `[x]` ✅ |
| 2B.3 | MCQ Exam Session page (`/mcq/exam`) — question display, 4 options, timer, next/prev navigation, progress indicator, answer lock visual, explanation panel | `[ ]` |
| 2B.4 | MCQ Result Screen (`/mcq/result`) — score, percentage, correct/wrong/unanswered counts, performance summary, action buttons (review, dashboard, new exam) | `[ ]` |
| 2B.5 | MCQ Detailed Review (`/mcq/review`) — full question-by-question review with chosen/correct answers, all 4 explanations, read-only | `[ ]` |
| 2B.6 | MCQ History page (`/mcq/history`) — attempt list with date, subject, score, accuracy, timer mode, status; filters by subject/date/status | `[x]` ✅ |
| 2B.7 | AI Chat page (`/chat`) — **Coming Soon** overlay, mock chat sidebar, mock main panel, disabled input, sample prompts, subject selector | `[x]` ✅ |
| 2B.8 | Chat History page (`/chat/history`) — **Coming Soon** overlay, mock thread list with subjects | `[x]` ✅ |
| 2B.9 | Long Answer Exams page (`/long-answer`) — **Coming Soon** overlay, mock subject selector, question count, timer, textarea, reveal answer button, submit | `[x]` ✅ |
| 2B.10 | Student Settings page (`/settings`) — profile section (first/last name), security section (email read-only, request password reset), theme toggle | `[x]` ✅ |

### 2C — Admin Pages

| # | Task | Status |
|---|------|--------|
| 2C.1 | Admin Dashboard (`/admin/dashboard`) — user metrics, admin metrics, subject metrics, content metrics, provider health, reset queue, audit snapshot, quick actions | `[ ]` |
| 2C.2 | User Management (`/admin/users`) — user list table with search, filters, status badges; user detail view; action buttons (disable, enable, revoke) | `[ ]` |
| 2C.3 | Approved Emails (`/admin/approved-emails`) — email list, add/remove/revoke actions, status badges (approved, claimed, revoked, expired) | `[ ]` |
| 2C.4 | Admin Management (`/admin/admins`) — admin list, create admin form (name, email, role, permissions, subjects), detail view, edit/disable/delete | `[ ]` |
| 2C.5 | Subject Management (`/admin/subjects`) — subject list, create/edit/archive/deactivate, assign admins, status badges | `[ ]` |
| 2C.6 | MCQ Content Management (`/admin/mcq-content`) — question bank by subject, question table, upload UI (CSV/JSON), manual entry form, import preview, edit/deactivate/delete | `[ ]` |
| 2C.7 | Long Answer Content (`/admin/long-answer-content`) — **Coming Soon** overlay, mock upload UI, mock question list | `[ ]` |
| 2C.8 | AI Providers (`/admin/providers`) — provider config cards (NVIDIA NIM, Grok), model selector, test provider button, subject-specific routing config, test results display | `[ ]` |
| 2C.9 | Analytics Dashboard (`/admin/analytics`) — platform analytics, exam analytics, subject analytics, user drilldown; charts and tables | `[ ]` |
| 2C.10 | Audit Logs (`/admin/audit`) — log table with timestamp, actor, action, entity, metadata; filters by user/action/entity/date | `[ ]` |
| 2C.11 | Admin Settings (`/admin/settings`) — long answer defaults, timer defaults, provider defaults, permission defaults | `[ ]` |
| 2C.12 | Password Reset Requests (`/admin/password-resets`) — request queue, approve/reject actions, expiration display | `[ ]` |

### 2D — Shared UI Components

| # | Task | Status |
|---|------|--------|
| 2D.1 | Empty state components (no data, no history, first-time user) | `[ ]` |
| 2D.2 | Loading/skeleton state components | `[ ]` |
| 2D.3 | Error state components | `[ ]` |
| 2D.4 | Coming Soon overlay component | `[ ]` |
| 2D.5 | Confirmation modal component (for destructive actions) | `[ ]` |
| 2D.6 | Data table component (reusable with search, filters, pagination) | `[ ]` |
| 2D.7 | Stats card component | `[ ]` |
| 2D.8 | Badge/status component | `[ ]` |

---

## Phase 3 — MCQ Exam Module (Backend Integration)

> **Goal:** Make the MCQ module fully functional end-to-end. This is the first production-ready module.

### 3A — Database Setup

| # | Task | Status |
|---|------|--------|
| 3A.1 | Set up Supabase project & PostgreSQL database | `[ ]` |
| 3A.2 | Create `subjects` table | `[ ]` |
| 3A.3 | Create `mcq_question_banks` table | `[ ]` |
| 3A.4 | Create `mcq_questions` table (question, options A-D, correct_option, explanations A-D, metadata) | `[ ]` |
| 3A.5 | Create `mcq_attempts` table (user_id, subject, timer config, status, timestamps) | `[ ]` |
| 3A.6 | Create `mcq_attempt_answers` table (attempt_id, question snapshot, selected_answer, is_correct, locked) | `[ ]` |
| 3A.7 | Seed sample subjects and MCQ questions for testing | `[ ]` |

### 3B — MCQ Backend APIs

| # | Task | Status |
|---|------|--------|
| 3B.1 | API: Start exam — generate attempt with anti-repeat logic, option shuffle, snapshot questions | `[ ]` |
| 3B.2 | API: Submit answer — lock answer, persist immediately, validate no re-submission | `[ ]` |
| 3B.3 | API: Navigate questions — fetch question by index within attempt | `[ ]` |
| 3B.4 | API: Resume exam — restore attempt state (position, locked answers, timer) | `[ ]` |
| 3B.5 | API: Complete exam — finalize, calculate score, update analytics | `[ ]` |
| 3B.6 | API: Get exam result — score, percentage, correct/wrong/unanswered | `[ ]` |
| 3B.7 | API: Get detailed review — all questions with answers and explanations | `[ ]` |
| 3B.8 | API: Get exam history — list attempts with filters | `[ ]` |
| 3B.9 | Timer engine — per-question and full-exam timer persistence, auto-lock on expiry | `[ ]` |
| 3B.10 | Anti-repetition randomization engine — weighted recency exclusion | `[ ]` |

### 3C — MCQ Frontend Integration

| # | Task | Status |
|---|------|--------|
| 3C.1 | Connect MCQ exam page to backend (subject list, start exam) | `[ ]` |
| 3C.2 | Connect exam session to backend (real questions, answer locking, navigation) | `[ ]` |
| 3C.3 | Connect timer to server-persisted state | `[ ]` |
| 3C.4 | Connect result screen to real scoring data | `[ ]` |
| 3C.5 | Connect detailed review to real attempt data | `[ ]` |
| 3C.6 | Connect history page to real attempt list | `[ ]` |
| 3C.7 | Connect dashboard stats to real MCQ data | `[ ]` |
| 3C.8 | Implement resume exam flow (dashboard CTA + history resume) | `[ ]` |
| 3C.9 | Edge case handling (insufficient questions, timer desync, network drop, duplicate submit) | `[ ]` |

---

## Phase 4 — Admin Panel Module (End-to-End)

> **Goal:** Build the complete admin module with authentication, RBAC, and all admin features fully functional.

### 4A — Authentication System

| # | Task | Status |
|---|------|--------|
| 4A.1 | Supabase Auth setup (email/password) | `[ ]` |
| 4A.2 | Create `users` table (id, auth_id, email, first_name, last_name, role_id, status) | `[ ]` |
| 4A.3 | Create `roles` table (student, normal_admin, super_admin) | `[ ]` |
| 4A.4 | Create `approved_emails` table (email, invited_by, status, claimed, role_to_assign) | `[ ]` |
| 4A.5 | Implement invite-only registration flow (validate email → create account → assign role) | `[ ]` |
| 4A.6 | Implement login flow with role-based redirect (student → /dashboard, admin → /admin/dashboard) | `[ ]` |
| 4A.7 | Implement logout with session cleanup | `[ ]` |
| 4A.8 | Implement session management (persist, restore, expire, role-aware) | `[ ]` |
| 4A.9 | Implement middleware route protection (public, student, admin, super-admin routes) | `[ ]` |

### 4B — RBAC & Permissions

| # | Task | Status |
|---|------|--------|
| 4B.1 | Create `permissions` table (can_manage_users, can_view_analytics, etc.) | `[ ]` |
| 4B.2 | Create `role_permissions` table (default role permissions) | `[ ]` |
| 4B.3 | Create `user_permissions` table (delegation overrides) | `[ ]` |
| 4B.4 | Create `admin_subject_assignments` table | `[ ]` |
| 4B.5 | Implement server-side permission checks on all protected APIs | `[ ]` |
| 4B.6 | Implement role-aware sidebar rendering (hide items based on permissions) | `[ ]` |

### 4C — Password Reset System

| # | Task | Status |
|---|------|--------|
| 4C.1 | Create `password_reset_requests` table | `[ ]` |
| 4C.2 | API: Request password reset (student submits) | `[ ]` |
| 4C.3 | API: Admin approve/reject reset | `[ ]` |
| 4C.4 | API: Execute password reset (after admin approval) | `[ ]` |
| 4C.5 | Connect UI for student reset request + admin reset queue | `[ ]` |

### 4D — Admin Backend APIs

| # | Task | Status |
|---|------|--------|
| 4D.1 | API: User management (list, search, disable, enable, revoke, detail view) | `[ ]` |
| 4D.2 | API: Approved email management (add, remove, revoke, list) | `[ ]` |
| 4D.3 | API: Admin management (create, edit, disable, delete, assign permissions, assign subjects) | `[ ]` |
| 4D.4 | API: Subject management (create, edit, archive, deactivate, assign admins) | `[ ]` |
| 4D.5 | API: MCQ content management (upload CSV/JSON, manual entry, import preview, confirm, edit, deactivate, delete) | `[ ]` |
| 4D.6 | API: AI provider config (CRUD, subject-specific routing) | `[ ]` |
| 4D.7 | API: Provider testing (real connectivity validation — credentials, endpoint, auth, model, inference) | `[ ]` |
| 4D.8 | API: Analytics queries (platform, exam, subject, user analytics) | `[ ]` |

### 4E — Audit Logging

| # | Task | Status |
|---|------|--------|
| 4E.1 | Create `audit_logs` table (event_id, actor_id, actor_role, action, entity_type, entity_id, timestamp, metadata) | `[ ]` |
| 4E.2 | Implement audit logging for auth events (login, logout, failed login, password reset) | `[ ]` |
| 4E.3 | Implement audit logging for admin events (user/admin/subject/content/provider changes) | `[ ]` |
| 4E.4 | API: Audit log viewer with filters | `[ ]` |
| 4E.5 | Connect audit log UI to real data | `[ ]` |

### 4F — Admin Frontend Integration

| # | Task | Status |
|---|------|--------|
| 4F.1 | Connect admin dashboard to real metrics | `[ ]` |
| 4F.2 | Connect user management to real APIs | `[ ]` |
| 4F.3 | Connect approved emails to real APIs | `[ ]` |
| 4F.4 | Connect admin management to real APIs | `[ ]` |
| 4F.5 | Connect subject management to real APIs | `[ ]` |
| 4F.6 | Connect MCQ content management to real APIs (including file upload + import pipeline) | `[ ]` |
| 4F.7 | Connect provider management to real APIs | `[ ]` |
| 4F.8 | Connect analytics to real data with charts | `[ ]` |
| 4F.9 | Connect settings/governance to real APIs | `[ ]` |

---

## Phase 5 — Long Answer Exam Module *(Future — After Phase 4 Testing)*

> **Goal:** Activate the long answer exam module with AI-powered subjective grading.

| # | Task | Status |
|---|------|--------|
| 5.1 | Create `long_answer_question_sets` table | `[ ]` |
| 5.2 | Create `long_answer_attempts` + `long_answer_attempt_answers` tables | `[ ]` |
| 5.3 | Implement long answer exam flow (subject → config → write → submit → AI evaluate) | `[ ]` |
| 5.4 | Implement AI evaluation engine (score, strengths, weaknesses, suggestions, ideal answer) | `[ ]` |
| 5.5 | Implement reveal answer system (dynamic AI-generated ideal answer) | `[ ]` |
| 5.6 | Implement timer engine (per-question and full-batch modes) | `[ ]` |
| 5.7 | Implement admin content management for long answer questions | `[ ]` |
| 5.8 | Implement admin configuration controls (question count, timer, reveal settings) | `[ ]` |
| 5.9 | Connect all long answer UI pages to backend | `[ ]` |
| 5.10 | Remove "Coming Soon" overlay from long answer pages | `[ ]` |

---

## Phase 6 — AI RAG-Based Chatbot Module *(Future)*

> **Goal:** Build strict source-grounded academic chat with RAG pipeline.

| # | Task | Status |
|---|------|--------|
| 6.1 | Implement document processing pipeline (upload → validate → parse → chunk → embed → store) | `[ ]` |
| 6.2 | Set up pgvector for embedding storage | `[ ]` |
| 6.3 | Implement retrieval layer (subject-isolated semantic search) | `[ ]` |
| 6.4 | Implement prompt construction with source-bounded enforcement | `[ ]` |
| 6.5 | Create `chat_threads` and `chat_messages` tables | `[ ]` |
| 6.6 | Implement chat flow (new chat → select subject → send message → AI response) | `[ ]` |
| 6.7 | Implement chat history (browse, search, filter, rename, delete) | `[ ]` |
| 6.8 | Implement strict knowledge bound rule ("Answer not found in provided study material") | `[ ]` |
| 6.9 | Admin: Chat document management (upload, subject-specific, 20 files per subject) | `[ ]` |
| 6.10 | Connect all chat UI pages to backend | `[ ]` |
| 6.11 | Remove "Coming Soon" overlay from chat pages | `[ ]` |

---

## Phase 7 — Analytics & Observability *(Future)*

> **Goal:** Enhanced analytics, monitoring, and performance optimization.

| # | Task | Status |
|---|------|--------|
| 7.1 | Implement analytics snapshot aggregation for scalability | `[ ]` |
| 7.2 | Add learning intelligence (weak-topic recommendations, adaptive testing suggestions) | `[ ]` |
| 7.3 | Implement CSV/PDF export for analytics | `[ ]` |
| 7.4 | Set up error monitoring (Sentry or equivalent) | `[ ]` |
| 7.5 | Performance monitoring and optimization | `[ ]` |

---

## Cross-Cutting Concerns (Built Across All Phases)

| Concern | Status |
|---------|--------|
| Dark/Light theme system | `[ ]` |
| Responsive design (desktop-first, mobile/tablet compatible) | `[ ]` |
| Empty states for all modules | `[ ]` |
| Loading/skeleton states for all modules | `[ ]` |
| Error states with actionable messaging | `[ ]` |
| Keyboard navigation & accessibility | `[ ]` |
| SEO meta tags on public pages | `[ ]` |
| Input sanitization (XSS/injection prevention) | `[ ]` |
| Rate limiting on sensitive endpoints | `[ ]` |
| CSRF protection on state-changing operations | `[ ]` |

---

## Module Summary

| Module | PRD Sections | Phase | Status |
|--------|-------------|-------|--------|
| Project Scaffolding | §116-117 | Phase 1 | `[ ]` Not Started |
| Auth UI | §13-18 | Phase 2A | `[ ]` Not Started |
| Student Dashboard UI | §24-26 | Phase 2B | `[ ]` Not Started |
| MCQ Exam UI | §38-57 | Phase 2B | `[ ]` Not Started |
| AI Chat UI (Coming Soon) | §28 | Phase 2B | `[ ]` Not Started |
| Chat History UI (Coming Soon) | §29 | Phase 2B | `[ ]` Not Started |
| Long Answer UI (Coming Soon) | §30, §72 | Phase 2B | `[ ]` Not Started |
| Student Settings UI | §31-32 | Phase 2B | `[ ]` Not Started |
| Admin Dashboard UI | §80 | Phase 2C | `[ ]` Not Started |
| User Management UI | §81 | Phase 2C | `[ ]` Not Started |
| Approved Emails UI | §82 | Phase 2C | `[ ]` Not Started |
| Admin Management UI | §83 | Phase 2C | `[ ]` Not Started |
| Subject Management UI | §84 | Phase 2C | `[ ]` Not Started |
| MCQ Content Management UI | §85 | Phase 2C | `[ ]` Not Started |
| AI Providers UI | §100 | Phase 2C | `[ ]` Not Started |
| Analytics UI | §88 | Phase 2C | `[ ]` Not Started |
| Audit Logs UI | §89 | Phase 2C | `[ ]` Not Started |
| MCQ Backend | §38-57 | Phase 3 | `[ ]` Not Started |
| Authentication Backend | §13-21 | Phase 4A | `[ ]` Not Started |
| RBAC Backend | §10-12, §19 | Phase 4B | `[ ]` Not Started |
| Admin Backend | §75-93 | Phase 4D | `[ ]` Not Started |
| Audit Logging Backend | §22, §89 | Phase 4E | `[ ]` Not Started |
| Long Answer Backend | §58-74 | Phase 5 | `[ ]` Future |
| AI RAG Chatbot Backend | §105-111 | Phase 6 | `[ ]` Future |
| AI Provider Infrastructure | §94-104 | Phase 4D/6 | `[ ]` Not Started |

---

> **Note:** Phases 5, 6, and 7 will only begin after Phases 1–4 are fully tested and approved by the user.

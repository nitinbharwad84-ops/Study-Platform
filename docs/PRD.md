# AI Study Platform PRD

## Chunk 1 — Product Foundation

---

# 1. Executive Summary

## Product Name

**AI Study Platform** (working title)

---

## Product Type

Private, invite-only, AI-assisted educational web application.

---

## Product Category

Educational technology / study assistance / assessment platform.

---

## Deployment Platform

Web application.

Primary deployment:

* Vercel hosting
* browser-based access
* responsive desktop-first design
* mobile/tablet compatible responsive layout

---

## Product Purpose

The purpose of this platform is to create a controlled academic study environment where approved users can access subject-specific learning tools, assessment modules, future AI tutoring capabilities, and performance analytics.

This is not intended to be a public consumer application.

This is a private access-controlled academic system.

---

## Initial Product Strategy

The platform is intentionally designed with staged implementation.

The first production-ready functional module will be:

**MCQ Examination System**

Other modules will be visually present in the UI but marked as:

**Coming Soon**

This allows:

* fast product scaffolding
* realistic UI completion
* architecture stability
* incremental backend implementation
* reduced development complexity
* faster MVP shipping

---

## Scale Expectations

Expected usage:

### Total Registered Users

Approximately:

**200 users**

---

### Concurrent Active Users

Expected:

**10–20 concurrent users**

This affects:

* infrastructure decisions
* AI provider scaling assumptions
* database selection
* hosting architecture
* performance expectations

---

## Core Business Objective

Create a maintainable, scalable, role-based educational platform that:

* manages restricted users
* supports structured testing
* enables future AI-assisted learning
* allows granular admin control
* minimizes infrastructure complexity
* remains cost-conscious

---

# 2. Product Vision

## Vision Statement

To build a clean, minimal, intelligent educational platform that gives students structured subject-specific learning and testing tools within a tightly controlled private environment.

---

## Long-Term Vision

The long-term vision is to evolve the platform into a full AI academic assistant ecosystem including:

* AI tutoring
* strict RAG-based study assistant
* MCQ testing
* subjective answer evaluation
* progress analytics
* personalized subject performance insights
* adaptive learning suggestions
* admin-governed educational content management

---

## Design Philosophy

The product must feel:

* simple
* modern
* professional
* minimal
* focused
* distraction-free

It must NOT feel:

* playful
* overly colorful
* cluttered
* social-media styled
* gimmicky

UI direction:

clean SaaS-style academic dashboard.

---

# 3. Problem Statement

Students preparing for technical or academic subjects often face fragmented study workflows.

Typical issues:

---

## Problem 1 — Scattered Study Resources

Study material exists across:

* PDFs
* notes
* Google Drive folders
* Word docs
* CSV question sets
* random websites

This causes:

* inefficient study flow
* context switching
* content inconsistency

---

## Problem 2 — Weak Assessment Feedback

Typical MCQ systems often:

* only show score
* hide explanations
* do not explain misconceptions
* fail to reinforce understanding

This weakens retention.

---

## Problem 3 — Lack of Controlled Access

Open educational tools do not provide:

* invite-only access
* admin-governed onboarding
* controlled academic environments

This creates management limitations.

---

## Problem 4 — Weak Admin Content Governance

Many systems lack:

* subject-level content control
* role-based access delegation
* audit visibility
* granular permissions

This creates operational inefficiency.

---

## Problem 5 — Poor AI Reliability

Generic AI chat systems:

* hallucinate
* ignore source content
* blend general knowledge with uploaded content
* fail to stay academically bounded

This reduces trust.

---

## Problem 6 — Missing Subjective Evaluation

Students need:

* written answer evaluation
* structured feedback
* answer quality assessment
* ideal answer comparisons

Traditional systems often lack this.

---

# 4. Proposed Solution

The solution is a private AI-assisted academic platform with modular educational workflows.

Core solution pillars:

---

## Pillar 1 — Controlled Access

Only approved users can register.

Access is admin-governed.

This creates:

* privacy
* academic control
* user quality filtering

---

## Pillar 2 — High-Quality Assessment

MCQ engine with:

* detailed explanations
* answer locking
* review system
* timer modes
* resume support
* anti-repeat logic

---

## Pillar 3 — Role-Based Governance

Role hierarchy:

* Super Admin
* Normal Admin
* Student

Enables scalable management.

---

## Pillar 4 — Future AI Assistance

Future modules:

* strict RAG chatbot
* subjective grading AI
* ideal answer generation

AI must be source-governed where required.

---

## Pillar 5 — Subject-Centric Design

Everything organized by subject.

Examples:

* DBMS
* Software Engineering
* PHP
* DSA
* OS
* CN
* OOP
* other academic topics

---

## Pillar 6 — Analytics Visibility

Track:

* usage
* performance
* progress
* weak areas
* completion behavior

---

# 5. Product Goals

# Primary Goals

---

## Goal 1 — Deliver Reliable MCQ MVP

The first major objective is a robust production-ready MCQ examination module.

It must support:

* real question banks
* structured exams
* scoring
* timers
* review
* resume functionality

This is the first true usable module.

---

## Goal 2 — Establish Strong Architecture

Build a scalable foundation for:

* AI integration
* RAG
* analytics
* multi-role admin management
* subject expansion

Architecture should avoid rewrites later.

---

## Goal 3 — Controlled Multi-Role Management

Enable operational governance through:

* subject assignment
* delegated permissions
* user approval
* admin oversight

---

## Goal 4 — AI Extensibility

Architecture must support:

* NVIDIA NIM
* Grok fallback
* future providers
* subject-wise model routing

Without requiring major redesign.

---

## Goal 5 — Maintain Low Operational Complexity

Avoid unnecessary infrastructure sprawl.

Prefer:

* unified backend
* simple deployment
* manageable services

---

# Secondary Goals

---

## Goal 6 — Professional UX

Product should feel polished enough for real-world usage.

---

## Goal 7 — Analytics Readiness

Build data structures that support analytics from day one.

---

## Goal 8 — Secure Administration

Administrative actions must be auditable.

---

# Future Goals

---

## Goal 9 — AI Tutor Module

Strict source-grounded tutoring.

---

## Goal 10 — Subjective AI Grading

Evaluate written answers intelligently.

---

## Goal 11 — Learning Intelligence

Potential future:

* weak-topic recommendations
* adaptive testing
* learning plans

---

# 6. Product Scope

# In Scope (Initial Build)

These are included in product architecture.

---

## Authentication

Included:

* invite-only signup
* approved email validation
* login
* role checks
* password reset approval flow

---

## Student Dashboard

Included.

---

## MCQ Module

Fully functional MVP.

Included:

* question import
* exam engine
* scoring
* timers
* answer review
* explanations
* resume support

---

## Admin Platform

Included.

---

## Subject Management

Included.

---

## Role-Based Permissions

Included.

---

## AI Provider Management

Included.

---

## Provider Testing Utility

Included.

---

## Analytics Framework

Included.

---

## Audit Logging

Included.

---

## Theme Support

Included:

* dark mode
* light mode

---

# Visible But Non-Functional Initially

UI present but backend deferred.

---

## AI Chat

Coming Soon.

---

## Chat History

Coming Soon.

---

## Long Answer Exam

Coming Soon.

---

## AI Subjective Grading

Coming Soon.

---

## AI Reveal Answer

Coming Soon.

---

# Out of Scope (Initial MVP)

Explicit exclusions.

---

## Native Mobile App

Not included.

Web only.

---

## Public Signup

Not included.

---

## Open AI Chat

AI will not be general-purpose public assistant.

---

## Social Features

Excluded.

Examples:

* messaging
* groups
* comments
* social feeds

---

## Payment System

Excluded.

Private platform.

---

## Marketplace Features

Excluded.

---

# 7. Assumptions

These assumptions guide architecture.

---

## Assumption 1

Total users remain relatively small.

Approx:

200

---

## Assumption 2

Concurrent AI-heavy usage remains manageable.

Approx:

10–20

---

## Assumption 3

Admins can manage content responsibly.

---

## Assumption 4

Question data can be normalized into consistent schema.

---

## Assumption 5

AI provider APIs remain available.

---

## Assumption 6

Future RAG storage growth remains manageable.

---

## Assumption 7

Subject count remains moderate.

Approx:

7–10 subjects initially.

---

# 8. Constraints

---

## Constraint 1 — Cost Sensitivity

Infrastructure should remain affordable.

---

## Constraint 2 — AI Budget Sensitivity

Free/low-cost AI provider strategy preferred.

Primary plan:

* NVIDIA NIM
* Grok fallback

---

## Constraint 3 — Private Access

Product cannot assume open onboarding.

---

## Constraint 4 — Small Team Development

Architecture should remain maintainable.

---

## Constraint 5 — Minimal UI Philosophy

No over-engineered visual complexity.

---

# 9. User Personas

# Persona 1 — Student

## Profile

Learner preparing for technical/academic subjects.

---

## Needs

* structured exams
* explanations
* progress visibility
* easy navigation
* future AI assistance

---

## Pain Points

* scattered material
* weak practice tools
* poor feedback

---

# Persona 2 — Subject Admin

## Profile

Operational content manager.

---

## Needs

* upload questions
* manage subjects
* manage assigned users
* view analytics if permitted

---

# Persona 3 — Super Admin

## Profile

Platform owner/governor.

---

## Needs

* total control
* admin governance
* provider management
* auditing
* analytics visibility

---

# 10. Role Hierarchy

```text
Super Admin
   ↓
Normal Admin
   ↓
Student
```

Inheritance is NOT automatic.

Permissions explicitly controlled.

---

# 11. Permission Philosophy

Permission model principles:

---

## Principle 1 — Least Privilege

Users get only required access.

---

## Principle 2 — Delegation Control

Super admin can elevate normal admins selectively.

---

## Principle 3 — Server-Enforced Authorization

Client-side permission checks are visual only.

Real authorization must be server-side.

---

## Principle 4 — Auditability

Sensitive actions logged.

---

# 12. Permission Matrix (High Level)

| Capability               | Student | Normal Admin          | Super Admin |
| ------------------------ | ------- | --------------------- | ----------- |
| Login                    | Yes     | Yes                   | Yes         |
| Register if approved     | Yes     | Yes                   | Yes         |
| Take MCQ exams           | Yes     | Optional              | Optional    |
| Resume exams             | Yes     | Optional              | Optional    |
| View dashboard           | Yes     | Yes                   | Yes         |
| Manage users             | No      | Conditional           | Yes         |
| Manage subjects          | No      | Assigned/Conditional  | Yes         |
| Upload MCQ files         | No      | Yes                   | Yes         |
| Upload long-answer files | No      | Yes                   | Yes         |
| Configure AI providers   | No      | No (unless delegated) | Yes         |
| Test providers           | No      | Conditional           | Yes         |
| View analytics           | No      | Conditional           | Yes         |
| Access audit logs        | No      | Conditional           | Yes         |
| Create admins            | No      | No                    | Yes         |
| Manage permissions       | No      | No                    | Yes         |

---

# Chunk 1 Complete

Next:

**Chunk 2 — Authentication & Security**
# AI Study Platform PRD

## Chunk 2 — Authentication & Security

---

# 13. Authentication System

# Authentication Philosophy

The authentication system must support a **private invite-only access model**, not public self-registration.

Primary objectives:

* controlled onboarding
* restricted access
* admin-governed account creation
* role-aware authentication
* secure session management
* low operational complexity

This platform is not intended for anonymous/public use.

---

# Authentication Architecture Goals

The auth system must provide:

* secure login
* role identification
* invite validation
* session persistence
* protected route enforcement
* password reset governance
* audit traceability

---

# Authentication Components

Core components:

* approved email registry
* registration workflow
* login workflow
* session management
* role assignment
* password reset workflow
* logout handling
* middleware protection
* admin approval systems

---

# 14. Registration System

# Registration Model

Registration is **invite-only**.

Users cannot independently create accounts without prior approval.

This means:

NO open signup.

---

# Registration Business Rules

A user may register ONLY IF:

* their email exists in approved email registry
* the invitation remains active
* email has not already been claimed
* account is not blocked

---

# Approved Email Registry

Super admin / authorized admins can add emails to the approval list.

Example:

```text
student1@example.com
student2@example.com
test.user@example.com
```

Each approved record may contain metadata.

Suggested fields:

* email
* invited_by
* invited_at
* invitation_status
* role_to_assign
* allowed_subject_scope (optional)
* notes (optional)

---

# Registration Flow

## Step 1 — Access Registration Page

User opens:

```text
/register
```

System displays:

Invite-only registration UI.

Prompt:

Enter approved email.

---

## Step 2 — Email Validation

User enters:

```text
student@example.com
```

System validates:

* email format valid?
* exists in approved registry?
* already used?
* blocked?
* expired invite?

---

## Validation Outcomes

### Case A — Approved

Response:

Registration may continue.

Proceed to password setup.

---

### Case B — Not Approved

Response:

Access denied.

Example message:

> This email is not approved for registration.

---

### Case C — Already Registered

Response:

Account already exists.

Suggest login.

---

### Case D — Revoked

Response:

Access revoked.

---

### Case E — Expired Invite

If invite expiration feature exists:

Invite invalid.

---

# Step 3 — Password Creation

User creates password.

Rules:

Recommended:

* minimum 8 characters
* uppercase recommended
* lowercase recommended
* number recommended
* special character optional

Configurable policy.

---

# Step 4 — Identity Information

Required:

* first name
* last name

Optional future:

* display name
* avatar

Not required initially.

---

# Step 5 — Account Creation

System:

* creates auth record
* creates profile record
* links approved invite
* assigns role
* logs event

---

# Step 6 — Registration Completion

User redirected to:

```text
/dashboard
```

or login page depending on implementation.

---

# Registration UX Requirements

UI must show:

* invite-only messaging
* validation feedback
* inline errors
* password visibility toggle
* loading state
* success confirmation

---

# Registration Edge Cases

Handle:

* duplicate submission
* network failure
* expired session
* invalid email format
* reused invite
* blocked registration

---

# 15. Login System

# Login Purpose

Authenticate previously registered users.

---

# Login Credentials

Supported:

* email
* password

No username login initially.

---

# Login Flow

## Step 1

User opens:

```text
/login
```

---

## Step 2

Enters:

* email
* password

---

## Step 3

System validates:

* user exists?
* password correct?
* account active?
* access not revoked?
* role valid?

---

## Successful Login

System:

* creates session
* loads permissions
* logs login event
* redirects appropriately

---

# Redirect Logic

Student:

```text
/dashboard
```

Admin:

```text
/admin/dashboard
```

Super Admin:

```text
/admin/dashboard
```

---

# Failed Login Cases

Handle:

---

## Invalid Credentials

Message:

Incorrect email or password.

---

## Disabled Account

Message:

Account disabled.

---

## Revoked Access

Message:

Access revoked.

---

## Session Error

Retry guidance.

---

## Rate Limited

Too many attempts.

Temporary block.

---

# Login UX Requirements

UI should include:

* email field
* password field
* show/hide password
* forgot password link
* loading state
* validation feedback

---

# 16. Session Management

# Session Philosophy

Sessions must be secure, persistent, and role-aware.

---

# Session Requirements

System must:

* persist active sessions
* restore sessions after refresh
* expire invalid sessions
* prevent unauthorized access
* enforce role checks

---

# Session Capabilities

Expected behavior:

---

## Active Session Persistence

User refreshes browser.

Session remains active.

---

## Browser Reopen Persistence

If session valid:

user remains logged in.

---

## Logout Support

Manual logout supported.

---

## Session Expiry

Expired sessions must require re-authentication.

---

## Role-Aware Session State

Session contains:

* user id
* role
* permission set
* subject access scope

---

# Session Storage Principles

Sensitive auth tokens:

server-managed where possible.

Avoid insecure client trust.

---

# Session Edge Cases

Handle:

* expired token
* invalid session
* revoked permissions mid-session
* admin role changes
* session desync

---

# Forced Session Invalidation

System should support invalidating sessions if:

* account disabled
* permissions revoked
* admin removed
* password reset approved and enforced

---

# 17. Logout System

Logout must:

* clear session
* clear cached sensitive state
* revoke active tokens if applicable
* redirect safely

Route:

```text
/logout
```

or action button.

---

# 18. Password Reset System

# Reset Philosophy

Password reset is NOT open self-service.

This is admin-controlled.

Reason:

private controlled platform.

---

# Reset Flow

## Step 1 — User Initiates Request

User clicks:

Forgot Password

---

## Step 2 — Reset Request Form

User enters:

* email
* optional reason/message

Example:

> I forgot my password.

---

## Step 3 — System Validation

Checks:

* account exists?
* active?
* already pending request?

---

# Outcomes

---

## Valid Request

Create pending reset request.

Notify admin queue.

---

## Invalid Email

Generic safe message.

Avoid exposing user existence.

---

## Existing Pending Request

Prevent duplicate spam.

---

# Step 4 — Admin Review

Admin opens:

Password Reset Requests

Views:

* requester
* timestamp
* status
* notes

---

# Step 5 — Admin Decision

Options:

* approve
* reject

Optional:

request clarification

---

# Approved Flow

System:

creates temporary reset authorization.

User can reset password.

---

# Rejected Flow

Request closed.

User informed.

---

# Reset Token Rules

If token-based reset used:

Recommended:

* short expiration
* single use
* revocable

---

# Audit Requirements

Log:

* request created
* admin reviewed
* approved/rejected
* reset completed

---

# Abuse Protection

Prevent:

* spam reset requests
* enumeration abuse
* replay attacks

---

# 19. Role-Based Access Control (RBAC)

# Authorization Philosophy

Authentication proves identity.

Authorization controls capability.

These must remain separate.

---

# Role Model

Three primary roles:

* Student
* Normal Admin
* Super Admin

---

# Permission Model

Permissions should NOT rely solely on role names.

Prefer explicit permission records.

Example:

```text
can_manage_users
can_view_analytics
can_manage_all_subjects
can_test_ai_provider
```

This improves scalability.

---

# Subject Scope Permissions

Normal admins may be limited to specific subjects.

Examples:

Admin A:

* DBMS
* PHP

Admin B:

* DSA
* OS

Optional elevation:

ALL SUBJECT ACCESS

---

# Delegated Permissions

Super admin can delegate:

* analytics access
* provider testing
* broader user management
* audit visibility

---

# Server Enforcement

All sensitive authorization checks MUST occur server-side.

Never trust client-only checks.

---

# 20. Route Protection

# Protected Route Groups

---

## Public Routes

Accessible without auth:

```text
/login
/register
/forgot-password
```

---

## Student Routes

Require authenticated student-compatible role.

Examples:

```text
/dashboard
/mcq
/chat
/long-answer
/settings
```

---

## Admin Routes

Require admin privileges.

Examples:

```text
/admin/dashboard
/admin/users
/admin/subjects
/admin/uploads
```

---

## Super Admin Restricted Routes

Examples:

```text
/admin/providers
/admin/audit
/admin/admins
/admin/global-settings
```

---

# Middleware Responsibilities

Middleware should:

* validate auth session
* identify role
* enforce route access
* redirect unauthorized users
* handle expired sessions

---

# Unauthorized Behavior

Examples:

Student opens admin route:

redirect:

```text
/dashboard
```

Admin opens forbidden super admin route:

redirect:

```text
/admin/dashboard
```

Unauthenticated user:

redirect:

```text
/login
```

---

# 21. Security Requirements

# Security Philosophy

This platform manages:

* user identities
* educational data
* admin governance
* AI credentials
* provider API access

Security is critical.

---

# Core Security Goals

Protect:

* authentication state
* authorization boundaries
* provider secrets
* content uploads
* audit integrity
* admin actions

---

# Authentication Security

Requirements:

---

## Secure Password Storage

Passwords must never be stored plaintext.

Use provider-secure hashing.

---

## Session Security

Sessions must:

* expire properly
* resist tampering
* remain role-aware

---

## Login Rate Limiting

Prevent brute force.

Recommended:

temporary throttling.

---

# Authorization Security

Requirements:

---

## Server-Side Permission Checks

Mandatory.

---

## Route Middleware Enforcement

Mandatory.

---

## API Permission Validation

Every protected API route must validate permissions.

---

# AI Secret Security

Provider credentials:

* NVIDIA API keys
* Grok credentials

Must:

* never expose client-side
* remain server-only
* be encrypted at rest if stored

---

# File Upload Security

Requirements:

---

## Type Validation

Allowed types only.

---

## Size Validation

Prevent oversized abuse.

---

## Schema Validation

Reject malformed content.

---

## Corruption Detection

Reject unreadable files.

---

## Duplicate Detection

Optional but recommended.

---

# Input Security

Protect against:

* injection
* malformed payloads
* dangerous metadata

---

# API Security

Protect:

* provider endpoints
* admin APIs
* upload APIs
* analytics APIs

Measures:

* auth validation
* role checks
* request validation
* rate limiting

---

# CSRF Considerations

Protect state-changing operations appropriately.

---

# XSS Protection

Sanitize user-generated content.

Especially:

* names
* notes
* admin comments
* question text previews

---

# Audit Integrity

Audit logs must not be editable by normal users.

Prefer immutable logging behavior.

---

# Error Message Safety

Avoid leaking sensitive internals.

Bad:

> Invalid password for user X

Good:

> Invalid credentials

---

# User Enumeration Prevention

Forgot password and login responses should avoid exposing account existence unnecessarily.

---

# 22. Audit Logging Requirements

# Audit Philosophy

Administrative traceability is mandatory.

---

# Must Log

Authentication events:

* login
* logout
* failed login
* password reset request
* password reset approval
* password reset completion

---

Admin events:

* admin creation
* admin deletion
* permission changes
* subject assignment
* subject archive
* user disable
* user revoke

---

Provider events:

* config change
* model reassignment
* provider test execution
* provider failure

---

Content events:

* upload
* delete
* update
* import failures

---

# Audit Record Fields

Recommended:

* event id
* actor id
* actor role
* action type
* entity type
* entity id
* timestamp
* metadata
* IP (optional)
* before state (optional)
* after state (optional)

---

# Access Control for Audit Logs

Default:

Super Admin only.

Delegation optional.

---

# 23. Security Non-Functional Expectations

Targets:

* secure auth
* predictable authorization
* reliable session behavior
* strong admin governance
* safe provider secret handling
* audit accountability

---

# Chunk 2 Complete

Next:

**Chunk 3 — Student Platform (Dashboard, Navigation, Chat UI, Settings, Coming Soon Modules)**
# AI Study Platform PRD

## Chunk 3 — Student Platform (Dashboard, Navigation, Settings, Chat UI, Coming Soon Modules)

---

# 24. Student Platform Overview

# Purpose

The student platform is the primary end-user experience.

It must provide a focused academic workflow where users can:

* access assessments
* review progress
* interact with future AI tools
* manage account preferences
* navigate clearly between learning modules

---

# Design Philosophy

Student experience must feel:

* clean
* distraction-free
* structured
* minimal
* professional
* intuitive

Not:

* playful
* crowded
* gamified-heavy
* flashy
* social-app-like

---

# UX Priorities

Primary priorities:

1. fast navigation
2. low cognitive friction
3. clear module separation
4. consistency
5. strong readability
6. responsive layout
7. dark/light usability

---

# Student Platform Initial State

Important implementation rule:

The student platform will contain both:

### Functional modules

and

### UI-visible future modules

Meaning:

Some sections work fully.

Some sections are intentionally “Coming Soon”.

This allows architectural completeness early.

---

# Functional Initially

Included:

* dashboard
* MCQ exam module
* MCQ exam history
* authentication
* profile/settings
* theme switching

---

# UI Only Initially

Visible but non-functional:

* AI Chat
* Chat History
* Long Answer Exams
* Long Answer History
* AI Assistance Tools

All must still look like real product screens.

---

# 25. Student Navigation System

# Navigation Philosophy

Navigation should be simple, predictable, and persistent.

Users should not feel lost.

---

# Navigation Layout

Recommended layout:

Desktop:

left sidebar navigation

Mobile:

collapsible drawer navigation

Topbar:

secondary actions

---

# Primary Navigation Items

Student navigation should include:

```text
Dashboard
MCQ Exams
MCQ History
AI Chat
Chat History
Long Answer Exams
Settings
Logout
```

---

# Optional Future Items

Potential future additions:

```text
Bookmarks
Study Progress
Recommendations
Notifications
```

---

# Sidebar Requirements

Must include:

* platform branding/logo
* nav labels
* icons
* active state highlight
* collapse behavior (optional)
* role-aware rendering

---

# Topbar Requirements

Should include:

* user profile avatar/initial
* theme toggle
* current page title
* quick actions (optional)
* notifications placeholder (future)

---

# Responsive Behavior

Desktop:

persistent sidebar

Tablet:

adaptive sidebar

Mobile:

drawer navigation

---

# Navigation Permissions

Student sees only student routes.

Admin navigation not visible.

---

# Route Awareness

Navigation should indicate:

current active module

Examples:

highlight:

```text
MCQ Exams
```

when user is in:

```text
/mcq
```

---

# 26. Student Dashboard

# Dashboard Purpose

The dashboard is the user’s academic control center.

It provides:

* quick status overview
* recent activity
* performance visibility
* easy navigation to learning tools

---

# Initial Functional Scope

Dashboard will be powered primarily by MCQ data initially.

Future modules expand metrics later.

---

# Dashboard Layout

Recommended sections:

---

## Section 1 — Welcome Header

Displays:

* greeting
* user first name
* contextual message

Example:

> Welcome back, Nitin

Optional dynamic messages:

* Ready for your next exam?
* Continue unfinished attempt?
* Review weak subjects?

---

## Section 2 — Quick Stats Cards

Metrics:

---

### Total Exams Attempted

Example:

```text
18
```

---

### Total Questions Answered

Example:

```text
340
```

---

### Correct Answers

Example:

```text
282
```

---

### Incorrect Answers

Example:

```text
58
```

---

### Accuracy Percentage

Example:

```text
82.9%
```

---

### Average Score

Example:

```text
16.4 / 20
```

---

# UI Requirements

Cards must be:

* clean
* readable
* responsive
* minimal

---

## Section 3 — Recent Activity

Displays:

recent actions.

Examples:

* DBMS exam completed
* PHP MCQ started
* unfinished attempt resumed

---

## Section 4 — Continue Unfinished Attempt

Important due to resume support.

If unfinished exam exists:

show CTA:

```text
Resume Exam
```

Display:

* subject
* remaining questions
* timer state
* last accessed timestamp

---

## Section 5 — Subject Performance Overview

Shows subject-wise metrics.

Examples:

| Subject | Accuracy |
| ------- | -------- |
| DBMS    | 88%      |
| PHP     | 74%      |
| DSA     | 63%      |

---

## Section 6 — Performance Trends

Chart examples:

* accuracy trend
* exam completion trend
* score trend

Initial implementation optional.

Recommended.

---

## Section 7 — Quick Actions

Buttons:

* Start MCQ Exam
* Resume Attempt
* View History
* Open Chat (Coming Soon)

---

# Future Dashboard Expansion

When AI modules activate:

add:

* chat activity
* subjective performance
* AI usage stats
* recommendation widgets

---

# Dashboard Edge Cases

Handle:

---

## No Activity

First-time user state.

Show:

empty-state onboarding.

Example:

> No exam activity yet. Start your first MCQ test.

---

## Unfinished Exam Present

Prioritize resume CTA.

---

## Analytics Loading Failure

Graceful fallback.

---

# 27. MCQ History

# Purpose

Allow students to review previous MCQ attempts.

---

# Functional Requirements

Student can:

* see attempt list
* inspect results
* open detailed review
* filter attempts

---

# Attempt List Fields

Suggested:

* attempt date
* subject
* score
* accuracy
* question count
* timer mode
* completion status

---

# Filters

Recommended:

* subject
* date
* completed / unfinished
* score range (future)

---

# Detailed Attempt Review

Student can open historical attempt.

View:

* every question
* chosen answer
* correct answer
* explanations

Read-only.

---

# Resume Logic Integration

Unfinished attempts should appear clearly.

Status:

```text
In Progress
```

CTA:

```text
Resume
```

---

# 28. AI Chat Module (Coming Soon Initially)

# Initial Product State

Visible UI only.

Backend disabled.

Display:

Coming Soon.

But interface should look realistic.

---

# UI Components Required

Even in placeholder mode:

---

## Chat Sidebar

Displays mock structure:

* recent chats
* subject grouping
* new chat button

---

## Chat Main Panel

Displays:

* empty chat state
* sample prompts
* subject selector
* input area

---

## Input Box

Disabled or visually inactive.

Placeholder:

```text
AI chat will be available soon...
```

---

## Subject Selector

Visual component.

Disabled initially if backend absent.

---

# Coming Soon Presentation

Avoid blank screen.

Better:

centered overlay:

```text
Coming Soon
AI-powered subject chat is under development.
```

---

# Future Functional Requirements

---

## New Chat Flow

Student clicks:

New Chat

Selects subject.

Examples:

* DBMS
* PHP
* DSA

Starts isolated thread.

---

## Message Flow

Student sends query.

AI responds strictly from uploaded subject documents.

---

## Context Rules

Memory isolated per chat thread.

No cross-thread leakage.

---

## Strict Knowledge Bound Rule

AI must not invent unsupported answers.

If unavailable:

```text
Answer not found in provided study material.
```

---

## Subject Isolation

DBMS chat uses DBMS corpus only.

PHP chat uses PHP corpus only.

No cross-subject blending.

---

## Provider Routing

Requests routed based on subject config.

Primary:

NVIDIA NIM

Fallback:

Grok

---

# Future Chat Features

Planned:

* rename chat
* delete chat
* pin chat
* search
* export conversation
* bookmarks

---

# Chat Edge Cases

Future:

* provider unavailable
* timeout
* unsupported model
* no knowledge hit
* malformed response

Must degrade gracefully.

---

# 29. Chat History Module

# Initial State

UI visible only.

Coming Soon.

---

# Placeholder UI

Show realistic history list.

Mock rows:

* DBMS Discussion
* PHP Revision Questions
* Software Engineering Concepts

Disabled interactions acceptable.

---

# Future Functional Scope

Student can:

* browse chat threads
* search
* filter by subject
* rename
* delete
* reopen old chats

---

# Thread Metadata

Recommended:

* title
* subject
* last updated
* message count
* pinned status

---

# 30. Long Answer Module (Coming Soon Initially)

# Initial State

UI present.

Backend disabled.

---

# Placeholder UI Components

Still build:

* subject selector
* question count selector
* timer selector
* answer textarea
* reveal answer button
* submit button

Interactions disabled.

---

# Coming Soon UX

Display:

```text
Long Answer Evaluation Coming Soon
```

Optional explanatory note:

AI grading is under development.

---

# Future Functional Behavior

Student flow:

1. choose subject
2. choose question count (if enabled)
3. choose timer mode
4. begin exam
5. answer questions
6. submit
7. receive grading

---

# Default Rules

Default question count:

```text
2
```

Configurable by admin.

---

# Future Feedback

AI returns:

* score
* conceptual evaluation
* strengths
* weaknesses
* improvements
* ideal answer comparison

---

# Reveal Answer

Student can request ideal AI-generated answer.

---

# 31. Student Settings

# Purpose

Allow students to manage personal preferences and limited account controls.

---

# Settings Sections

Recommended:

* profile
* theme
* security
* notifications (future)

---

# Profile Section

Editable:

---

## First Name

Student may edit.

---

## Last Name

Student may edit.

---

## Display Name (Optional Future)

Not required initially.

---

## Avatar

Optional future.

---

# Security Section

Display:

* email (read-only)
* password reset request CTA

Because direct password editing is NOT open self-service.

---

# Password Reset Access

Button:

```text
Request Password Reset
```

Triggers admin approval flow.

---

# Theme Preferences

Student can switch:

* light
* dark

Preference persists.

---

# Notification Preferences (Future)

Potential:

* exam reminders
* admin notices
* platform updates

Not required initially.

---

# 32. Theme System

# Requirements

Global theme switching.

---

# Modes

Supported:

* Light
* Dark

---

# Persistence

User preference persists across sessions.

---

# Theme Toggle Locations

Recommended:

Topbar

Optional settings redundancy.

---

# Design Requirements

Both themes must support:

* readability
* accessible contrast
* chart compatibility
* consistent spacing

---

# 33. Empty States

Student platform must gracefully handle no-data situations.

Examples:

---

## No Exams Yet

Dashboard message:

> Start your first exam.

---

## No History

History page:

> No exam history available.

---

## No Unfinished Attempts

Hide resume CTA.

---

## Future Module Disabled

Show:

Coming Soon state.

---

# 34. Loading States

All student modules must support:

* skeleton loading
* button loading
* graceful async states

Avoid jarring blank pages.

---

# 35. Error States

Handle:

* failed analytics load
* history fetch failure
* session expiration
* network issues
* timeout conditions

Provide actionable messaging.

---

# 36. Accessibility Requirements

Student platform must support:

* keyboard navigation
* proper focus states
* readable typography
* semantic layout
* accessible contrast

---

# 37. Student Acceptance Criteria

Student platform considered successful if:

---

## Dashboard

User can:

* login
* view stats
* see unfinished exam CTA

---

## Navigation

User can:

* move predictably across modules

---

## MCQ History

User can:

* review attempts
* resume unfinished exams

---

## Settings

User can:

* manage profile basics
* request password reset
* change theme

---

## Future Modules

User sees realistic placeholder experiences instead of dead routes.

---

# Chunk 3 Complete

Next:

**Chunk 4 — MCQ Module (Deep Detailed Specification)**

This will be the biggest and most implementation-heavy section.
# AI Study Platform PRD

## Chunk 4 — MCQ Module (Deep Detailed Specification)

---

# 38. MCQ Module Overview

# Purpose

The MCQ Examination Module is the **primary production-ready functional module** in the initial platform release.

This module is the first real educational workflow that must be fully implemented end-to-end.

It is not a placeholder.

It must be fully usable in production.

---

# Primary Objectives

The MCQ module must provide:

* structured exam generation
* subject-based question delivery
* controlled answer locking
* timer support
* detailed answer explanations
* exam persistence
* resume functionality
* analytics integration
* randomized question distribution
* anti-repeat logic
* high reliability

---

# Product Role

This module serves as:

* MVP academic engine
* primary user engagement driver
* first analytics source
* architecture foundation for later assessment modules

---

# Supported Users

Primary:

Student

Optional (if role allowed):

* admin
* super admin

---

# Core Functional Pillars

1. Question Bank Management
2. Exam Generation
3. Exam Session Engine
4. Timer Engine
5. Answer Lock Engine
6. Scoring Engine
7. Review Engine
8. Resume Engine
9. Anti-Repetition Randomization Engine
10. Analytics Tracking

---

# 39. Question Data Architecture

# Question Philosophy

Questions must be structured, explicit, and explanation-rich.

This is not a simple quiz system.

Educational reinforcement is required.

---

# Mandatory Question Schema

Every MCQ question MUST include:

---

## Core Fields

```text
question
```

Question statement.

---

```text
option_a
option_b
option_c
option_d
```

Four answer options.

Exactly four for MVP.

---

```text
correct_option
```

Single correct answer.

Values:

```text
A
B
C
D
```

---

## Explanation Fields

Mandatory:

```text
explanation_a
explanation_b
explanation_c
explanation_d
```

Each option must include explanation.

---

# Example Record

```json
{
  "question": "What is normalization in DBMS?",
  "option_a": "Reducing redundancy",
  "option_b": "Increasing duplication",
  "option_c": "Encrypting tables",
  "option_d": "Creating indexes",
  "correct_option": "A",
  "explanation_a": "Correct. Normalization reduces redundancy.",
  "explanation_b": "Incorrect. Duplication is usually reduced.",
  "explanation_c": "Incorrect. Encryption is unrelated.",
  "explanation_d": "Incorrect. Indexing is separate."
}
```

---

# Optional Metadata (Recommended)

Future-compatible fields:

```text
difficulty
tags
topic
subtopic
source_file
created_by
version
active_status
```

---

# Question Constraints

Must reject:

* missing options
* multiple correct answers
* missing explanations
* malformed values
* duplicate invalid schema

---

# 40. Question Import System

# Definition

Question import = transforming uploaded admin content into normalized MCQ records.

---

# Purpose

Allow admins to efficiently populate question banks.

---

# Initial Supported Input Methods

Production-ready:

---

## CSV Upload

Recommended primary import method.

---

## JSON Upload

Supported.

---

## Manual Entry

Required.

Admin UI form.

---

# Deferred Formats

Future:

* PDF
* DOCX
* TXT

These are intentionally deferred due to parsing complexity.

---

# CSV Schema Example

```csv
question,option_a,option_b,option_c,option_d,correct_option,explanation_a,explanation_b,explanation_c,explanation_d
```

---

# JSON Schema Example

Array of objects.

---

# Manual Entry Requirements

Admin UI form must support:

* question input
* option inputs
* correct answer selector
* explanation inputs

---

# Import Pipeline

# Step 1 — Upload Reception

System receives file.

---

# Step 2 — File Validation

Validate:

* supported type
* file size
* corruption
* readability

---

# Step 3 — Parsing

Convert file into internal records.

---

# Step 4 — Schema Validation

Validate every row.

Required:

* all mandatory fields
* valid correct answer
* proper formatting

---

# Step 5 — Duplicate Detection

Recommended checks:

* exact duplicate question text
* duplicate source row

Behavior configurable.

---

# Step 6 — Import Preview

Strong recommendation.

Admin sees:

* total detected rows
* valid rows
* invalid rows
* error reasons

---

# Step 7 — Confirmation

Admin confirms import.

---

# Step 8 — Persistence

Questions stored in database.

---

# Step 9 — Question Bank Activation

Imported questions become exam-eligible.

---

# Import Failure Handling

Examples:

---

## Invalid Schema

Message:

Missing required fields.

---

## Corrupt File

Message:

Unreadable file.

---

## Unsupported Type

Message:

File type not supported.

---

## Duplicate Conflict

Message:

Duplicate questions detected.

---

# Import Limits

Per subject:

Maximum:

```text
4 files
```

---

# 41. Subject Question Banks

# Structure

Each subject owns isolated question banks.

Examples:

* DBMS question bank
* PHP question bank
* DSA question bank

---

# Isolation Rules

Questions must not cross subjects.

---

# Bank Metadata

Recommended:

* subject id
* total active questions
* import history
* version metadata

---

# Availability Rules

Questions can be:

* active
* inactive
* archived

---

# 42. Exam Creation Flow

# Student Flow

---

## Step 1 — Open MCQ Module

Route:

```text
/mcq
```

---

## Step 2 — Subject Selection

User selects subject.

Example:

* DBMS
* PHP
* DSA

---

# Validation

Subject must:

* exist
* be active
* contain enough questions

---

## Step 3 — Question Count Selection

Selectable counts:

Examples:

* 10
* 20
* 30
* 50
* custom

---

# Validation Rules

Count must be:

* numeric
* positive
* <= available question pool

---

## Step 4 — Timer Mode Selection

Choose one:

---

### Per Question Timer

OR

---

### Full Exam Timer

---

# Mutual Exclusivity

Only one timer mode active.

---

## Step 5 — Timer Configuration

Example:

Per question:

```text
60 seconds
```

OR

Full exam:

```text
30 minutes
```

---

# Validation

Reject:

* zero
* negative
* malformed

---

## Step 6 — Start Exam

System generates attempt.

---

# 43. Exam Generation Engine

# Purpose

Create exam attempts from question bank.

---

# Inputs

* user id
* subject
* count
* timer config
* prior attempt history

---

# Outputs

Generated exam attempt.

---

# Responsibilities

* fetch eligible questions
* randomize selection
* reduce repetition
* shuffle options
* create attempt record

---

# Generation Logic

---

## Eligibility Filter

Only active questions.

---

## Subject Match

Subject strict.

---

## Count Satisfaction

Must meet requested count.

---

## Anti-Repeat Logic

Reduce repeated recent questions.

Detailed later.

---

## Option Shuffle

Randomize option order.

Important:

Correct answer mapping must update safely.

---

# Persistence

Store generated exam snapshot.

Never depend on live mutable question state during active exam.

Critical for consistency.

---

# 44. Anti-Repetition Randomization Engine

# Objective

Avoid repetitive exam experiences.

---

# Requirements

Every exam must:

* feel different
* reduce consecutive duplication
* avoid predictable sequences

---

# Basic Randomization

Required:

* random question order
* random option order

---

# Advanced Anti-Repeat Logic

Track recent exposure.

Example:

If user recently saw:

Question X

Reduce its selection probability.

---

# Recommended Strategy

Weighted recency exclusion.

Example logic:

Recent attempts:

Last 2 exams:

strong penalty

Last 5 exams:

moderate penalty

Older:

normal eligibility

---

# Fallback Behavior

If insufficient unique pool:

allow controlled repetition.

---

# Constraints

Cannot guarantee zero repeats if pool small.

---

# 45. Exam Session Engine

# Purpose

Manage active exam lifecycle.

---

# Session State

Track:

* attempt id
* user id
* subject
* current question
* timer state
* locked answers
* completion state

---

# States

Possible:

```text
created
in_progress
paused
completed
expired
abandoned
```

---

# Lifecycle

Created → In Progress → Completed

Or

Created → In Progress → Paused → Resumed

---

# Question Rendering

One question at a time.

---

# UI Components

Required:

* question text
* four options
* timer
* next
* previous
* progress indicator
* explanation panel

---

# 46. Answer Lock Engine

# Core Rule

Once student selects an answer:

LOCK permanently.

---

# Meaning

Allowed:

* revisit question
* inspect answer
* read explanation

Not allowed:

* change answer
* deselect
* replace answer

---

# Lock Trigger

Selection confirmation.

---

# Lock Storage

Persist immediately.

Avoid client-only trust.

---

# Timeout Lock Behavior

If timer expires before answer:

system marks unanswered.

Moves forward.

---

# UI Rules

Locked question must clearly indicate:

* answer chosen
* status locked

---

# Edge Cases

Prevent:

* browser back exploit
* API replay overwrite
* client mutation hacks

---

# 47. Navigation Rules

# Allowed Navigation

Students may:

* move next
* move previous
* revisit prior questions

---

# Disallowed Behavior

No answer editing.

---

# Question Navigation UX

Recommended:

progress index:

Example:

```text
Question 4 of 20
```

---

Optional:

question navigator grid.

Future enhancement.

---

# 48. Timer Engine

# Supported Modes

Exactly two.

---

## Mode A — Per Question Timer

Timer resets per question.

---

# Behavior

Start timer on question load.

If expires:

* question locks
* unanswered if blank
* auto move next

---

# Edge Cases

Handle:

* browser refresh
* reconnect
* resume

---

## Mode B — Full Exam Timer

Single global countdown.

---

# Behavior

Countdown starts at exam start.

If expires:

auto submit.

---

# Persistence

Timer state must persist server-side.

---

# Validation

Reject invalid timer configs.

---

# 49. Resume Engine

# Core Requirement

Unfinished attempts resumable.

---

# Purpose

Prevent frustration.

Support interruptions.

---

# Resume Eligibility

Attempt must be:

* unfinished
* valid
* not expired irrecoverably

---

# Resume Behavior

Restore:

* question position
* locked answers
* timer state
* completion progress

---

# Resume Entry Points

Dashboard:

Resume CTA

MCQ history:

Resume action

---

# Resume Restrictions

Completed exams cannot resume.

---

# Expired Timer Handling

If resumed after expiry:

auto finalize appropriately.

---

# 50. Scoring Engine

# Rules

Correct:

+1

Wrong:

0

Unanswered:

0

---

# No Negative Marking

Explicit requirement.

---

# Score Outputs

Calculate:

* raw score
* percentage
* correct count
* incorrect count
* unanswered count

---

# Example

20 questions

16 correct

3 wrong

1 unanswered

Result:

```text
Score: 16/20
Accuracy: 80%
```

---

# 51. Feedback Engine

# Educational Goal

Feedback must reinforce learning.

---

# Wrong Answer Flow

Immediately show:

* selected option red
* correct option green
* explanation for ALL options

---

# Correct Answer Flow

Show:

green correct state

Button:

Reveal Explanation

Then show all explanations.

---

# UX Requirements

Feedback must be:

* readable
* immediate
* educational
* uncluttered

---

# 52. Exam Completion Engine

# Completion Triggers

Exam completes when:

* all questions processed
* full timer expires
* manual submit

---

# Confirmation

Manual submit may confirm:

Submit exam?

---

# Finalization Actions

System:

* freeze attempt
* calculate score
* persist metrics
* update analytics
* mark complete

---

# 53. Result Screen

# Required Information

Show:

* score
* percentage
* correct
* wrong
* unanswered
* short performance summary

---

# Example Summary

> Strong DBMS fundamentals. Review normalization edge cases.

---

# Actions

Buttons:

* detailed review
* dashboard
* new exam

---

# 54. Detailed Review Engine

# Purpose

Deep post-exam learning.

---

# View Includes

Every question:

* question
* chosen answer
* correct answer
* explanation set

---

# Read-Only

No editing.

---

# Filters (Future)

Potential:

* wrong only
* unanswered only

---

# 55. Analytics Integration

Track:

* attempt creation
* completion
* score
* subject performance
* timer mode usage
* duration
* accuracy

---

# 56. Edge Cases

Must handle:

---

## Insufficient Questions

Requested count > pool.

Reject gracefully.

---

## Timer Desync

Recover from persisted state.

---

## Network Drop

Resume supported.

---

## Duplicate Submit

Prevent double scoring.

---

## Client Tampering

Server validation mandatory.

---

## Deleted Questions Mid-Exam

Exam snapshot isolation protects consistency.

---

# 57. Acceptance Criteria

Module successful if:

Student can:

* select subject
* configure exam
* start exam
* answer questions
* receive locking behavior
* navigate freely
* see explanations
* complete exam
* resume interrupted exam
* review results
* inspect detailed review

Admin can:

* import questions
* manage question availability

System can:

* randomize responsibly
* preserve integrity
* prevent answer mutation

---

# Chunk 4 Complete

Next:

**Chunk 5 — Long Answer Module (Future Functional Spec)**
# AI Study Platform PRD

## Chunk 5 — Long Answer Module (Future Functional Specification)

---

# 58. Long Answer Module Overview

# Purpose

The Long Answer Module is the platform’s future subjective assessment engine.

Unlike the MCQ module, which evaluates structured objective answers, this module evaluates written responses using AI.

This module is not part of the initial fully functional MVP backend, but its complete product specification must be defined from the beginning.

---

# Product Role

This module will serve as:

* subjective exam preparation tool
* conceptual answer evaluation engine
* written communication assessment layer
* AI-assisted academic review workflow

---

# Educational Objectives

Students should be able to:

* practice long-form answers
* improve conceptual clarity
* compare their answers with ideal answers
* receive constructive evaluation
* identify weak writing areas

---

# Design Philosophy

The module should feel:

* serious
* academic
* focused
* professional
* structured

Not:

* chat-like
* casual
* entertainment-focused

---

# Initial Product State

During early implementation:

UI visible

Backend disabled

Display:

**Coming Soon**

---

# Future Fully Functional State

Once activated:

fully operational subjective assessment system.

---

# 59. Long Answer Content Architecture

# Question Source Philosophy

Long-answer questions are admin-managed.

Questions are not generated randomly by AI from arbitrary knowledge.

They come from curated uploaded content.

---

# Content Source Rules

Each subject will contain uploaded question sets.

Examples:

* DBMS long questions
* Software Engineering long questions
* PHP theory questions

---

# File Limits

Per subject:

Maximum:

```text id="n3n56w"
4 files
```

---

# Supported Formats (Planned)

Initially recommended:

* CSV
* JSON
* manual entry

Future:

* PDF
* DOCX
* TXT

---

# Minimum Required Question Schema

Required:

```text id="gsry6r"
question
```

Optional future:

```text id="sr74xu"
difficulty
tags
topic
subtopic
source
```

---

# Example Record

```json id="jjlwm6"
{
  "question": "Explain normalization in DBMS with all normal forms."
}
```

---

# Answer Storage Philosophy

Prewritten answers are NOT required.

The AI generates ideal answers dynamically.

This is an intentional design decision.

---

# 60. Long Answer Exam Configuration

# Default Configuration

Default question count:

```text id="jlwm2l"
2
```

---

# Admin Control

Super admin can configure:

* default count
* maximum allowed count
* whether students may customize count

---

# Example Scenarios

---

## Scenario A

Students always receive exactly:

2 questions.

No customization.

---

## Scenario B

Students may choose:

2 / 3 / 5

within configured limits.

---

# Hard Limits

Admin-configurable hard maximum.

Example:

```text id="wb8vka"
5
```

---

# Validation Rules

Reject:

* zero
* negative values
* above configured maximum
* non-numeric values

---

# Subject Selection

Students must choose subject first.

Validation:

Subject must:

* exist
* be active
* contain question pool

---

# Question Selection Logic

Questions selected randomly.

Requirements:

* subject isolation
* reduced immediate repetition
* fairness

---

# Anti-Repetition Logic

Should mirror MCQ principles:

* recency-aware weighting
* reduced repeated exposure
* fallback if pool limited

---

# 61. Long Answer Timer Engine

# Supported Modes

Exactly two.

---

## Mode A — Per Question Timer

Each question has independent timer.

Example:

```text id="0q8vvq"
10 minutes/question
```

---

# Behavior

Timer starts when question becomes active.

On expiry:

Question locks.

User proceeds.

---

# Unanswered Expiry

If blank:

mark unanswered.

---

## Mode B — Full Batch Timer

Single timer for full exam.

Example:

```text id="m98nri"
30 minutes total
```

---

# Behavior

Countdown starts at exam start.

Expiry triggers:

auto submission.

---

# Mutual Exclusivity

Only one timer mode active.

---

# Admin Configurability

Super admin may:

* enable both modes
* disable one mode
* define defaults

---

# Validation

Reject:

* zero timers
* invalid durations
* malformed values

---

# 62. Long Answer Student Flow

# Step 1 — Open Module

Route:

```text id="8k7ljf"
/long-answer
```

---

# Step 2 — Subject Selection

Student chooses subject.

Example:

* DBMS
* PHP
* DSA

---

# Step 3 — Question Count

If configurable:

student selects count.

Else:

system uses default.

---

# Step 4 — Timer Mode

Student chooses allowed timer mode.

---

# Step 5 — Start Exam

System creates attempt.

Questions generated.

---

# Step 6 — Answer Writing

Student sees question.

Writes response.

---

# UI Requirements

Provide:

* readable question panel
* large writing textarea/editor
* character count (optional)
* progress indicator
* timer
* next/previous navigation
* reveal answer button
* submit controls

---

# Step 7 — Submission

Student submits exam.

---

# Step 8 — AI Evaluation

AI grades answers.

---

# Step 9 — Result Review

Student receives evaluation.

---

# 63. Answer Writing Interface

# Requirements

Writing experience should feel comfortable for longer responses.

---

# Editor Requirements

Must support:

* multiline writing
* paste support
* keyboard navigation
* autosave (recommended)
* character counting (optional)

---

# Future Enhancements

Optional:

* rich text
* markdown support
* formatting toolbar

Not required initially.

---

# Autosave

Strongly recommended.

Reason:

prevents answer loss.

---

# 64. Reveal Answer System

# Purpose

Students may need guided learning when stuck.

---

# Trigger

Button:

```text id="s3b36k"
Reveal Answer
```

---

# Behavior

Student clicks reveal.

System requests AI-generated ideal answer.

---

# AI Response

Generated answer should be:

* academically structured
* subject-appropriate
* high quality
* conceptually correct
* readable

---

# Important Rule

Reveal answer is generated dynamically.

NOT prewritten database answer.

---

# Tracking

Analytics should log:

Reveal usage.

---

# Optional Future Restrictions

Potential admin controls:

* disable reveal
* limit reveals
* reveal only after submission

Not required initially.

---

# 65. AI Evaluation Engine

# Purpose

Evaluate subjective written answers.

---

# Core Responsibilities

AI should assess:

* conceptual correctness
* completeness
* clarity
* relevance
* structure
* quality of explanation

---

# Evaluation Inputs

* question
* student answer
* subject
* configured model
* grading instructions

---

# Evaluation Outputs

Structured response.

---

# Required Feedback Fields

---

## Score

Example:

```text id="3ah0t8"
7.5 / 10
```

or configured scale.

---

## Conceptual Accuracy

Assessment.

---

## Strengths

Examples:

* strong explanation
* correct terminology

---

## Weaknesses

Examples:

* missed normalization forms
* incomplete examples

---

## Suggestions

Improvement guidance.

---

## Ideal Answer Comparison

Comparison with model response.

---

# Output Format

Structured cards preferred.

Avoid raw AI blob text.

---

# 66. AI Grading Consistency Rules

# Requirements

AI grading should feel reasonably consistent.

---

# Prompt Strategy

Evaluation prompts should define:

* scoring expectations
* grading rubric
* response format
* subject framing

---

# Subject Sensitivity

Different subjects may require different grading styles.

Examples:

DBMS vs PHP vs DSA.

---

# Model Routing

Use subject-specific AI configuration.

Primary:

NVIDIA NIM

Fallback:

Grok

---

# Failure Handling

If primary fails:

fallback provider invoked.

---

# Error States

Handle:

* timeout
* provider unavailable
* malformed AI output
* authentication errors
* unsupported model

---

# Graceful Degradation

If grading fails:

inform user clearly.

Avoid silent failure.

---

# 67. Long Answer Attempt Engine

# Session States

Track:

```text id="ik4zcb"
created
in_progress
paused
completed
expired
abandoned
grading
graded
```

---

# Attempt Metadata

Track:

* subject
* question count
* timer config
* answers
* timestamps
* reveal usage
* grading results

---

# Resume Support

Recommended.

Not explicitly mandatory but highly beneficial.

Strong suggestion:

mirror MCQ resume behavior.

---

# State Persistence

Persist:

* current question
* written responses
* timer state
* reveal state

---

# 68. Navigation Rules

Students may:

* move next
* move previous
* revisit questions
* edit answers until submission or timer expiry

Unlike MCQ:

editing remains allowed.

---

# Lock Rules

Answers remain editable until:

* submission
  OR
* timer expiry

---

# Expiry Behavior

Expired question:

locks editing.

---

# 69. Result Screen

# Required Sections

Show:

---

## Overall Score

Example:

```text id="0y4ijm"
16 / 20
```

or equivalent scale.

---

## Performance Summary

Narrative feedback.

---

## Per-Question Review

Each question:

* question text
* student answer
* AI evaluation
* score
* strengths
* weaknesses
* suggestions
* ideal answer

---

# Actions

Buttons:

* dashboard
* retry
* new attempt

---

# 70. Analytics Integration

Track:

* attempts started
* attempts completed
* scores
* reveal usage
* timer mode usage
* subject performance
* grading failures
* average answer quality

---

# 71. Admin Controls

Super admin controls:

---

## Question Count Controls

* default count
* hard maximum
* configurability toggle

---

## Timer Controls

* enable per-question timer
* enable batch timer
* set defaults

---

## Reveal Controls (Future)

* allow reveal
* disable reveal
* conditional reveal

---

## Provider Controls

Use configured subject AI routing.

---

# Delegation

Normal admin may receive relevant permissions.

---

# 72. Placeholder UI Requirements (Initial State)

Before backend implementation:

UI must still look production-ready.

Build:

* subject selector
* question count selector
* timer controls
* textarea
* reveal answer button
* submit button
* results mock layout

Display:

**Coming Soon**

---

# 73. Edge Cases

Handle:

---

## Empty Subject Pool

No questions available.

---

## AI Timeout

Clear retry messaging.

---

## Invalid Provider Config

Admin configuration error surfaced safely.

---

## Reveal Failure

Graceful fallback.

---

## Browser Close

Resume if implemented.

---

## Submission During Timeout Race

Prevent duplicate grading.

---

# 74. Acceptance Criteria

Module considered complete if:

Students can:

* choose subject
* configure exam
* write answers
* use timer modes
* request reveal answer
* submit responses
* receive structured grading
* review detailed feedback

Admins can:

* manage question pools
* configure controls
* govern provider behavior

System can:

* route AI requests
* fallback safely
* persist attempts
* generate meaningful feedback

---

# Chunk 5 Complete

Next:

**Chunk 6 — Admin Platform (Super Admin, Normal Admin, Users, Subjects, Analytics, Audit, Provider Controls)**
# AI Study Platform PRD

## Chunk 6 — Admin Platform (Super Admin, Normal Admin, Users, Subjects, Analytics, Audit, Provider Controls)

---

# 75. Admin Platform Overview

# Purpose

The admin platform is the governance and operational control layer of the entire application.

This is where administrative users manage:

* platform access
* subjects
* question banks
* AI provider configuration
* analytics
* permissions
* audit visibility
* system operations

---

# Admin Platform Philosophy

The admin experience must be:

* professional
* operationally efficient
* secure
* structured
* uncluttered
* role-aware

It should feel like a modern SaaS operations dashboard.

Not:

* consumer app UI
* decorative interface
* over-designed admin tooling

---

# Initial Product State

Important distinction:

Admin platform UI should be built comprehensively.

However:

functional depth may follow implementation workflow.

Meaning:

UI-first structure, backend progressively activated.

---

# Admin Platform User Types

Supported administrative roles:

---

## Super Admin

Full governance authority.

---

## Normal Admin

Restricted authority.

---

# Access Rules

Students must never access admin routes.

Unauthorized access attempts redirected.

---

# 76. Admin Navigation

# Recommended Sidebar Navigation

Admin sidebar should include:

```text id="6ycj8x"
Dashboard
Users
Approved Emails
Admins
Subjects
MCQ Content
Long Answer Content
AI Providers
Analytics
Audit Logs
Settings
Logout
```

---

# Role-Aware Rendering

Not every admin sees all items.

Examples:

Normal admin may NOT see:

```text id="07wfg4"
Admins
AI Providers
Audit Logs
```

unless delegated.

---

# Topbar Features

Recommended:

* page title
* profile dropdown
* theme toggle
* breadcrumbs
* alerts
* pending actions badge

---

# Responsive Behavior

Desktop:

persistent sidebar

Tablet/mobile:

drawer navigation

---

# 77. Super Admin Role

# Purpose

Super admin is the highest authority.

Owns complete platform governance.

---

# Core Capabilities

Super admin can:

* manage admins
* manage users
* manage approved registrations
* manage subjects
* upload content
* configure AI
* assign permissions
* delegate access
* access analytics
* access audit logs
* manage password reset approvals
* override restrictions

---

# Governance Philosophy

Super admin should be capable of full operational recovery.

Meaning:

even if other admins are misconfigured.

---

# 78. Normal Admin Role

# Purpose

Operational delegated administrator.

---

# Default Scope

Normal admin manages assigned domains.

---

# Core Capabilities

Depending on permissions:

* manage assigned subjects
* upload MCQ questions
* manage long-answer questions
* review users
* handle password requests
* view analytics if granted
* run provider tests if granted

---

# Default Restrictions

Normal admin cannot:

* create super admins
* delete super admins
* modify global provider settings
* access unrestricted audit logs
* override governance controls

---

# Optional Elevated Access

Super admin may grant:

---

## All Subject Access

Normal admin manages all subjects.

---

## Analytics Access

Access analytics dashboards.

---

## Provider Test Access

May test provider health.

---

## Audit Access

Selective if required.

---

# 79. Permission Delegation System

# Philosophy

Permissions should be granular, not role-name hardcoded only.

---

# Recommended Permission Examples

```text id="bptwws"
can_manage_users
can_manage_subjects
can_manage_all_subjects
can_view_analytics
can_test_ai_provider
can_manage_password_requests
can_view_audit_logs
```

---

# Delegation Rules

Super admin can:

grant

revoke

modify

permissions dynamically.

---

# Subject-Specific Permissions

Normal admin may have:

Example:

```text id="rv3m0w"
DBMS
PHP
DSA
```

only.

---

# Mixed Permission Example

Admin may:

manage users

manage assigned subjects

view analytics

but NOT provider configs.

---

# 80. Admin Dashboard

# Purpose

Operational visibility center.

---

# Required Metrics

Show:

---

## User Metrics

* total users
* active users
* disabled users
* pending approvals

---

## Admin Metrics

* total admins
* restricted admins
* elevated admins

---

## Subject Metrics

* total subjects
* active subjects
* archived subjects

---

## Content Metrics

* total MCQ questions
* long-answer question count
* recent uploads

---

## Provider Health

Show provider statuses.

Examples:

```text id="m23e7k"
NVIDIA NIM: Healthy
Grok: Warning
```

---

## Reset Queue

Pending password reset requests.

---

## Audit Snapshot

Recent sensitive actions.

---

# Quick Actions

Buttons:

* Add User
* Add Admin
* Add Subject
* Upload Questions
* Test Provider

---

# 81. User Management

# Purpose

Manage student access lifecycle.

---

# Core Actions

Admins (if permitted) can:

* search users
* view user profiles
* disable users
* re-enable users
* revoke access
* inspect activity

---

# User List Fields

Recommended:

* name
* email
* role
* status
* created date
* last login
* assigned subjects (if relevant)

---

# User Statuses

Examples:

```text id="1b4x0o"
active
disabled
revoked
pending_reset
```

---

# User Detail View

Recommended data:

* profile info
* registration date
* last activity
* exam statistics
* reset history

---

# Actions

Buttons:

* Disable
* Enable
* Revoke
* View Analytics
* Approve Reset

---

# Safety Rules

Disabling user:

blocks access immediately.

---

# Revocation

Removes platform access.

---

# Audit Logging

Mandatory.

---

# 82. Approved Email Management

# Purpose

Control invite-only registration.

---

# Core Actions

Admins (if allowed) can:

* add approved email
* remove approved email
* revoke invitation
* inspect usage

---

# Fields

Recommended:

* email
* invited by
* invite date
* status
* claimed?
* assigned role

---

# Statuses

Examples:

```text id="4f4gdx"
approved
claimed
revoked
expired
```

---

# Validation

Reject:

* duplicate approved email
* malformed email

---

# 83. Admin Management

# Super Admin Only

---

# Core Actions

* create admin
* edit admin
* disable admin
* delete admin
* assign permissions
* assign subject access

---

# Admin Creation Flow

---

## Step 1

Enter:

* name
* email

---

## Step 2

Assign role:

Normal Admin

---

## Step 3

Assign permissions.

---

## Step 4

Assign subjects.

---

## Step 5

Activate account.

---

# Admin Detail View

Show:

* permissions
* subject access
* activity
* status

---

# Safety Rules

Prevent:

super admin accidental self-destruction without safeguards.

---

# Audit Logging

Mandatory.

---

# 84. Subject Management

# Purpose

Academic domain management.

---

# Core Actions

Admins (if permitted) can:

* create subject
* edit subject
* archive subject
* deactivate subject
* assign admins
* upload content

---

# Example Subjects

```text id="9d4fpf"
DBMS
Software Engineering
PHP
DSA
OS
CN
OOP
```

---

# Subject Fields

Recommended:

* name
* code
* description
* status
* created date
* assigned admins

---

# Subject Statuses

Examples:

```text id="j5e3tb"
active
inactive
archived
```

---

# Visibility Rules

Inactive subject hidden from students.

---

# Archive Rules

Archived subject preserved historically.

Not exam-selectable.

---

# 85. MCQ Content Management

# Purpose

Question bank governance.

---

# Core Actions

Admins (if allowed):

* upload files
* import questions
* manual add
* edit questions
* deactivate questions
* delete questions

---

# Views

Recommended:

---

## Question Bank List

By subject.

---

## Question Table

Columns:

* question preview
* correct answer
* topic
* status
* source file

---

# Import Tools

Support:

* CSV
* JSON
* manual entry

---

# Import Preview

Recommended.

Shows:

* valid rows
* invalid rows
* duplicate warnings

---

# Editing

Admins should be able to manually fix imported questions.

Strongly recommended.

---

# Bulk Actions

Optional:

* bulk activate
* bulk deactivate
* bulk delete

---

# Limits

Per subject:

4 files

---

# 86. Long Answer Content Management

# Purpose

Manage subjective question banks.

---

# Core Actions

* upload question files
* manual add questions
* edit questions
* deactivate
* delete

---

# File Limits

Per subject:

4 files

---

# Schema

Minimum:

question text

---

# Future Metadata

Optional:

* difficulty
* topic
* tags

---

# 87. Password Reset Management

# Purpose

Admin-governed reset workflow.

---

# Queue View

Display:

* requester
* email
* request time
* status
* notes

---

# Actions

* approve
* reject

---

# Approval Behavior

System creates reset authorization.

---

# Rejection Behavior

Closes request.

---

# Expiration

Reset authorization should expire.

---

# Audit

Mandatory.

---

# 88. Analytics Platform

# Access Model

Default:

Super admin only.

Delegation optional.

---

# Analytics Categories

---

## Platform Analytics

* user growth
* activity
* subject usage
* exam trends

---

## Exam Analytics

* scores
* completion
* timer usage
* accuracy

---

## Subject Analytics

* performance by subject
* weak areas

---

## User Analytics

Individual drilldown.

Examples:

* attempts
* accuracy
* progress trends
* usage frequency

---

# Export (Future)

Optional:

CSV/PDF export.

---

# 89. Audit Logs

# Purpose

Operational traceability.

---

# Log Categories

---

## Authentication

* login
* logout
* failed login

---

## User Management

* disable
* revoke
* restore

---

## Admin Management

* create
* edit
* delete
* permission changes

---

## Subject Management

* create
* edit
* archive
* deactivate

---

## Content

* uploads
* edits
* deletes
* import failures

---

## AI Provider

* config change
* model reassignment
* tests

---

## Password Reset

* request
* approval
* rejection
* completion

---

# Log Viewer

Fields:

* timestamp
* actor
* action
* entity
* metadata

---

# Access

Super admin default.

Delegated optional.

---

# 90. Settings / Governance

# Super Admin Settings

Potential controls:

---

## Long Answer Defaults

* question count
* max limit
* configurability

---

## Timer Defaults

MCQ:

* defaults
* allowed ranges

Long answer:

* defaults
* allowed ranges

---

## Provider Defaults

* primary provider
* fallback provider

---

## Permission Defaults

* admin defaults
* invite defaults

---

# 91. Admin UX Requirements

Must feel:

* clean
* fast
* enterprise-like
* reliable

---

# Requirements

* search
* filters
* pagination
* loading states
* confirmation modals
* empty states

---

# Destructive Action Safety

Require confirmation for:

* delete
* revoke
* archive
* disable

---

# 92. Edge Cases

Handle:

---

## Duplicate Subject Creation

Reject safely.

---

## Disabled Admin Active Session

Invalidate access.

---

## Permission Revoked Mid-Session

Re-evaluate permissions.

---

## Broken Imports

Clear error reporting.

---

## Missing Analytics Data

Graceful fallback.

---

## Unauthorized Escalation Attempts

Block + audit.

---

# 93. Acceptance Criteria

Admin platform complete when:

Super admin can:

* govern full platform
* manage admins
* manage providers
* access analytics
* inspect audits

Normal admin can:

* operate within granted permissions

System can:

* enforce role boundaries
* audit sensitive actions
* govern users/content safely

---

# Chunk 6 Complete

Next:

**Chunk 7 — AI Architecture (Providers, NVIDIA NIM, Grok Fallback, Provider Testing, Future RAG Design)**
# AI Study Platform PRD

## Chunk 7 — AI Architecture (Providers, NVIDIA NIM, Grok Fallback, Provider Testing, Future RAG Design)

---

# 94. AI Architecture Overview

# Purpose

The AI architecture enables future intelligent academic features while maintaining operational control, provider flexibility, and cost-conscious deployment.

AI is not treated as a single hardcoded dependency.

It is treated as a configurable infrastructure layer.

---

# AI Responsibilities Across Product

Planned AI responsibilities:

---

## Current / Near-Term

* provider connectivity validation
* provider testing
* model routing infrastructure

---

## Future

* long-answer evaluation
* ideal answer generation
* strict subject chat
* future study intelligence

---

# Core Design Principles

AI architecture must be:

* provider-agnostic
* configurable
* resilient
* diagnosable
* permission-governed
* subject-aware
* cost-aware

---

# AI Architecture Philosophy

Never tightly couple the platform to one provider.

Reason:

providers change

models deprecate

free endpoints disappear

API policies shift

---

# Solution

Use abstraction.

---

# 95. Supported Providers

# Primary Provider

## NVIDIA NIM

Primary AI provider.

Reason:

* cost-conscious strategy
* free-tier potential
* model variety
* future flexibility

---

# Secondary / Fallback Provider

## Grok

Fallback provider.

Used when:

* NVIDIA unavailable
* primary model fails
* endpoint timeout
* authentication issue
* configured fallback explicitly needed

---

# Future Expandability

Architecture should support adding:

* OpenAI
* Gemini
* Anthropic
* OpenRouter
* local inference
* custom providers

Without architectural redesign.

---

# 96. Provider Abstraction Layer

# Purpose

Decouple application logic from provider-specific APIs.

---

# Problem Without Abstraction

Bad architecture:

```text id="sl2ymp"
long-answer module directly calls NVIDIA API
chat module directly calls Grok API
```

Problems:

* hard to switch providers
* duplicated logic
* messy fallback handling
* testing complexity

---

# Correct Architecture

Application logic calls provider manager.

Provider manager chooses implementation.

---

# Conceptual Structure

```text id="0jk34v"
App Modules
   ↓
AI Provider Manager
   ↓
Provider Adapter Layer
   ↓
NVIDIA Adapter
Grok Adapter
Future Adapters
```

---

# Benefits

* maintainability
* testability
* flexibility
* clean failover
* easier diagnostics

---

# 97. Provider Adapter Responsibilities

Each provider adapter should encapsulate provider-specific behavior.

---

# Responsibilities

Adapters manage:

* auth formatting
* endpoint URLs
* request schema
* response parsing
* timeout handling
* error normalization
* model validation
* connectivity testing

---

# Example NVIDIA Adapter Responsibilities

* API key auth
* endpoint request formatting
* model routing
* inference parsing

---

# Example Grok Adapter Responsibilities

* auth formatting
* request payload conversion
* fallback inference handling

---

# Standardized Adapter Interface

Conceptually:

```text id="d0ml1r"
testConnection()
runInference()
validateModel()
normalizeError()
```

---

# Requirement

Application modules should never directly depend on provider-specific payload shapes.

---

# 98. Provider Manager

# Purpose

Central orchestration layer.

---

# Responsibilities

Provider manager decides:

* which provider to call
* which model to use
* when fallback activates
* how errors surface

---

# Inputs

* subject
* feature type
* configured provider rules
* operation type

Examples:

```text id="z4qkvx"
chat
grading
reveal_answer
provider_test
```

---

# Outputs

Normalized AI result.

---

# Example Flow

Student requests:

DBMS long-answer grading.

Provider manager checks:

DBMS config:

Primary:
NVIDIA + model X

Fallback:
Grok + model Y

Attempts primary.

If fail:

attempt fallback.

---

# 99. Subject-Specific AI Routing

# Requirement

AI configuration must be subject-aware.

---

# Reason

Different academic domains may benefit from different models.

Examples:

---

## DBMS

General reasoning model.

---

## PHP

Code-aware model.

---

## DSA

Logic-heavy model.

---

## Software Engineering

Balanced conceptual model.

---

# Configuration Model

Per subject:

```text id="p0v60u"
primary_provider
primary_model
fallback_provider
fallback_model
```

---

# Admin Control

Super admin configures.

Optional delegated visibility.

---

# Example Configuration

DBMS:

```text id="i9a1ee"
NVIDIA
JLM 4.7
Fallback: Grok Model A
```

PHP:

```text id="ww1n3m"
NVIDIA Code Model
Fallback: Grok Model B
```

---

# Validation

Reject invalid provider-model pairings.

---

# 100. Provider Testing Utility

# Purpose

Critical operational diagnostics tool.

---

# Problem Solved

Without provider testing:

admin cannot distinguish:

* API key issues
* backend integration bugs
* invalid models
* endpoint failures
* provider outages

---

# Solution

Dedicated provider test utility.

---

# UI Flow

Admin opens:

AI Providers

Selects:

* provider
* model
* credentials/config

Clicks:

```text id="9b0h79"
Test Provider
```

---

# System Behavior

Runs real connectivity validation.

---

# Required Checks

---

## Check 1 — API Credentials

Valid?

---

## Check 2 — Endpoint Reachability

Reachable?

---

## Check 3 — Authentication

Accepted?

---

## Check 4 — Model Availability

Model exists?

---

## Check 5 — Inference Execution

Can actual inference succeed?

---

## Check 6 — Adapter Health

Internal integration functioning?

---

# Success Response

Examples:

```text id="gb8l27"
Connection successful
Model reachable
Authentication valid
Inference successful
```

---

# Failure Diagnostics

Must be explicit.

Examples:

---

## Invalid API Key

```text id="rm5f6w"
Authentication failed
```

---

## Timeout

```text id="k1yj2u"
Provider timeout
```

---

## Invalid Model

```text id="tk4u0u"
Selected model unavailable
```

---

## Endpoint Down

```text id="hr0sqn"
Provider unreachable
```

---

## Internal Backend Issue

```text id="1knpjv"
Adapter execution failure
```

---

# Audit Logging

Test executions logged.

---

# Permission Model

Default:

Super admin

Optional delegation.

---

# 101. AI Error Normalization

# Problem

Providers return inconsistent errors.

Examples:

* auth failures
* schema failures
* throttling
* malformed outputs

---

# Requirement

Normalize provider errors into internal standard types.

---

# Example Internal Types

```text id="q1krho"
AUTH_ERROR
TIMEOUT
MODEL_NOT_FOUND
RATE_LIMITED
INVALID_RESPONSE
PROVIDER_UNAVAILABLE
INTERNAL_FAILURE
```

---

# Benefits

* consistent UI messaging
* simpler retry logic
* easier analytics

---

# 102. Retry and Fallback Strategy

# Retry Philosophy

Not every failure should instantly fallback.

---

# Suggested Rules

---

## Retry Candidate Errors

Transient:

* timeout
* network hiccup
* provider temporary unavailable

---

## Non-Retry Errors

Immediate fail:

* invalid API key
* invalid model
* malformed config

---

# Fallback Activation

Trigger fallback if:

primary unavailable

OR

primary transient failure persists.

---

# Example Flow

1. primary attempt
2. retry if transient
3. fallback if failure persists
4. normalized response

---

# 103. Long Answer AI Workflow

Future functional flow.

---

# Evaluation Request

Student submits answer.

System provides:

* question
* student answer
* subject
* grading instructions

---

# Provider Manager

Resolves provider config.

---

# Primary Attempt

NVIDIA inference.

---

# Failure Path

Fallback to Grok.

---

# Output

Normalized grading structure.

---

# Required Output Fields

* score
* strengths
* weaknesses
* suggestions
* ideal comparison

---

# 104. Reveal Answer AI Workflow

Future flow.

---

# Input

Question only.

---

# Process

AI generates ideal academic answer.

---

# Constraints

Must remain:

* structured
* subject-relevant
* conceptually strong

---

# Provider Routing

Subject-aware.

Fallback enabled.

---

# 105. Future Chat AI Workflow

Future strict RAG chat architecture.

---

# Critical Rule

Chat must NOT behave as unrestricted general AI assistant.

---

# Knowledge Rule

Answers only from uploaded subject documents.

---

# If Knowledge Missing

Response:

```text id="h1w1yx"
Answer not found in provided study material.
```

---

# Future Flow

Student:

select subject

submit prompt

---

System:

retrieve relevant subject documents

construct context

send grounded prompt

AI responds

---

# 106. RAG Architecture Overview (Future)

# Purpose

Strict source-grounded academic chat.

---

# Core Pipeline

Conceptual flow:

```text id="gl6np8"
Documents
   ↓
Parsing
   ↓
Chunking
   ↓
Embedding
   ↓
Vector Storage
   ↓
Retrieval
   ↓
Prompt Construction
   ↓
AI Inference
```

---

# Components

Required:

* document parser
* chunker
* embedding engine
* vector database
* retrieval layer
* prompt builder
* AI provider layer

---

# 107. Chat Knowledge Base Rules

# File Limits

Per subject:

```text id="v7z6yl"
20 files
```

---

# Supported Formats (Planned)

* PDF
* DOCX
* TXT
* Markdown
* CSV
* JSON

---

# Parsing Requirements

Extract readable academic content.

---

# Validation

Reject:

* empty docs
* unreadable docs
* corrupt files

---

# Subject Isolation

DBMS knowledge must not contaminate PHP chat.

---

# 108. Document Processing Pipeline

Future architecture.

---

# Step 1 — Upload

Admin uploads file.

---

# Step 2 — Validation

Check:

* size
* type
* readability

---

# Step 3 — Parsing

Extract text.

---

# Step 4 — Chunking

Split content into retrieval units.

---

# Step 5 — Embedding

Convert chunks into vectors.

---

# Step 6 — Storage

Persist embeddings.

---

# Step 7 — Retrieval Availability

Documents searchable.

---

# 109. Vector Storage Recommendation

Recommended:

pgvector inside PostgreSQL (Supabase)

---

# Reason

Fits project scale.

Advantages:

* simpler stack
* lower cost
* fewer moving parts
* adequate for expected usage

---

# Alternatives (Future)

Possible:

* Pinecone
* Weaviate
* Qdrant
* local vector store

Not necessary initially.

---

# 110. Embedding Strategy

Future implementation.

---

# Requirements

Embeddings must support:

* semantic retrieval
* moderate latency
* subject isolation

---

# Selection Flexibility

Embedding provider should remain replaceable.

---

# 111. Prompt Governance

# Critical Rule

Prompt construction must enforce source-bounded responses.

---

# System Instructions Must Enforce

Examples:

* use only provided context
* do not invent unsupported answers
* refuse unsupported claims

---

# Goal

Minimize hallucinations.

---

# 112. AI Analytics

Track:

* provider usage
* fallback frequency
* failures
* latency
* test results
* model utilization

---

# Future Chat Analytics

Track:

* chat volume
* unresolved prompts
* no-context responses

---

# 113. Security Requirements for AI Layer

Protect:

* API keys
* provider credentials
* inference endpoints

---

# Rules

Never expose secrets client-side.

---

# Server-Only Access

Mandatory.

---

# Config Validation

Prevent invalid configs from breaking runtime.

---

# Rate Protection

Protect expensive inference routes.

---

# 114. Edge Cases

Handle:

---

## Provider Outage

Graceful fallback.

---

## Invalid Credentials

Clear admin diagnostics.

---

## Invalid Model

Safe rejection.

---

## Slow Inference

Timeout handling.

---

## Malformed Provider Response

Normalization + fallback.

---

## Missing Subject Config

Safe error.

---

## RAG Retrieval Empty

Return no-answer response.

---

# 115. Acceptance Criteria

AI architecture successful if:

System can:

* route provider requests
* support subject-specific model config
* validate providers
* test real connectivity
* normalize failures
* fallback safely

Future architecture supports:

* grading
* reveal answers
* strict RAG chat
* provider expansion

---

# Chunk 7 Complete

Next:

**Chunk 8 — Technical Architecture (Stack, DB Design, Route Structure, Deployment, Implementation Workflow, NFRs)**
# AI Study Platform PRD

## Chunk 8 — Technical Architecture (Stack, Database Design, Deployment, Implementation Workflow, NFRs)

---

# 116. Technical Architecture Overview

# Purpose

This section defines the implementation architecture required to build, scale, secure, and maintain the platform.

The architecture must align with the confirmed product constraints:

* private invite-only platform
* approximately 200 total users
* approximately 10–20 concurrent users
* cost-conscious infrastructure
* AI extensibility
* admin-heavy governance
* phased implementation workflow
* minimal UI philosophy

---

# Architecture Principles

The architecture must prioritize:

* maintainability
* modularity
* low operational complexity
* fast developer velocity
* secure admin governance
* AI extensibility
* future scalability

---

# Core Architecture Philosophy

Avoid overengineering.

This platform does NOT require:

* Kubernetes
* microservices
* event buses
* distributed queues
* multi-region infra
* enterprise orchestration complexity

Initial architecture should remain pragmatic.

---

# Recommended Architecture Pattern

Preferred:

**modular monolith**

Meaning:

single primary application

internally modularized

not fragmented into separate services initially.

---

# Why Modular Monolith

Benefits:

* simpler deployment
* faster iteration
* easier debugging
* lower cost
* easier auth/session management
* easier RBAC enforcement

For current scale, this is the correct choice.

---

# 117. Frontend Architecture

# Recommended Stack

Core frontend stack:

* Next.js 14
* TypeScript
* Tailwind CSS v4
* shadcn/ui
* Lucide Icons
* Framer Motion (minimal usage)

---

# Framework Choice

## Next.js 14

Recommended because:

* App Router support
* server components
* API routes
* server actions
* auth compatibility
* Vercel-native deployment
* production maturity

---

# Language

## TypeScript

Mandatory.

Reason:

strong typing reduces bugs.

Especially critical for:

* RBAC
* AI provider configs
* question schemas
* admin workflows
* import validation

---

# Styling

## Tailwind CSS v4

Matches design goals:

* fast iteration
* minimal UI
* consistent spacing
* utility-driven design

---

# Component Library

## shadcn/ui

Recommended for:

* dashboards
* forms
* dialogs
* tables
* admin tooling

---

# Icons

## Lucide

Recommended:

lightweight

clean

consistent

---

# Animation

## Framer Motion

Use sparingly.

Only for:

* transitions
* drawers
* loading polish

Avoid decorative excess.

---

# State Management

## Zustand

Recommended.

Use for:

* UI state
* filters
* session-adjacent client state
* exam local state

Avoid Redux complexity.

---

# Forms

Recommended:

* React Hook Form
* Zod

---

# Why

Needed for:

* admin forms
* validation
* imports
* settings
* auth forms

---

# Tables

## TanStack Table

Recommended.

Needed for:

* users
* questions
* audit logs
* analytics tables

---

# Charts

## Recharts

Recommended.

Needed for:

* analytics dashboards
* score trends
* performance visualizations

---

# 118. Backend Architecture

# Strategy

Use Next.js integrated backend.

Avoid separate backend initially.

---

# Backend Components

Use:

* Route Handlers
* Server Actions
* middleware
* server components

---

# Why

Benefits:

* unified codebase
* simpler auth
* faster deployment
* lower ops overhead

---

# Internal Module Boundaries

Logical modules:

```text id="y4ylhy"
auth
users
admins
subjects
mcq
long-answer
analytics
providers
audit
uploads
chat
rag
```

Even in monolith, keep boundaries clean.

---

# Business Logic Separation

Avoid route-level spaghetti.

Use service layer pattern.

Example:

```text id="4m3gbo"
/services
/auth
/mcq
/providers
/analytics
```

---

# Repository Layer

Recommended for DB access abstraction.

---

# 119. Database Architecture

# Recommended Database

## PostgreSQL

Strong recommendation.

Prefer:

Supabase PostgreSQL.

---

# Why PostgreSQL

Best fit because platform needs:

* relational access control
* analytics queries
* audit logs
* structured question banks
* permissions
* subject relationships

---

# Why Not Firestore

Firestore would complicate:

* RBAC relationships
* analytics joins
* audit querying
* relational admin structures

---

# Why Not Pure File Storage

Questions must be queryable.

Structured DB required.

---

# 120. Authentication Infrastructure

# Recommended

## Supabase Auth

Strong fit.

---

# Why

Provides:

* secure auth
* session handling
* token lifecycle
* password hashing
* auth APIs

---

# Custom Logic Needed

Because invite-only flow is custom.

Need custom business logic around:

approved emails

roles

admin governance

---

# 121. Storage Architecture

# Recommended

## Supabase Storage

Use for:

* MCQ imports
* long-answer uploads
* future chatbot documents

---

# Why

Benefits:

* integrates with auth
* simple permissions
* scalable enough
* Vercel compatible

---

# Storage Buckets (Recommended)

Examples:

```text id="jlwm1y"
mcq-imports
long-answer-content
chat-documents
temp-processing
```

---

# Security

Restrict access appropriately.

---

# 122. Database Entity Design

# Core Entities

---

## users

Purpose:

platform user profiles.

Fields:

* id
* auth_id
* email
* first_name
* last_name
* role_id
* status
* created_at
* updated_at

---

## roles

Examples:

* student
* normal_admin
* super_admin

---

## permissions

Permission definitions.

Examples:

* can_manage_users
* can_view_analytics
* can_test_ai_provider

---

## role_permissions

Role defaults.

---

## user_permissions

Overrides/delegation.

---

## approved_emails

Invite whitelist.

Fields:

* email
* invited_by
* status
* claimed
* created_at

---

## subjects

Academic subjects.

---

## admin_subject_assignments

Normal admin subject scoping.

---

## mcq_question_banks

Subject-level grouping.

---

## mcq_questions

Question records.

---

## mcq_attempts

Exam attempts.

---

## mcq_attempt_answers

Answer persistence.

---

## long_answer_question_sets

Future subjective content.

---

## long_answer_attempts

Future attempts.

---

## long_answer_attempt_answers

Future responses.

---

## provider_configs

Credential/config storage.

---

## subject_ai_configs

Per-subject model routing.

---

## password_reset_requests

Approval queue.

---

## audit_logs

Traceability.

---

## analytics_snapshots

Optional aggregation.

---

## future_chat_threads

Future chat.

---

## future_chat_messages

Future chat memory.

---

## future_document_embeddings

Future RAG vectors if DB-based.

---

# 123. Route Architecture

# Recommended Route Structure

```text id="1mjlwm"
/app
  /(public)
    /login
    /register
    /forgot-password

  /(student)
    /dashboard
    /mcq
    /mcq/history
    /chat
    /chat/history
    /long-answer
    /settings

  /(admin)
    /dashboard
    /users
    /approved-emails
    /admins
    /subjects
    /mcq-content
    /long-answer-content
    /providers
    /analytics
    /audit
    /settings

  /api
    /auth
    /users
    /admins
    /subjects
    /mcq
    /uploads
    /providers
    /analytics
    /audit
```

---

# Route Philosophy

Clear separation.

Student routes separate from admin routes.

---

# Middleware Enforcement

Protect:

* admin routes
* student routes
* API routes

---

# 124. API Architecture

# Principles

APIs must be:

* authenticated
* authorized
* validated
* auditable

---

# Examples

MCQ:

```text id="mn3jfi"
/api/mcq/start
/api/mcq/answer
/api/mcq/resume
/api/mcq/submit
/api/mcq/history
```

---

Auth:

```text id="kn9t12"
/api/auth/register
/api/auth/login
/api/auth/logout
/api/auth/request-reset
/api/auth/reset
```

---

Providers:

```text id="8kg7ff"
/api/providers/test
/api/providers/config
```

---

Admin:

```text id="chjlwm"
/api/admin/users
/api/admin/admins
/api/admin/subjects
```

---

# Validation

Use schema validation everywhere.

---

# 125. File Processing Architecture

# Import Processing

Pipeline:

```text id="dhj92u"
Upload
→ Validate
→ Parse
→ Normalize
→ Preview
→ Confirm
→ Persist
```

---

# Parsing Libraries (Recommended)

CSV:

PapaParse

---

JSON:

native parsing

---

Future DOCX:

Mammoth

---

Future PDF:

pdf-parse

---

# Security

Validate:

* size
* type
* schema
* corruption

---

# Temporary Processing

Use temp processing bucket or memory-safe streams.

---

# 126. AI Layer Architecture

# Internal Structure

Recommended:

```text id="jlwm80"
/providers
  provider-manager.ts
  nvidia-adapter.ts
  grok-adapter.ts
  provider-types.ts
```

---

# Responsibilities

Provider manager:

routing/fallback

Adapters:

provider specifics

---

# Future Expandability

Easily add:

Gemini

OpenAI

Claude

OpenRouter

local inference

---

# 127. Future RAG Architecture

# Components

Future:

* parser
* chunker
* embedding layer
* vector store
* retriever
* prompt builder
* AI provider layer

---

# Vector Store Recommendation

## pgvector

Strong recommendation.

Reason:

fits scale.

---

# Knowledge Isolation

Subject-specific retrieval only.

Mandatory.

---

# 128. Analytics Architecture

# Event Tracking

Track:

* exam starts
* exam completions
* answers
* scores
* resets
* provider tests
* admin actions

---

# Aggregation Strategy

Options:

---

## Real-Time Queries

Simple but can grow expensive.

---

## Snapshot Aggregation

Recommended as scale grows.

---

# Current Scale

Real-time acceptable initially.

---

# 129. Audit Architecture

# Requirements

Audit logs must be immutable in intent.

Normal users cannot alter.

---

# Capture

Who:

actor id

What:

action

When:

timestamp

Target:

entity

Context:

metadata

---

# Query Support

Need filtering by:

* user
* action
* entity
* date

---

# 130. Security Architecture

# Core Requirements

---

## Server-Side Authorization

Mandatory.

---

## Secret Isolation

Provider keys server-only.

---

## Encrypted Storage

Sensitive config protected.

---

## Upload Validation

Mandatory.

---

## Rate Limiting

Protect:

* auth
* provider testing
* AI inference
* uploads

---

## Input Sanitization

Prevent XSS/injection.

---

## CSRF Strategy

Protect state-changing operations.

---

# 131. Deployment Architecture

# Recommended

Frontend/backend:

## Vercel

---

Database/auth/storage:

## Supabase

---

AI:

external providers

---

# Deployment Topology

```text id="jlwm93"
Browser
   ↓
Vercel App
   ↓
Supabase
   ↓
AI Providers
```

---

# Benefits

* simple
* scalable enough
* cost-conscious
* operationally clean

---

# 132. Environment Configuration

Recommended env vars:

```text id="jlwm44"
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE
NVIDIA_API_KEY
GROK_API_KEY
```

Future:

```text id="jlwm65"
EMBEDDING_PROVIDER_KEY
```

---

# Rules

Never expose secrets client-side.

---

# 133. Performance Targets

Expected:

200 total users

10–20 concurrent

---

# Targets

---

## Page Load

Fast dashboard rendering.

---

## Exam Responsiveness

Low-latency answer flow.

---

## Resume Recovery

Quick restoration.

---

## Provider Test Feedback

Reasonably fast diagnostics.

---

# 134. Reliability Targets

System should tolerate:

* refreshes
* network drops
* interrupted exams
* provider failures

---

# Reliability Goals

* no answer loss
* resumable attempts
* graceful degradation
* predictable failures

---

# 135. Accessibility Targets

Support:

* keyboard navigation
* readable contrast
* semantic UI
* focus visibility

---

# 136. Observability Recommendations

Recommended:

logging

error monitoring

performance monitoring

---

# Suggested Tools (Optional)

Sentry

platform logging

analytics dashboards

---

# 137. Implementation Workflow (Confirmed Build Strategy)

# Step 1

Core scaffolding.

Build:

* routes
* layouts
* navigation
* shared components
* theme
* guards
* structure

---

# Step 2

Student UI buildout.

Including:

functional + placeholder modules.

---

# Step 3

MCQ backend implementation.

Full production logic.

---

# Step 4

Admin UI buildout.

---

# Step 5

Authentication + admin backend.

---

# Step 6

Provider infrastructure.

---

# Step 7

Long-answer backend.

---

# Step 8

RAG chat backend.

---

# This is Implementation Workflow

Not release roadmap.

---

# 138. Future Scalability Considerations

If growth increases significantly:

possible upgrades:

* background jobs
* caching
* provider queueing
* vector DB externalization
* analytics warehouse

Not needed initially.

---

# 139. Technology Decision Summary

## Frontend

* Next.js 14
* TypeScript
* Tailwind CSS v4
* shadcn/ui
* Lucide
* Framer Motion

---

## State

* Zustand

---

## Forms

* React Hook Form
* Zod

---

## Tables

* TanStack Table

---

## Charts

* Recharts

---

## Backend

* Next.js backend

---

## DB/Auth/Storage

* Supabase

---

## Database

* PostgreSQL

---

## AI

* NVIDIA NIM
* Grok fallback
* provider abstraction

---

## Future RAG

* pgvector

---

## Hosting

* Vercel

---

# 140. Final Architecture Recommendation

Recommended production architecture:

**Next.js 14 + TypeScript + Tailwind v4 + shadcn/ui + Supabase + PostgreSQL + Supabase Storage + Zustand + Zod + React Hook Form + TanStack Table + Recharts + NVIDIA NIM + Grok fallback + Vercel**

---

# PRD COMPLETE

You now have the full implementation-focused PRD in structured markdown chunks.

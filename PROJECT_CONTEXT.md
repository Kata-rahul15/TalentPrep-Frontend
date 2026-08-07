# PROJECT_CONTEXT.md — TalentPrep Frontend Memory

This document serves as the persistent memory of the **TalentPrep** (TalentForgeAI) project. It outlines the codebase structure, tech stack, architecture, flows, design systems, resume module, and current status. **Always read this file before starting any new feature.**

---

## 1. Overall Tech Stack & Architecture

TalentPrep is a premium AI-powered interview preparation console. The repository contains the frontend client, which is designed to connect to an external Spring Boot backend.

### Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| Vite | v8.0.12 | Build tool & dev server |
| React | v19.2.6 | UI framework |
| TypeScript | v6.0.2 | Type safety |
| Tailwind CSS | v4.3.1 | Utility-first styling (via `@tailwindcss/vite`) |
| React Router DOM | v7.17.0 | Client-side routing & guards |
| Framer Motion | v12.40.0 | Page/element animations |
| Lucide React | ^1.18.0 | Icon library |
| Axios | v1.18.0 | HTTP client for API calls |
| TanStack Query | ^5.x | Server state, caching, loading/error states |
| React Hook Form | ^7.x | Form state management |
| Zod | ^3.x | Schema validation |
| clsx + tailwind-merge | latest | Class name composition (`cn()`) |

### Path Alias

All source imports use the `@/` alias mapped to `./src` (configured in `vite.config.ts` and `tsconfig.app.json`).

---

## 2. Directory Structure

```text
d:/TalentForgeAI/
├── src/
│   ├── assets/                    # Images, SVGs, static assets
│   ├── components/
│   │   ├── auth/                  # Auth form components
│   │   ├── layout/                # Shell components (Navbar, Footer, Toast)
│   │   └── sections/              # Landing page sections
│   ├── features/
│   │   └── resume/                # ★ Resume Module (self-contained)
│   │       ├── api/
│   │       │   └── resumeApi.ts   # API layer — the ONLY file to change for backend
│   │       ├── components/
│   │       │   ├── ExpandableCard.tsx
│   │       │   ├── FileUploader.tsx
│   │       │   ├── ResumeLayout.tsx
│   │       │   ├── ResumeUI.tsx
│   │       │   ├── ScoreBar.tsx
│   │       │   ├── ScoreRing.tsx
│   │       │   └── SkillBadge.tsx
│   │       ├── hooks/
│   │       │   └── useResume.ts   # TanStack Query hooks — pages import these
│   │       ├── mock/
│   │       │   └── resumeMock.ts  # Realistic mock data + fake API with sleep()
│   │       ├── pages/
│   │       │   ├── ResumeDashboard.tsx
│   │       │   ├── ResumeUpload.tsx
│   │       │   ├── ResumeDetails.tsx
│   │       │   ├── ResumeEvaluation.tsx
│   │       │   ├── JobMatch.tsx
│   │       │   └── ResumeChat.tsx
│   │       ├── services/          # (reserved for future service layer)
│   │       └── types/
│   │           └── resume.types.ts # All TypeScript DTOs & interfaces
│   ├── lib/
│   │   └── utils.ts               # cn() — tailwind-merge + clsx wrapper
│   ├── pages/                     # Top-level page components
│   │   ├── ForgotPassword.tsx
│   │   ├── Home.tsx               # Console dashboard (post-login landing)
│   │   ├── Landing.tsx
│   │   ├── Login.tsx
│   │   ├── ResetPassword.tsx
│   │   ├── Signup.tsx
│   │   └── VerifyOtp.tsx
│   ├── routes/
│   │   └── AppRoutes.tsx          # All route definitions + ProtectedRoute/PublicRoute guards
│   ├── services/
│   │   └── authService.tsx        # Axios instance, AuthContext, auth API calls
│   ├── App.tsx                    # Root: wraps app in QueryClientProvider
│   ├── index.css                  # Global CSS vars, Tailwind @theme, animations
│   └── main.tsx                   # DOM entry point
├── package.json
├── tsconfig.app.json
├── vite.config.ts
└── PROJECT_CONTEXT.md             # ← This file
```

---

## 3. Design System (Color Tokens)

The entire color system is defined as CSS custom properties in `src/index.css` and exposed to Tailwind via `@theme`. **Never use hardcoded colors — always use the semantic class names below.**

### Light Mode (`:root`) → Dark Mode (`.dark` / `prefers-color-scheme: dark`)

| Token Variable | Light Value | Dark Value | Tailwind Class |
|---|---|---|---|
| `--color-primary` | `#2563EB` | `#2563EB` | `bg-primary`, `text-primary` |
| `--color-primary-hover` | `#1D4ED8` | `#1D4ED8` | `hover:bg-primary-hover` |
| `--color-primary-active` | `#1E40AF` | `#1E40AF` | `bg-primary-active` |
| `--color-background` | `#FAFAFA` | `#0F172A` | `bg-background` |
| `--color-card` | `#FFFFFF` | `#111827` | `bg-card` |
| `--color-secondary-bg` | `#F5F5F5` | `#1E293B` | `bg-secondary-bg` |
| `--color-navbar-bg` | `rgba(255,255,255,0.85)` | `rgba(15,23,42,0.85)` | `bg-navbar-bg` |
| `--color-sidebar-bg` | `#FFFFFF` | `#111827` | `bg-sidebar-bg` |
| `--color-text-primary` | `#111827` | `#F9FAFB` | `text-foreground` |
| `--color-text-secondary` | `#4B5563` | `#E2E8F0` | `text-secondary-foreground` |
| `--color-text-muted` | `#6B7280` | `#94A3B8` | `text-muted-foreground` |
| `--color-border` | `#E5E7EB` | `#1F2937` | `border-border` |
| `--color-divider` | `#F3F4F6` | `#1F2937` | `border-divider` |
| `--color-success` | `#16A34A` | `#16A34A` | `text-success`, `bg-success` |
| `--color-warning` | `#F59E0B` | `#F59E0B` | `text-warning`, `bg-warning` |
| `--color-danger` | `#DC2626` | `#DC2626` | `text-danger`, `bg-danger` |
| `--color-info` | `#0EA5E9` | `#0EA5E9` | `text-info`, `bg-info` |

### Brand Alias (Blue Palette)

The `brand-*` utilities are aliased to the blue palette (`#EFF6FF` → `#172554`) for backward compatibility. New code should prefer `primary` over `brand-600`.

### Typography

- **Headings**: `font-heading` → `Outfit` (extrabold/black, tracking-tight)
- **Body**: `font-sans` → `Plus Jakarta Sans` (clean, antialiased)

### Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| `bg-primary hover:bg-primary-hover` | `bg-blue-600 hover:bg-blue-700` |
| `text-foreground` | `text-gray-900` |
| `border-border` | `border-gray-200` |
| `text-muted-foreground` | `text-gray-500` |
| `bg-card` | `bg-white` |
| `shadow-sm` | `shadow-brand-500/20` |

---

## 4. Routing

All routes are defined in `src/routes/AppRoutes.tsx`. The `BrowserRouter`, `AuthProvider`, and all route guards live here.

### Route Table

| Path | Page Component | Guard |
|---|---|---|
| `/` | `Landing` | Public |
| `/login` | `Login` | `PublicRoute` (redirects to `/home` if logged in) |
| `/signup` | `Signup` | `PublicRoute` |
| `/verify-otp` | `VerifyOtp` | `PublicRoute` |
| `/forgot-password` | `ForgotPassword` | `PublicRoute` |
| `/reset-password` | `ResetPassword` | `PublicRoute` |
| `/home` | `Home` | `ProtectedRoute` (redirects to `/login` if not logged in) |
| `/resume` | `ResumeDashboard` | `ProtectedRoute` + `ResumeLayout` |
| `/resume/upload` | `ResumeUpload` | `ProtectedRoute` + `ResumeLayout` |
| `/resume/details` | `ResumeDetails` | `ProtectedRoute` + `ResumeLayout` |
| `/resume/evaluation` | `ResumeEvaluation` | `ProtectedRoute` + `ResumeLayout` |
| `/resume/job-match` | `JobMatch` | `ProtectedRoute` + `ResumeLayout` |
| `/resume/chat` | `ResumeChat` | `ProtectedRoute` + `ResumeLayout` |
| `*` | Redirect to `/` | — |

### Route Guard Logic

- **`ProtectedRoute`**: Reads `user` from `AuthContext`. Shows spinner while `loading`. Redirects to `/login` if `user` is null.
- **`PublicRoute`**: Redirects to `/home` if user is already authenticated.

---

## 5. Authentication & Data Flow

### AuthContext (`src/services/authService.tsx`)

- **`AuthProvider`** wraps the entire app inside `BrowserRouter` (in `AppRoutes.tsx`).
- Exposes: `user`, `loading`, `loginState()`, `logout()`, `fetchProfile()`, `showToast()`.

```typescript
interface UserProfile {
  username: string
  userId: number
  email: string
  isAccountVerified: boolean
}
```

### Session Lifecycle

1. On mount: calls `GET /profile` to restore session from cookie.
2. On success: stores `UserProfile` in context + `localStorage` (`tf_user`).
3. On failure (non-404): clears user state.
4. On 401/403 intercepted: dispatches `auth-unauthorized` event → clears user.

### Axios Instance

- Base URL: `API.AUTH_BASE_URL` configured in `src/config/api.ts` via `VITE_AUTH_BASE_URL` (default: `https://authentication-system-1-ndpa.onrender.com`)
- `withCredentials: true` — uses HTTP-Only cookie JWT
- Response interceptor: handles 401/403 automatic logout

---

## 6. Auth API Endpoints (Spring Boot Backend)

All functions are in `src/services/authService.tsx` and use the shared `api` Axios instance.

| Endpoint | Method | Payload | Function |
|---|---|---|---|
| `/register` | `POST` | `{ username, email, password }` | `registerUser()` |
| `/send-verify-otp` | `POST` | `{ email, otp }` | `verifySignupOtp()` |
| `/resend-otp` | `POST` | `{ email }` | `resendOtp()` |
| `/login` | `POST` | `{ email, password }` | `loginUser()` |
| `/forgot-password` | `POST` | `{ email }` | `forgotPassword()` |
| `/send-reset-otp` | `POST` | `{ email, otp }` | `verifyResetOtp()` |
| `/reset-password` | `POST` | `{ email, otp, newPassword }` | `resetPassword()` |
| `/profile` | `GET` | *(cookie)* | `getUserProfile()` |
| `/logout` | `POST` | *(cookie)* | `logoutUser()` |

---

## 7. Resume Module

The Resume Module is a **self-contained feature** at `src/features/resume/`. It follows a strict layered architecture. Pages never call the API directly.

```
Page → Hook (TanStack Query) → API Layer → Mock / Backend
```

### 7.1 Architecture Rules

- **Pages** import only from `hooks/useResume.ts`.
- **Hooks** import only from `api/resumeApi.ts`.
- **`resumeApi.ts`** imports from `mock/resumeMock.ts` (currently).
- **To connect to the real backend**: edit only `resumeApi.ts`. Pages and hooks remain unchanged.

### 7.2 TypeScript DTOs (`src/features/resume/types/resume.types.ts`)

All interfaces match the future Spring Boot API response shapes:

```typescript
ResumeFile            // file metadata (id, fileName, fileSize, fileType, uploadedAt, status)
ResumeDetails         // full parsed resume content
WorkExperience        // company, role, dates, description[], technologies[]
Project               // name, description, highlights[], technologies[], repoUrl
Education             // institution, degree, field, years, gpa
Certification         // name, issuer, date, credentialId
ScoreBreakdown        // atsScore, keywordMatch, formattingScore, technicalSkillsScore, etc.
ResumeEvaluation      // scores, strengths[], weaknesses[], suggestions[], missingKeywords[]
ResumeSuggestion      // section, priority ('high'|'medium'|'low'), message
JobMatchRequest       // jobDescription
JobMatchResult        // overallMatch, matchedSkills[], missingSkills[], recommendations[]
ChatMessage           // id, role ('user'|'assistant'), content, timestamp
ChatRequest / ChatResponse
ApiResponse<T>        // success, data, message
UploadResumeResponse  // resumeId, fileName, uploadedAt, status
```

### 7.3 Resume API Endpoints (Backend Contract)

All endpoints are currently **mocked** in `resumeMock.ts`. Backend implementation goes in `resumeApi.ts`.

| Endpoint | Method | Description | Frontend Function |
|---|---|---|---|
| `/resume` | `GET` | Get uploaded resume metadata | `resumeApi.getResume()` |
| `/resume/upload` | `POST` | Upload a PDF or DOCX resume | `resumeApi.uploadResume(file)` |
| `/resume/details` | `GET` | Get parsed resume content | `resumeApi.getResumeDetails()` |
| `/resume/evaluate` | `POST` | Run AI ATS evaluation | `resumeApi.evaluateResume()` |
| `/resume/job-match` | `POST` | Match resume to a job description | `resumeApi.matchJob(jobDescription)` |
| `/resume/chat` | `POST` | AI chat about the resume | `resumeApi.chat(message, history)` |

### 7.4 TanStack Query Hooks (`src/features/resume/hooks/useResume.ts`)

| Hook | Type | Description |
|---|---|---|
| `useResume()` | Query | Fetch resume file metadata |
| `useResumeDetails()` | Query | Fetch parsed resume content |
| `useResumeEvaluation(enabled?)` | Query | Fetch or trigger AI evaluation |
| `useUploadResume()` | Mutation | Upload file, invalidates all resume queries |
| `useEvaluateResume()` | Mutation | Trigger fresh evaluation, sets query cache |
| `useJobMatch()` | Mutation | Match resume to JD string |
| `useResumeChat()` | Custom Hook | Manages chat history state + `sendMessage()` |

### 7.5 Resume Pages

| Route | Page | Key Features |
|---|---|---|
| `/resume` | `ResumeDashboard` | Empty-state upload CTA; OR resume card, ATS stats, quick-action grid, interview CTA |
| `/resume/upload` | `ResumeUpload` | Drag-and-drop (`FileUploader`), PDF/DOCX validation, 10MB limit, progress animation, ATS tips |
| `/resume/details` | `ResumeDetails` | Expandable sections: Summary, Skills, Work Experience (timeline), Projects, Education, Certifications |
| `/resume/evaluation` | `ResumeEvaluation` | Score ring (overall), score bars (6 sub-scores), strengths/weaknesses panels, suggestions by priority, missing keywords |
| `/resume/job-match` | `JobMatch` | JD textarea input, match score ring, matched vs. missing skills badges, recommendations, interview CTA |
| `/resume/chat` | `ResumeChat` | Chat bubbles (user/bot), typing indicator, suggested questions, auto-scroll, Enter-to-send textarea |

### 7.6 Shared Resume Components

| Component | Purpose |
|---|---|
| `ResumeLayout` | Sidebar (desktop) + mobile top bar with active nav highlighting |
| `FileUploader` | Drag-drop zone + browse button + file preview + progress bar |
| `ExpandableCard` | Animated collapsible card (Framer Motion height animation) |
| `ScoreRingContainer` | SVG circular gauge with green/amber/red coloring by score |
| `ScoreBar` | Animated progress bar with color-coded label and percentage |
| `SkillBadge` | Tag pill — variants: `default`, `matched`, `missing`, `primary`, `muted` |
| `Button` | Shared button with `primary`/`secondary`/`ghost`/`danger` variants + loading state |
| `PageLoading` | Full-page spinner with message |
| `PageError` | Error panel with retry button |
| `EmptyState` | Empty data panel with icon, title, description, and optional action |
| `StatCard` | Metric card with icon, label, and value |

### 7.7 Mock Data Profile

The mock is based on **Rahul Sharma** — Senior Java Backend Engineer.

- **Skills**: Java 17, Spring Boot, Spring Security, Kafka, Redis, JWT, Docker, Kubernetes, React, TypeScript, PostgreSQL, MongoDB, Elasticsearch, CI/CD, GitHub Actions
- **Experience**: Infosys (2022–present), Wipro (2019–2022)
- **Projects**: TalentPrep AI, Distributed Auth Service, Email Notification Engine
- **Education**: B.Tech CSE, NIT Warangal (2015–2019, GPA 8.6)
- **Certifications**: AWS SAA, CKAD, Oracle Java SE 17
- **ATS Score**: 84 | **Overall Score**: 84 | **Job Match**: 82%

---

## 8. Important Components & Responsibilities

### Layout Components (`src/components/layout/`)

- **`Navbar`**: Sticky, glassmorphic top bar with logo (solid `bg-primary`), scroll-based links, login/CTA button. Adapts to auth state.
- **`Footer`**: Branding, social links, resource navigation, and legal mentions.
- **`Toast`**: Success/error popup using `AnimatePresence`. Triggered via `showToast()` from `AuthContext`.

### Authentication Components (`src/components/auth/`)

- **`AuthLayout`**: Left column (feature slides, rotating descriptions) + right column (form card). Blurs use `bg-primary/5`.
- **`AuthCard`**: Glassmorphic card wrapper. `shadow-sm` border — **no purple shadows**.
- **`InputField` / `PasswordField`**: Focus ring: `focus:ring-2 focus:ring-primary/20`. Border: `border-border`. Disabled: `bg-secondary-bg`.
- **`OTPInput`**: 6 individual inputs with auto-focus-shift, backspace, paste support.
- **`SocialLoginButtons`**: Google/GitHub mocked logins.
- **`SuccessMessage` / `ValidationMessage`**: Semantic success/error/warning/info banners.

### Landing Page Sections (`src/components/sections/`)

- **`Hero`**: Parallax ambient blurs (`bg-primary/5`), headline, subtitle, CTA button (`bg-primary`).
- **`Trust`**: Stats cards with `bg-card border-border`. Icon colors: `bg-primary/5 text-primary` and `bg-success/5 text-success`.
- **`TrustedCompanies`**: Company wordmarks with `text-muted-foreground/60 hover:text-foreground`.
- **`Features`**: Grid cards with icon hover: `group-hover:bg-primary group-hover:text-white`.
- **`HowItWorks`**: 3-step cards with dashed border connector (`border-dashed border-border`). No gradient line.
- **`Benefits`**: Icon colors use semantic tokens (`success`, `warning`, `primary`, `danger`).
- **`Testimonials`**: Reviewer avatars use `bg-primary/15`, `bg-success/15`, `bg-warning/15`.
- **`FAQ`**: Accordion cards with active border `border-primary`.
- **`CTA`**: Dark Slate card (`bg-slate-950 border-slate-900`) with white CTA button — no gradient.

---

## 9. State Management Conventions

| Concern | Solution |
|---|---|
| Auth/Session state | `AuthContext` (React Context) |
| Server data (resume queries) | TanStack Query (`useQuery` / `useMutation`) |
| Form state | React Hook Form + Zod validation |
| Local UI state | `useState` / `useReducer` |
| Chat message history | Custom `useResumeChat()` hook with `useState` |

---

## 10. API Integration Pattern

```
┌─────────┐    ┌──────────────┐    ┌──────────────┐    ┌───────────────────┐
│  Page   │───▶│  Hook        │───▶│  API Layer   │───▶│  Mock / Backend   │
│         │    │ (TanStack Q) │    │ resumeApi.ts │    │  resumeMock.ts    │
└─────────┘    └──────────────┘    └──────────────┘    └───────────────────┘
```

- Pages: consume hooks only, handle loading/error/empty UI states
- Hooks: call API layer, manage caching, invalidation, and mutations
- API layer: single file — swap mock for `axios.post('/resume/...')` to go live
- Mock: uses `sleep(ms)` to simulate realistic network latency

---

## 11. Coding Conventions

- Use `cn()` from `@/lib/utils` for all conditional class names.
- All colors via semantic tokens — never hardcode `text-gray-500` or `bg-white`.
- Form validation: React Hook Form + Zod schema.
- API errors: use `getErrorMessage(error)` from `authService.tsx`.
- Abort signals on auth API calls for clean unmount handling.
- Button disabled while loading — always show loading spinner in `Button` component.
- Prefer `motion.div` from Framer Motion for entry animations.
- Group Tailwind classes: layout → spacing → color → typography → border → shadow → interaction.

---

## 12. Current Project Status

### Completed

- [x] Premium landing page (Hero, Trust, Features, HowItWorks, Benefits, Testimonials, FAQ, CTA)
- [x] Full authentication flow (Register → OTP → Login → Forgot → Reset)
- [x] JWT cookie auth with Axios interceptors and AuthContext
- [x] Protected & Public route guards
- [x] Console dashboard (`/home`)
- [x] **Full color system refactor** — Premium SaaS design system (Primary Blue `#2563EB`, semantic tokens, full dark mode)
- [x] **Resume Module** — 6 pages, mock-first architecture, TanStack Query, all DTOs, sidebar layout

### In Progress / Pending

- [ ] Connect Resume Module to real Spring Boot backend (change only `resumeApi.ts`)
- [ ] Interview Simulator feature
- [ ] WebSocket/SSE integration for live AI conversations
- [ ] Real social login (Google OAuth, GitHub OAuth)
- [ ] User profile & settings page
- [ ] Notification system

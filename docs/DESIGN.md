---
name: AI Study Platform
colors:
  surface: '#FFFFFF'
  surface-dim: '#F1F5F9'
  surface-bright: '#FFFFFF'
  surface-container-lowest: '#FFFFFF'
  surface-container-low: '#F8FAFC'
  surface-container: '#F1F5F9'
  surface-container-high: '#E2E8F0'
  surface-container-highest: '#CBD5E1'
  on-surface: '#0F172A'
  on-surface-variant: '#475569'
  inverse-surface: '#1E293B'
  inverse-on-surface: '#F1F5F9'
  outline: '#94A3B8'
  outline-variant: '#E2E8F0'
  surface-tint: '#3B82F6'
  primary: '#3B82F6'
  on-primary: '#FFFFFF'
  primary-container: '#DBEAFE'
  on-primary-container: '#1E40AF'
  inverse-primary: '#93C5FD'
  secondary: '#6366F1'
  on-secondary: '#FFFFFF'
  secondary-container: '#E0E7FF'
  on-secondary-container: '#3730A3'
  tertiary: '#10B981'
  on-tertiary: '#FFFFFF'
  tertiary-container: '#D1FAE5'
  on-tertiary-container: '#065F46'
  error: '#EF4444'
  on-error: '#FFFFFF'
  error-container: '#FEE2E2'
  on-error-container: '#991B1B'
  background: '#F8FAFC'
  on-background: '#0F172A'
  surface-variant: '#F1F5F9'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.5rem
  lg: 0.75rem
  xl: 1rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  container-margin-mobile: 16px
  container-margin-desktop: 32px
  gutter: 16px
---

## Brand & Style

The brand personality is **professional, minimal, focused, and academic**. This is a private invite-only educational platform — NOT a consumer app. The emotional response should be calm confidence — the user feels structured, supported, and in control of their studies.

The design style is **Clean SaaS Academic Dashboard**. It uses the clarity and efficiency of modern SaaS tools while maintaining an academic seriousness. Think Notion meets Linear meets a serious exam platform.

## Colors

The palette is anchored by a clean, professional blue as the primary action color, grounded by a neutral Slate scale.

- **Primary (Blue #3B82F6):** Reserved strictly for CTAs, active navigation states, and primary actions. Trustworthy and professional.
- **Secondary (Indigo #6366F1):** Used for secondary highlights, charts, and data visualization accents.
- **Success/Correct (Emerald #10B981):** Applied to correct answer indicators, success states, and positive confirmation.
- **Error/Wrong (Red #EF4444):** Used for wrong answers, validation errors, and destructive action warnings.
- **Warning (Amber #F59E0B):** Used for "Coming Soon" badges, warnings, and attention-requiring states.
- **Neutrals (Slate):** A range from #0F172A (darkest text) to #F8FAFC (lightest background) for text, backgrounds, and borders.

## Light & Dark Mode

The platform supports full light/dark mode toggle via CSS custom properties.

### Light Mode
- Background: #FFFFFF (surface) / #F8FAFC (page background)
- Cards: #FFFFFF with subtle border (#E2E8F0) or soft shadow
- Text: #0F172A (primary) / #475569 (secondary) / #94A3B8 (tertiary)
- Borders: #E2E8F0

### Dark Mode
- Background: #0F172A (surface) / #020617 (page background)
- Cards: #1E293B with subtle border (#334155)
- Text: #F1F5F9 (primary) / #94A3B8 (secondary) / #64748B (tertiary)
- Borders: #334155

## Typography

**Inter** for everything — headlines, body, labels. Inter is chosen for maximum readability, professional tone, and excellent support for data-heavy interfaces like dashboards, tables, and exam interfaces.

Vertical rhythm is maintained through strict adherence to the defined line-heights. Body text at 16px with 24px line-height for comfortable reading.

## Layout & Spacing

The design system employs a consistent spacing scale based on 4px increments.

- **Desktop:** Left sidebar (260px) + topbar (64px) + main content area
- **Mobile:** Drawer sidebar + topbar + full-width content
- **Admin layout:** Same structure, different navigation items
- **Public layout:** Centered card for auth pages (max-width 480px)
- Use `xl` (48px) spacing between major page sections
- Use `lg` (24px) spacing between cards and within sections

## Elevation & Depth

Hierarchy is established through subtle shadows and tonal layering.

1. **Level 0 (Base):** Page background (#F8FAFC light / #020617 dark)
2. **Level 1 (Surface):** Content cards (#FFFFFF light / #1E293B dark) with subtle border
3. **Level 2 (Raised):** Modals, dropdowns with soft shadow: `0px 4px 12px rgba(15, 23, 42, 0.08)`
4. **Level 3 (Overlay):** Sheets, command palettes with stronger shadow: `0px 8px 24px rgba(15, 23, 42, 0.12)`

## Components

### Sidebar Navigation
Left sidebar with grouped navigation links. Student sidebar: Dashboard, MCQ Exams, MCQ History, AI Chat, Chat History, Long Answer, Settings. Admin sidebar: Dashboard, Users, Approved Emails, Admins, Subjects, MCQ Content, Long Answer Content, Providers, Analytics, Audit Logs, Settings.

### Stats Cards
Icon + metric value + label layout in clean grid. 8px border radius. Subtle border in light mode, tonal background in dark mode.

### Data Tables
Clean tables with hover states. No heavy zebra striping. Header row with label-md typography. Sortable columns, search input, filter chips, pagination.

### Exam Interface
Clean question display with 4 option cards. Timer display in topbar. Progress indicator. Answer lock visual (green for correct, red for wrong after selection).

### Coming Soon Modules
Semi-transparent overlay with centered "Coming Soon" message. Realistic UI visible underneath. Badge in navigation sidebar.

## Do's and Don'ts

### Do:
- Use generous whitespace between sections (32px-48px)
- Keep navigation clean and predictable
- Show loading skeletons, not spinners
- Use empty states with helpful messaging
- Maintain consistent 8px border radius
- Use the full Slate neutral scale for hierarchy

### Don't:
- Use playful colors or decorative gradients
- Add excessive animations
- Use social-media-style layouts
- Crowd the interface with too many elements
- Use pure black (#000000) for text — always use Slate scale
- Mix border radius values inconsistently

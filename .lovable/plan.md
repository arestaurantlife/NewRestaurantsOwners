# Activate all 6 Feature cards with gated detail pages

Make every card in the **Features** section a clickable link to its own detail page. Detail pages are **gated** — only logged-in users with an active subscription can view them. Each page is scaffolded with placeholder sections and a **PDF resources** area where you'll drop in real PDFs later.

## What we'll build

### 1. Six new detail pages (one per feature)
Routes:
- `/features/financial-operations`
- `/features/labor-cost-management`
- `/features/food-cost-control`
- `/features/employee-training`
- `/features/essential-forms`
- `/features/community-support`

Each page reuses the existing `Header` + `Footer` and includes:
- **Hero section** — icon, title, intro paragraph (placeholder copy)
- **Overview section** — placeholder for your written content
- **Key topics covered** — bulleted list (placeholder)
- **PDF Resources** — a list of PDF cards (title + description + download button). Starts with 2–3 placeholder entries you can replace.
- **CTA block** — back to dashboard / explore other features

### 2. Shared building blocks (DRY)
- `src/pages/features/FeaturePageLayout.tsx` — the page shell so all 6 pages stay consistent; you only edit content, not layout.
- `src/components/features/PdfResourceCard.tsx` — reusable card for each downloadable PDF (icon, title, description, download link). Wired to accept a URL — initially placeholder `#`, swap to real file URLs later.

### 3. Gating (subscription-only access)
- New `src/components/SubscriberRoute.tsx` wrapper that:
  - Redirects to `/auth` if not logged in
  - Redirects to `/#pricing` (with a toast: "Subscribe to access this content") if logged in but `subscription.subscribed === false`
  - Shows a loader while `loading` or `subscriptionLoading` is true
  - Otherwise renders children
- All 6 routes wrapped in `<SubscriberRoute>` in `src/App.tsx`.

### 4. Make the Features cards clickable
- Update `src/components/Features.tsx`:
  - Add `href` to each of the 6 feature objects.
  - Wrap each card in a React Router `<Link>` so the whole card is clickable.
  - Keep current hover lift/shadow; add subtle "View details →" affordance at the bottom of each card.

### 5. PDF storage approach (for later)
Two options for when you upload PDFs — we don't need to decide today, but plan-wise:
- **Simple**: drop PDFs into `public/pdfs/...` and reference by URL.
- **Recommended for gated content**: upload to a private Lovable Cloud Storage bucket with RLS so non-subscribers can't grab the file URL directly. We'd add this when you're ready to upload.

For now, `PdfResourceCard` accepts any URL string, so swapping later is one-line per PDF.

## File changes summary

**New:**
- `src/components/SubscriberRoute.tsx`
- `src/components/features/PdfResourceCard.tsx`
- `src/pages/features/FeaturePageLayout.tsx`
- `src/pages/features/FinancialOperations.tsx`
- `src/pages/features/LaborCostManagement.tsx`
- `src/pages/features/FoodCostControl.tsx`
- `src/pages/features/EmployeeTraining.tsx`
- `src/pages/features/EssentialForms.tsx`
- `src/pages/features/CommunitySupport.tsx`

**Modified:**
- `src/App.tsx` — add 6 gated routes above the catch-all
- `src/components/Features.tsx` — add `href` per card, wrap in `<Link>`

## What you'll do after I build

1. Open each `src/pages/features/*.tsx` and replace placeholder copy with your real text (or send it to me).
2. Upload PDFs and replace placeholder URLs in each page's `pdfResources` array.

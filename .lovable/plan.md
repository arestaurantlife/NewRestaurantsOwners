## Goal
Unify and elevate the three card-based sections on the homepage — Features, How It Works, and Pricing — so they share a consistent, premium visual language built on the wine/cream/gold/charcoal palette and Playfair + Inter typography.

## Sections affected
1. `src/components/Features.tsx` — 6 feature cards in a 3-column grid
2. `src/components/HowItWorks.tsx` — 3 step cards
3. `src/components/Pricing.tsx` — 3 subscription tier cards (Starter / Pro / Enterprise)

## Shared visual language to apply
- **Card surface:** soft cream background with a subtle inner gradient, 1px hairline border in muted wine tint, 2xl radius
- **Elevation:** layered shadow — soft ambient + a colored wine-tinted shadow on hover; lift transform on hover
- **Iconography:** circular gradient badge (wine → wine-glow) with a thin gold ring, replacing current square/gradient blocks for consistency across all three sections
- **Headings:** Playfair Display, slightly tighter tracking, charcoal
- **Body copy:** Inter, muted-foreground, increased line-height for readability
- **Accent line:** thin gold underline beneath each card title (2px, 32px wide) as a unifying motif
- **CTA row:** consistent "arrow-grows-on-hover" pattern using the wine primary color
- **Featured/highlighted card** (Pricing Pro tier): deeper wine gradient background, cream text, gold ring, gold "Most Popular" pill — same shape as other cards, just inverted palette

## Per-section refinements
- **Features:** add a faint numbered index ("01" – "06") in the top-right corner of each card in muted gold; tighten benefit list with gold check icons (already present) and add a subtle hover state on each row
- **How It Works:** replace plain step numbers with the shared circular gradient badge containing the number; add a thin connecting line between steps on desktop (decorative, gold dashed)
- **Pricing:** equalize card heights, move "Most Popular" pill to overlap the top edge, switch feature checkmarks to gold, add a subtle inner top highlight on the featured card

## Out of scope
- No copy changes
- No new sections, routing, or backend logic
- No changes to mobile breakpoints beyond what the shared classes already produce
- No icon library swaps (keep current lucide icons)

## Technical notes
- Use existing semantic tokens in `tailwind.config.ts` / `src/index.css` (`--primary`, `--gold`, `--card`, `--muted-foreground`, gradient + shadow tokens). If a shared "premium card" shadow or gradient token is missing, add it to `index.css` rather than inlining hex values in components.
- Reuse the existing `bg-gradient-hero` token for icon badges to keep the brand gradient consistent.
- Keep all three components as plain Tailwind — no new dependencies, no framer-motion additions (existing transitions are sufficient).

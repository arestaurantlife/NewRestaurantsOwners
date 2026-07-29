## Goal
Let admins edit the homepage directly from the live site — reorder, hide/show, and edit the content of each section — without touching code.

## How it works for you
1. Sign in as an admin. A floating "Edit page" button appears in the corner of the homepage.
2. Click it to enter edit mode. Each section (Hero, Features, How It Works, Podcasts & Courses, Design Services, Supplier Finder, Pricing, Testimonials, FAQ, CTA) gets a hover toolbar with:
   - Move up / move down
   - Show / hide
   - Edit content (opens a side panel with fields for that section: heading, subheading, button labels, card/item lists — add, remove, reorder items)
3. Changes save as a draft. A top bar shows "Draft — Preview / Publish / Discard". Visitors keep seeing the last published version until you hit Publish.
4. "Add section" lets you insert another instance of any available section type; "Remove" deletes it from the page.

Note on scope: this is a builder over the existing section library — you can add, remove, reorder and edit any of the ten section types, but it does not create brand-new custom layouts from scratch. That keeps the site's wine/gold/cream design intact.

## Technical plan

**Database**
- `page_layouts` table: `id, page_slug ('home'), status ('draft'|'published'), blocks jsonb, updated_by, updated_at`. One draft row and one published row per page.
- RLS + GRANTs: public/anon `SELECT` only on `status = 'published'`; full insert/update/delete for admins via `has_role(auth.uid(), 'admin')`. Draft row readable only by admins.

**Block model**
- `blocks: [{ id, type: 'hero'|'features'|..., visible: boolean, props: {...} }]`.
- Each section component gets an optional `content` prop; existing hardcoded copy becomes the default so nothing breaks if a field is absent.
- A `sectionRegistry.ts` maps type -> component + schema of editable fields (text, textarea, image, list-of-items) + default props. The editor panel renders fields from this schema, so no per-section editor UI to maintain.

**Frontend**
- `src/pages/Index.tsx` fetches the layout (published for visitors, draft for admins in edit mode) and renders blocks in order through the registry. Falls back to the current static order if no row exists yet.
- `src/components/pagebuilder/`: `EditModeProvider`, `EditToolbar` (top bar with Publish/Discard), `BlockWrapper` (hover controls), `BlockInspector` (side panel with schema-driven fields), `AddSectionMenu`.
- Reordering via up/down buttons plus drag handles using dnd-kit.
- Edit mode gated by the existing `useIsAdmin` hook; button and all mutations hidden for everyone else (server-side RLS is the real guard).

**Images**
- Reuse the existing storage setup with a new public `site-images` bucket for hero/section images, admin-write, public-read.

## Steps
1. Migration: `page_layouts` table + GRANTs + RLS; `site-images` bucket + policies.
2. `sectionRegistry.ts` with schema + defaults for all ten sections; refactor each section component to accept `content` props with current copy as defaults.
3. Layout fetch/save hooks (`usePageLayout`, `useSaveLayout`) with draft/publish logic.
4. Page builder UI components (toolbar, block wrapper, inspector, add-section menu, dnd-kit reordering).
5. Wire `Index.tsx` to render from the layout; seed the published row with the current section order.
6. Verify in the browser: admin sees controls, reorders and edits persist, publish flow works, and a signed-out visitor sees only the published version.
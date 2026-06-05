## Goal
Let subscribers narrow PDFs by tags/categories in addition to title/keyword search. Admins assign tags at upload (and can edit them later).

## Schema changes (single migration)
- Add `tags text[] not null default '{}'` to `public.feature_pdfs`.
- Add GIN index on `tags` for fast filtering.
- No new tables — keeping it simple. Tags are free-form strings, normalized to lowercase on save. Per-feature-slug, the UI derives the available tag list from existing rows.

## Uploader (`FeaturePdfManager.tsx`)
- Add a "Tags" input below Description.
- Comma-separated entry (e.g. `budgeting, p&l, template`), trimmed + lowercased + deduped before insert.
- Show entered tags as removable chips beneath the input for clarity.
- Persist into `feature_pdfs.tags`.

## Library (`FeaturePdfLibrary.tsx`)
- Extend `FeaturePdfRow` with `tags: string[]`.
- Derive `availableTags` from current `rows` (unique, sorted, with counts).
- Render a horizontal chip row of tags above results (next to search). Clicking toggles selection; supports multi-select.
- Filter logic: a PDF passes if it matches the search query AND contains every selected tag (AND semantics — narrows down). Switch easily to OR later if needed.
- Add an "All" reset chip and include selected tags in the "no matches" empty state with a "Clear filters" action that resets both search and tags.
- Hide the tag row entirely when no PDFs have tags yet.

## Card display (`PdfResourceCard.tsx`)
- Show tags as small muted badges under the description (read-only). Clicking a badge filters the library by that tag (passes an optional `onTagClick` from the library).

## Out of scope
- No tag management page, no rename/merge tools, no per-tag color theming. Admins manage tags by editing each PDF's tag string (future: inline edit).
- No changes to gating — open access remains as currently configured.

## Technical notes
- All filtering is client-side over the already-fetched `rows` (small set per feature). Keeps it instant and avoids extra queries.
- Tag normalization helper lives in `FeaturePdfLibrary.tsx` (or a small `lib/tags.ts`) and is reused by the uploader.
- Uses existing shadcn `Badge` + `Button` components; no new deps.

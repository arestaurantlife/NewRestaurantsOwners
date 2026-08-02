## Goal

Turn the current homepage-only block builder into a full live website editor: edit any page in place, create new pages, upload and manage images/videos/PDFs, edit links, and control colors globally and per section — all from the live site while signed in as admin.

## What you'll be able to do

- Click "Edit page" on **any** page (home, the 6 feature pages, and any page you create) and edit it live.
- **Type directly on the page** for headings/paragraphs, with a small floating toolbar (bold, italic, link, list). Colors, media, buttons, and section settings stay in the side panel.
- **Create new pages** with your own URL (e.g. `/about`, `/contact`), pick a starting layout, and publish. New pages can optionally be added to the header/footer menu.
- **Media library**: upload images, videos and PDFs once, reuse them anywhere. Video sections support uploaded files or YouTube/Vimeo links.
- **Colors**: a global theme editor (brand wine/gold/cream, text, buttons, fonts) plus per-section overrides for background, heading, text and button colors.
- Draft vs Publish on every page, with Discard to roll back to the last saved draft.

## Build phases

**1. Data + storage (backend)**
- Extend `page_layouts` to support many pages: add a `pages` table (`slug`, `title`, `meta_description`, `nav_label`, `show_in_nav`, `sort_order`, `is_system`) so pages can be created/listed/deleted; keep `page_layouts` keyed by slug + draft/published.
- New `media_assets` table (`kind`, `title`, `storage_path`, `mime`, `size`, `width/height`, `tags`) as the media library index.
- New public `site-media` storage bucket for images/videos; PDFs continue in the existing private bucket. Admin-only writes, public read for site media.
- New `site_theme` table (single row, draft + published JSON) for global colors/fonts.
- All tables: admin-only write policies, public read of published data, with grants.

**2. Multi-page routing**
- A catch-all route renders any published page from its stored blocks; the 6 feature pages and home keep their existing components but become editable page records.
- Admin "Pages" panel in the edit toolbar: list, create, rename, change URL, delete, reorder nav.

**3. Inline editing**
- A `RichText` renderer used by section components: read-only normally, `contentEditable` with a floating toolbar in edit mode (bold, italic, underline, link, bullet list, clear formatting). Saves as sanitized HTML into the block props.
- Panel editing (current inspector) stays for structured fields and lists.

**4. Media manager**
- Media library dialog: upload (drag & drop), search by title/tag, preview, insert, delete.
- New field types in the block schema: `image`, `video`, `pdf`, `link` — each opens the picker.
- New sections: Image, Video (upload or embed URL), PDF resource list, Rich text block, Button/CTA row, Spacer/Divider.

**5. Colors & theme**
- Theme editor drawer: brand colors, text colors, heading/body font, button radius — written to CSS variables so the whole site updates live.
- Per-section "Design" tab in the inspector: background, heading, text, accent/button color chosen from theme tokens or a custom picker, plus padding size.

**6. Links**
- Any button/link field gets a picker: internal page (from the pages list), external URL, anchor to a section, or file/PDF.

## Technical notes

- Blocks stay `{ id, type, visible, props, design }` JSON; adding `design` is backward compatible with existing saved layouts.
- Theme applies by setting HSL CSS variables on `:root` at runtime from the published theme row; defaults come from `src/index.css` so first paint is never blocked.
- Public pages render defaults immediately and hydrate the saved layout after fetch (no loading spinner regression).
- Inline HTML is sanitized before save and on render.
- Admin gate reuses `useIsAdmin`; all editing UI is admin-only and never shipped into the public render path.

## Order of delivery

I'll build it in the phases above, checking in after phase 2 (multi-page + page creation working) and again after phase 4 (media) so you can try it before the theme work lands.

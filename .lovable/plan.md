# Live preview of selected media in the editor

Make the side-panel media picker show exactly what visitors will see: the fully resolved (signed) URL for anything chosen from the library, for images, videos and PDFs alike.

## What changes

**Media field (used by every section field of type image / video / pdf)**
- Always resolve the stored value through the signed-URL resolver, not just for images.
- Image: show the resolved thumbnail (as today) plus a "resolving…" placeholder while the signed URL is being fetched, and a clear "couldn't load this file" state if it fails.
- Video: show a small inline player for uploaded videos, and a YouTube/Vimeo embed preview for pasted links.
- PDF: show a compact preview card with the file name and an "Open" link that uses the resolved URL.
- Show the resolved destination underneath (truncated, with a copy button) so it is obvious the value points at a real file rather than an unresolved `media:` reference.

**Media library dialog**
- The "Use a URL" tab gets the same live preview before confirming.

**Section safety check**
- Verify every section that renders media resolves it through the same helper, so a picked file never renders as a raw `media:` string. Sections audited: Hero, How It Works, Podcasts & Courses, Image, Page Hero, Video, PDF list, and any list items with image fields.

## Technical notes

- Extend `src/components/pagebuilder/MediaField.tsx` to call `useMediaUrl` for all kinds and add loading/error/preview states; reuse `embedUrl()` from `src/pagebuilder/media.ts` for YouTube/Vimeo.
- Add a small shared `MediaPreview` component so the field and the library's URL tab render identical previews.
- No database, storage or RLS changes; presentation only.

# Serve feature pages from the page editor

## What you'll get
- The six feature pages (Financial Operations, Labor Cost, Food Cost, Employee Training, Essential Forms, Community Support) become editable pages, using their current title, intro and topics. You can change them in the page editor.
- Page text is public. PDFs stay subscriber-only.
- In the PDF list, signed-out visitors see a "Sign in" prompt. Signed-in visitors without a plan see "Start your free trial", which goes to the plans section.

## Steps
1. **App.tsx**: remove the six `/features/*` routes and their page imports. The catch-all page then serves them from the editor. The old page files stay in the project, unused.
2. **Page content**: add a published layout for each of the six `features/...` pages (none have one today). Each layout gets four sections in this order:
   - Page hero: the title and intro from the old page file. The old Community page title "Community & Support" is kept.
   - Text section "Overview": one placeholder line.
   - Text section "Key topics covered": the six current topics as a bulleted list.
   - PDF list: `featureSlug` is the part after "features/". `quickLinkTags` is "prime cost control" for Financial Operations and empty for the other five, matching the old pages.
   
   Blocks use the existing `{ id, type, visible, props }` format, and layouts are saved as `published`. Draft copies are not added, so the editor starts from the published version. The insert runs only for pages that don't already have a published layout. This is a data insert, so it runs as a one-time data update rather than a schema migration.
3. **Locked-state check**: today the "subscribe" case shows "View plans" linking to `/#pricing`, and the "signin" case shows "Sign in" linking to `/auth`. In FeaturePdfLibrary, change the subscribe button label to "Start your free trial". It still links to `/#pricing`, as you chose. The sign-in prompt stays as it is.

## Technical details
- Block ids follow the `blk_...` style. Bulleted topics are stored as `<ul><li>...</li></ul>` in the text section body.
- The old pages' sign-in requirement goes away with their routes. The PDF access check on the server is unchanged.
- Nothing changes in the database structure, so there is no schema change.

## Files
- src/App.tsx
- src/components/features/FeaturePdfLibrary.tsx
- Database: 6 new published page layouts (content only)

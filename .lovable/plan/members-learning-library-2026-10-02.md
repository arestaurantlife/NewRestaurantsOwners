# Members Learning Library

Uses the site's existing colors, fonts and building blocks.

## What you'll get
- **/learn**: a grid of published courses, videos and podcasts. It has filter tabs (All / Courses / Videos / Podcasts), and each card shows a "Free" badge or a lock badge.
- **/learn/:slug**: a player page for YouTube, Vimeo or uploaded videos. A course page lists its lessons in order, and each lesson opens its own player page. Locked items show a lock card instead of the player:
  - Signed-out visitors see "Start 7-Day Free Trial" (to /auth?mode=signup) and "Sign in".
  - Signed-in visitors without the right plan see "Start 7-Day Free Trial", which goes to the plans section (/#pricing). That matches the choice you made for the PDF library, since the sign-up page bounces signed-in users away.
- **/admin/content** (admins only): create and edit items, upload videos and thumbnails, set Free or Subscriber, choose the minimum plan, publish or unpublish, and reorder with up and down arrows.
- **Homepage "Podcasts & Courses" section**: shows the latest 3 published podcasts and 3 published courses, each linking to its player page. Each half hides when it has nothing, and the whole section hides when both are empty. "Browse All Courses" goes to /learn. Headings and other text stay editable in the page editor.
- **Dashboard**: the "Courses" and "Podcasts" Coming Soon cards are replaced by one "Learning Library" card linking to /learn. An admin-only "Manage Content" link goes to /admin/content.
- **Sitemap**: adds /learn.

The library starts empty. After this is built, you add content in /admin/content.

## Steps
1. **Database migration**: create the `content_items` table with the columns from your spec, plus `updated_at` and an update trigger.
   - `slug` is unique.
   - `parent_id` points to another `content_items` row and is removed when that row is deleted.
   - kind, access and min_tier are checked against your allowed values.
   - Access rules: anyone can read published rows, admins can read everything, and only admins can add, edit or delete.
   - Media links are stored in the table, so anyone can see the video link for a published item. To keep Subscriber links private, the public pages read only safe columns, and the playable URL comes only from the server function. Storage files stay in a private bucket either way.
2. **Storage**: create a private `content-media` bucket. Only admins can upload, change or delete files. Nobody else reads files directly; viewers get time-limited links from the server function.
3. **Server function `get-content-url`** (input: slug):
   - It mirrors get-pdf-urls.
   - Free items return their playable URL: the YouTube/Vimeo link, or a 1-hour signed link for an uploaded file.
   - Subscriber items require sign-in, otherwise reason "signin". Admins always pass.
   - Other members need an active or trialing Stripe subscription at or above `min_tier` (starter < professional < enterprise), otherwise reason "subscribe". The plan is matched by the existing product IDs.
4. **Frontend**:
   - New pages: `Learn.tsx`, `LearnItem.tsx`, `AdminContent.tsx`.
   - New data helpers: `src/lib/content.ts`.
   - Routes for the three pages go above the catch-all in App.tsx.
   - Thumbnails are resolved with `useMediaUrl`. The admin page handles uploads directly and can also pick a thumbnail from the media library.
5. **PodcastsCourses.tsx**: replace the hard-coded podcasts and courses with database data. Remove those two list fields from the editor's settings for this section, so nobody edits lists that no longer show. The `coursesHref` default becomes "/learn". Saved layouts that still have "/dashboard" are forced to /learn, as the spec asks.
6. **Dashboard.tsx** and **public/sitemap.xml** updates.

## Technical details
- Uploaded videos play in an HTML5 `<video>` element using the signed link. YouTube and Vimeo links play through `embedUrl`.
- The player page fetches the playable URL from `get-content-url` for every item, free ones included, so the logic lives in one place.
- The homepage list is ordered by created_at descending, limited to 3 per kind.

## Files
- New: src/pages/Learn.tsx, src/pages/LearnItem.tsx, src/pages/AdminContent.tsx, src/lib/content.ts, supabase/functions/get-content-url/index.ts
- Edited: src/App.tsx, src/components/PodcastsCourses.tsx, src/pagebuilder/registry.ts, src/pages/Dashboard.tsx, public/sitemap.xml
- Database: new content_items table and its access rules; new private content-media storage bucket and its access rules

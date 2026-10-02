# Fix every dead link and button

Follows the uploaded brief. Styling, layout and copy stay the same except where the brief says otherwise. Supabase functions, Stripe and the database are not touched.

## What changes for visitors
- Every footer, header and section button goes somewhere real: a section on the homepage, another page, email, phone, or a new tab.
- Links to homepage sections like "/#pricing" scroll smoothly to that section from any page, even when the section loads late. The fixed header no longer hides section titles.
- Both "Start Free Trial" buttons open the sign-up form directly.
- Social icons only show once you add a real link for that network. Twitter is renamed "X".
- In the page editor you can change every button link. You can also add a video to "How It Works", set links on design services, podcasts, courses and suppliers, and show or hide the supplier zip search.

## Steps
1. `src/lib/siteConfig.ts`: holds the domain, email, phone and social links, exactly as the brief lists them.
2. `src/components/ScrollToHash.tsx`, added once in `App.tsx`. If the address has a hash, it looks for that element every 100ms for up to 3s, then smooth-scrolls to it. Otherwise it scrolls to the top. Add `[id]{scroll-margin-top:6rem}` to `index.css`.
3. `src/lib/navigate.ts`: one helper that handles `#id`, `/path`, `https://`, `mailto:` and `tel:`.
4. Footer:
   - Product links point to `/#…`.
   - One "Company" column replaces Resources and Company: About goes to /about, Contact to /contact.
   - Legal: /privacy, /terms, /refund-policy.
   - Internal links use the router's `Link`.
   - Email and phone come from the site config.
   - Social icons are conditional, and Twitter becomes "X".
5. Header: both trial buttons go to `/auth?mode=signup`. Auth opens in sign-up mode when `mode=signup`.
6. Section link fields, registered as type "link" so the editor shows them:
   - **Hero:** primaryHref `#pricing`, secondaryHref `#how-it-works`. The star row hides when the rating text is empty.
   - **HowItWorks:** gets `id="how-it-works"`. primaryHref `#pricing`, secondaryHref `/contact`. New videoUrl field: the play button opens a dialog with the video, using embedUrl for YouTube/Vimeo. With no video, the play button and duration badge are hidden.
   - **CTA:** buttonHref `#pricing`.
   - **DesignServices:** an href per service, plus bannerHref `/contact`.
   - **PodcastsCourses:** coursesHref `/dashboard`, plus an optional href per card. Cards without a link get no pointer cursor and no play overlay.
   - **SupplierFinder:** browseAllHref `/contact`, an optional href per supplier, and showSearch (yes/no, default no) to hide the zip form.

## Note
The About, Contact, Privacy, Terms and Refund Policy pages don't exist yet. Until you create them in the page editor (Pages, then New page, using those exact page addresses), those links will show "page not found". The brief doesn't ask for them, so I won't create placeholder pages unless you want me to.

## Files
New: `src/lib/siteConfig.ts`, `src/lib/navigate.ts`, `src/components/ScrollToHash.tsx`.
Edited: `App.tsx`, `index.css`, `Footer.tsx`, `Header.tsx`, `Auth.tsx`, `pagebuilder/registry.ts`, `Hero.tsx`, `HowItWorks.tsx`, `CTA.tsx`, `DesignServices.tsx`, `PodcastsCourses.tsx`, `SupplierFinder.tsx`.

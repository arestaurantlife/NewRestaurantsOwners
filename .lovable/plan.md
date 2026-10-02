# Brand spelling, SEO tags, password reset, 404 page

No design changes. Stripe and backend functions stay as they are.

1. **Brand spelling**: Index.tsx title becomes "NewRestaurantsOwners.com | ...", canonical uses `SITE.domain`. The welcome message in Auth.tsx becomes "Welcome to NewRestaurantsOwners!".
2. **index.html**: new title, a matching description, author "Corporate Shield Hospitality Solutions LLC", og:title, og:description, og:url (https://newrestaurantsowners.com), og:type, twitter:card. Remove the Lovable image tags and `twitter:site`. Copy hero-restaurant.jpg to public/og-image.jpg. Point og:image and twitter:image at `https://newrestaurantsowners.com/og-image.jpg`. Crawlers need an absolute URL, so the address is written out in full. index.html can't import SITE.
3. **FeaturePageLayout.tsx**: page titles end with "| NewRestaurantsOwners.com".
4. **robots.txt**: keep the current allow-all blocks and add the Sitemap line. **sitemap.xml**: a new static file listing the 12 pages you named, with no lastmod dates.
5. **Password reset**: a "Forgot password?" link on the login form sends the reset email, using the email typed in the box. If the box is empty, it shows a prompt to enter an email. A new /reset-password page has new-password and confirm fields that must match (minimum 6 characters). It saves with `updateUser`, then goes to /dashboard. Its route goes above the catch-all in App.tsx.
6. **NotFound.tsx**: wrap the page with Header and Footer, and add a "Back to home" button using the existing button style.

## Files
- Edited: index.html, src/pages/Index.tsx, src/pages/Auth.tsx, FeaturePageLayout.tsx, public/robots.txt, src/App.tsx, src/pages/NotFound.tsx
- New: public/og-image.jpg, public/sitemap.xml, src/pages/ResetPassword.tsx

Note: these title and share-image changes appear on the live site after the next publish.

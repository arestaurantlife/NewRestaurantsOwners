### Plan

1. Modify `src/components/Hero.tsx`
   - Remove the absolute-positioned, rotated "Website Coming Soon — Under Construction" watermark at the bottom-right.
   - Add it as a second inline-flex badge in the same row as the "Trusted by New Restaurants Owners" badge.
   - Use the same styling as the trust badge:
     - Rounded-full pill shape
     - `bg-gold/20`
     - `border border-gold/30`
     - `text-gold text-sm font-medium`
   - Wrap both badges in a flex container so they sit side-by-side and wrap gracefully on smaller screens.
   - Keep the `watermark` prop editable through the page builder; when empty, hide the badge.

2. No backend or other page changes required.
Plan: Update the hero "Website Coming Soon" watermark banner text and add a looping attention animation.

1. Update the banner text
- Change `heroDefaults.watermark` in `src/components/Hero.tsx` from "Website Coming Soon — Under Construction" to "UNDER CONSTRUCTION - WEBSITE COMING SOON".
- The banner stays in the same location (next to the "Trusted by New Restaurants Owners" badge) and keeps the same pill styling.

2. Add a looping attention animation
- Add a new keyframe animation to `src/index.css` (e.g., `flash-gold-black`) that continuously alternates the text color between the gold token (`text-gold`) and black/charcoal (`text-charcoal` or `text-black`).
- Use `animation: flash-gold-black 1s ease-in-out infinite alternate` so it flashes non-stop without being too aggressive.
- Apply the animation class to the watermark banner text only, leaving the trust badge unchanged.

3. Alternative option (recommended if you want something more polished but still eye-catching)
- Instead of switching the font color between gold and black, keep the text legible as black/charcoal and apply a subtle gold-to-cream background pulse/shimmer on the banner itself. This is often easier to read while still drawing the eye, and it matches the site's premium palette. If you prefer this, I can implement it instead.

Technical notes
- The change is scoped to `Hero.tsx` and `index.css` only.
- No backend or page-builder changes are required; the watermark remains editable via the page builder because the `c.watermark` default value is what drives the default text.
- The animation will use the existing design tokens (`--gold`, `--charcoal`) so it respects the wine/gold/cream theme.
Add a non-intrusive "Website Coming Soon - Under Construction" watermark to the Hero section only.

**What will be changed**
- `src/components/Hero.tsx`: add a single new absolute-positioned watermark element inside the existing `<section>`.
- No other files, components, styles, or existing content will be touched.

**Design approach**
- Use existing design tokens to stay on-brand: a wine/gold/cream treatment with a transparent fill so it reads as a watermark, not a banner.
- Position it where it does not obscure the headline, subheadline, or CTA buttons — for example, a subtle diagonal band across the lower-right quadrant of the hero.
- Keep it decorative: `pointer-events-none`, low opacity, uppercase tracking, and a small-to-medium font size.
- The element will be inserted after the existing content container with a higher z-index so it sits visually on top of the hero overlay but cannot block clicks.

**Implementation detail**
```text
<section className="relative min-h-screen ...">
  ... existing background and content unchanged ...

  <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
    <div className="absolute bottom-12 right-[-5%] ... rotate-[-12deg] ...">
      Website Coming Soon — Under Construction
    </div>
  </div>
</section>
```

**Verification**
- Build the project and check the preview to confirm the text appears in the hero without overlapping the main headline/CTAs on desktop and mobile.
- No console errors from the change.

This is a one-file, additive edit only.
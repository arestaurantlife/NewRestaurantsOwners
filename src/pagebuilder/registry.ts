import Hero, { heroDefaults } from "@/components/Hero";
import Features, { featuresDefaults } from "@/components/Features";
import HowItWorks, { howItWorksDefaults } from "@/components/HowItWorks";
import PodcastsCourses, { podcastsCoursesDefaults } from "@/components/PodcastsCourses";
import DesignServices, { designServicesDefaults } from "@/components/DesignServices";
import SupplierFinder, { supplierFinderDefaults } from "@/components/SupplierFinder";
import Pricing, { pricingDefaults } from "@/components/Pricing";
import Testimonials, { testimonialsDefaults } from "@/components/Testimonials";
import FAQ, { faqDefaults } from "@/components/FAQ";
import CTA, { ctaDefaults } from "@/components/CTA";
import RichTextSection, { richTextDefaults } from "@/components/sections/RichTextSection";
import ImageSection, { imageDefaults } from "@/components/sections/ImageSection";
import VideoSection, { videoDefaults } from "@/components/sections/VideoSection";
import ButtonRowSection, { buttonRowDefaults } from "@/components/sections/ButtonRowSection";
import PageHeroSection, { pageHeroDefaults } from "@/components/sections/PageHeroSection";
import PdfListSection, { pdfListDefaults } from "@/components/sections/PdfListSection";
import SpacerSection, { spacerDefaults } from "@/components/sections/SpacerSection";
import { Block, FieldSchema, ItemFieldSchema, SectionSchema, newId } from "./types";

const t = (key: string, label: string): FieldSchema => ({ key, label, type: "text" });
const ta = (key: string, label: string): FieldSchema => ({ key, label, type: "textarea" });
const rt = (key: string, label: string): FieldSchema => ({ key, label, type: "richtext" });
const img = (key: string, label: string): FieldSchema => ({ key, label, type: "image" });
const vid = (key: string, label: string): FieldSchema => ({ key, label, type: "video" });
const link = (key: string, label: string): FieldSchema => ({ key, label, type: "link" });
const sel = (
  key: string,
  label: string,
  options: { value: string; label: string }[],
): FieldSchema => ({ key, label, type: "select", options });
const list = (key: string, label: string, itemFields: ItemFieldSchema[]): FieldSchema => ({
  key,
  label,
  type: "list",
  itemFields,
  itemDefaults: Object.fromEntries(itemFields.map((f) => [f.key, ""])),
});

const WIDTHS = [
  { value: "narrow", label: "Narrow" },
  { value: "wide", label: "Wide" },
  { value: "full", label: "Full width" },
];

export const SECTIONS: Record<string, SectionSchema> = {
  /* ---------------- Generic building blocks ---------------- */
  pageHero: {
    type: "pageHero",
    label: "Page header",
    group: "Layout",
    Component: PageHeroSection,
    defaults: pageHeroDefaults,
    fields: [
      t("eyebrow", "Eyebrow"),
      t("title", "Heading"),
      ta("subtitle", "Subheading"),
      t("primaryLabel", "Button label"),
      link("primaryHref", "Button link"),
      img("backgroundImage", "Background image"),
    ],
  },
  richText: {
    type: "richText",
    label: "Text block",
    group: "Content",
    Component: RichTextSection,
    defaults: richTextDefaults,
    fields: [
      t("eyebrow", "Eyebrow"),
      t("title", "Heading"),
      rt("body", "Body text"),
      sel("maxWidth", "Width", WIDTHS.slice(0, 2)),
    ],
  },
  image: {
    type: "image",
    label: "Image",
    group: "Media",
    Component: ImageSection,
    defaults: imageDefaults,
    fields: [
      img("src", "Image"),
      t("alt", "Alt text (for accessibility & SEO)"),
      t("caption", "Caption"),
      sel("width", "Width", WIDTHS),
      sel("rounded", "Rounded corners", [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ]),
    ],
  },
  video: {
    type: "video",
    label: "Video",
    group: "Media",
    Component: VideoSection,
    defaults: videoDefaults,
    fields: [
      t("title", "Heading"),
      vid("src", "Video file or YouTube/Vimeo link"),
      img("poster", "Poster image"),
      t("caption", "Caption"),
      sel("width", "Width", WIDTHS.slice(0, 2)),
    ],
  },
  pdfList: {
    type: "pdfList",
    label: "PDF library",
    group: "Media",
    Component: PdfListSection,
    defaults: pdfListDefaults,
    fields: [
      t("title", "Heading"),
      ta("subtitle", "Subheading"),
      t("featureSlug", "Library key (e.g. financial-operations)"),
      t("quickLinkTags", "Quick-link tags (comma separated)"),
    ],
  },
  buttonRow: {
    type: "buttonRow",
    label: "Buttons",
    group: "Content",
    Component: ButtonRowSection,
    defaults: buttonRowDefaults,
    fields: [
      t("title", "Heading"),
      ta("subtitle", "Subheading"),
      t("primaryLabel", "Primary button label"),
      link("primaryHref", "Primary button link"),
      t("secondaryLabel", "Secondary button label"),
      link("secondaryHref", "Secondary button link"),
      sel("align", "Alignment", [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" },
      ]),
    ],
  },
  spacer: {
    type: "spacer",
    label: "Spacer / divider",
    group: "Layout",
    Component: SpacerSection,
    defaults: spacerDefaults,
    fields: [
      sel("height", "Height", [
        { value: "sm", label: "Small" },
        { value: "md", label: "Medium" },
        { value: "lg", label: "Large" },
        { value: "xl", label: "Extra large" },
      ]),
      sel("divider", "Show divider line", [
        { value: "no", label: "No" },
        { value: "yes", label: "Yes" },
      ]),
    ],
  },

  /* ---------------- Marketing sections ---------------- */
  hero: {
    type: "hero",
    label: "Hero",
    group: "Marketing",
    Component: Hero,
    defaults: heroDefaults,
    fields: [
      t("badge", "Badge text"),
      t("titleLead", "Headline (first part)"),
      t("titleAccent", "Headline (gold part)"),
      ta("subtitle", "Subheading"),
      t("primaryCta", "Primary button"),
      t("secondaryCta", "Secondary button"),
      t("ratingText", "Rating text"),
      t("watermark", "Watermark (leave empty to hide)"),
    ],
  },
  features: {
    type: "features",
    label: "Features",
    group: "Marketing",
    Component: Features,
    defaults: featuresDefaults,
    fields: [
      t("eyebrow", "Eyebrow"),
      t("titleLead", "Heading (first part)"),
      t("titleAccent", "Heading (accent)"),
      ta("subtitle", "Subheading"),
      list("items", "Feature cards", [
        { key: "title", label: "Title", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "benefits", label: "Bullets (one per line)", type: "textarea" },
        { key: "href", label: "Link", type: "link" },
      ]),
    ],
  },
  howItWorks: {
    type: "howItWorks",
    label: "How It Works",
    group: "Marketing",
    Component: HowItWorks,
    defaults: howItWorksDefaults,
    fields: [
      t("eyebrow", "Eyebrow"),
      t("title", "Heading"),
      ta("description", "Description"),
      img("imageUrl", "Image"),
      t("durationBadge", "Video badge"),
      list("benefits", "Bullet points", [{ key: "text", label: "Text", type: "text" }]),
      t("primaryCta", "Primary button"),
      t("secondaryCta", "Secondary button"),
    ],
  },
  podcastsCourses: {
    type: "podcastsCourses",
    label: "Podcasts & Courses",
    group: "Marketing",
    Component: PodcastsCourses,
    defaults: podcastsCoursesDefaults,
    fields: [
      t("eyebrow", "Eyebrow"),
      t("title", "Heading"),
      ta("subtitle", "Subheading"),
      t("podcastsHeading", "Podcasts heading"),
      t("podcastsBadge", "Podcasts badge"),
      list("podcasts", "Podcasts", [
        { key: "title", label: "Title", type: "text" },
        { key: "host", label: "Host", type: "text" },
        { key: "role", label: "Role", type: "text" },
        { key: "duration", label: "Duration", type: "text" },
        { key: "rating", label: "Rating", type: "text" },
      ]),
      t("coursesHeading", "Courses heading"),
      list("courses", "Courses", [
        { key: "title", label: "Title", type: "text" },
        { key: "instructor", label: "Instructor", type: "text" },
        { key: "lessons", label: "Lessons", type: "text" },
        { key: "hours", label: "Hours", type: "text" },
        { key: "level", label: "Level", type: "text" },
        { key: "image", label: "Image", type: "image" },
      ]),
      t("coursesCta", "Courses button"),
    ],
  },
  designServices: {
    type: "designServices",
    label: "Design Services",
    group: "Marketing",
    Component: DesignServices,
    defaults: designServicesDefaults,
    fields: [
      t("eyebrow", "Eyebrow"),
      t("title", "Heading"),
      ta("subtitle", "Subheading"),
      list("services", "Services", [
        { key: "title", label: "Title", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "features", label: "Bullets (one per line)", type: "textarea" },
      ]),
      t("bannerTitle", "Banner heading"),
      ta("bannerText", "Banner text"),
      t("bannerCta", "Banner button"),
    ],
  },
  supplierFinder: {
    type: "supplierFinder",
    label: "Supplier Finder",
    group: "Marketing",
    Component: SupplierFinder,
    defaults: supplierFinderDefaults,
    fields: [
      t("eyebrow", "Eyebrow"),
      t("title", "Heading"),
      ta("subtitle", "Subheading"),
      t("searchPlaceholder", "Search placeholder"),
      t("searchButton", "Search button"),
      list("categories", "Categories", [
        { key: "name", label: "Name", type: "text" },
        { key: "count", label: "Count", type: "text" },
      ]),
      t("featuredHeading", "Featured heading"),
      list("suppliers", "Featured suppliers", [
        { key: "name", label: "Name", type: "text" },
        { key: "category", label: "Category", type: "text" },
        { key: "rating", label: "Rating", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
      ]),
      t("browseAll", "Browse all button"),
      t("stat1Value", "Stat 1 value"),
      t("stat1Label", "Stat 1 label"),
      t("stat2Value", "Stat 2 value"),
      t("stat2Label", "Stat 2 label"),
      t("stat3Value", "Stat 3 value"),
      t("stat3Label", "Stat 3 label"),
    ],
  },
  pricing: {
    type: "pricing",
    label: "Pricing",
    group: "Marketing",
    Component: Pricing,
    defaults: pricingDefaults,
    fields: [
      t("eyebrow", "Eyebrow"),
      t("titleLead", "Heading (first part)"),
      t("titleAccent", "Heading (accent)"),
      ta("subtitle", "Subheading"),
      list("plans", "Plans", [
        { key: "name", label: "Name", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "price", label: "Price", type: "text" },
        { key: "period", label: "Period", type: "text" },
        { key: "features", label: "Features (one per line)", type: "textarea" },
        { key: "popular", label: "Highlighted? (yes/no)", type: "text" },
      ]),
      t("guarantee", "Guarantee line"),
    ],
  },
  testimonials: {
    type: "testimonials",
    label: "Testimonials",
    group: "Marketing",
    Component: Testimonials,
    defaults: testimonialsDefaults,
    fields: [
      t("eyebrow", "Eyebrow"),
      t("titleLead", "Heading (first part)"),
      t("titleAccent", "Heading (accent)"),
      ta("subtitle", "Subheading"),
      list("items", "Testimonials", [
        { key: "quote", label: "Quote", type: "textarea" },
        { key: "author", label: "Author", type: "text" },
        { key: "role", label: "Role", type: "text" },
      ]),
    ],
  },
  faq: {
    type: "faq",
    label: "FAQ",
    group: "Marketing",
    Component: FAQ,
    defaults: faqDefaults,
    fields: [
      t("eyebrow", "Eyebrow"),
      t("titleLead", "Heading (first part)"),
      t("titleAccent", "Heading (accent)"),
      ta("subtitle", "Subheading"),
      list("items", "Questions", [
        { key: "question", label: "Question", type: "text" },
        { key: "answer", label: "Answer", type: "textarea" },
      ]),
    ],
  },
  cta: {
    type: "cta",
    label: "Call To Action",
    group: "Marketing",
    Component: CTA,
    defaults: ctaDefaults,
    fields: [
      t("title", "Heading"),
      ta("subtitle", "Subheading"),
      t("buttonLabel", "Button label"),
      t("footnote", "Footnote"),
    ],
  },
};

export const DEFAULT_ORDER = [
  "hero",
  "features",
  "howItWorks",
  "podcastsCourses",
  "designServices",
  "supplierFinder",
  "pricing",
  "testimonials",
  "faq",
  "cta",
];

export const defaultBlocks = (): Block[] =>
  DEFAULT_ORDER.map((type) => ({ id: newId(), type, visible: true, props: {} }));

/** Starting layout for a brand-new custom page. */
export const blankPageBlocks = (title: string): Block[] => [
  { id: newId(), type: "pageHero", visible: true, props: { title } },
  { id: newId(), type: "richText", visible: true, props: {} },
];

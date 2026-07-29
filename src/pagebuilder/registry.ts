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
import { Block, FieldSchema, SectionSchema, newId } from "./types";

const t = (key: string, label: string): FieldSchema => ({ key, label, type: "text" });
const ta = (key: string, label: string): FieldSchema => ({ key, label, type: "textarea" });
const list = (
  key: string,
  label: string,
  itemFields: { key: string; label: string; type: "text" | "textarea" }[],
): FieldSchema => ({
  key,
  label,
  type: "list",
  itemFields,
  itemDefaults: Object.fromEntries(itemFields.map((f) => [f.key, ""])),
});

export const SECTIONS: Record<string, SectionSchema> = {
  hero: {
    type: "hero",
    label: "Hero",
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
        { key: "href", label: "Link", type: "text" },
      ]),
    ],
  },
  howItWorks: {
    type: "howItWorks",
    label: "How It Works",
    Component: HowItWorks,
    defaults: howItWorksDefaults,
    fields: [
      t("eyebrow", "Eyebrow"),
      t("title", "Heading"),
      ta("description", "Description"),
      t("imageUrl", "Image URL"),
      t("durationBadge", "Video badge"),
      list("benefits", "Bullet points", [{ key: "text", label: "Text", type: "text" }]),
      t("primaryCta", "Primary button"),
      t("secondaryCta", "Secondary button"),
    ],
  },
  podcastsCourses: {
    type: "podcastsCourses",
    label: "Podcasts & Courses",
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
        { key: "image", label: "Image URL", type: "text" },
      ]),
      t("coursesCta", "Courses button"),
    ],
  },
  designServices: {
    type: "designServices",
    label: "Design Services",
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

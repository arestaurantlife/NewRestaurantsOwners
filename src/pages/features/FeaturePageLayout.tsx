import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, LucideIcon } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import FeaturePdfLibrary from "@/components/features/FeaturePdfLibrary";

interface FeaturePageLayoutProps {
  icon: LucideIcon;
  title: string;
  intro: string;
  overview: ReactNode;
  topics: string[];
  /** URL slug used to scope PDFs in storage + DB, e.g. "financial-operations" */
  featureSlug: string;
  /** Tags to surface as featured quick-open PDF links above the library. */
  quickLinkTags?: string[];
  metaTitle?: string;
  metaDescription?: string;
}

const FeaturePageLayout = ({
  icon: Icon,
  title,
  intro,
  overview,
  topics,
  featureSlug,
  metaTitle,
  metaDescription,
}: FeaturePageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>{metaTitle || `${title} | Corporate Shield Hospitality`}</title>
        <meta name="description" content={metaDescription || intro.slice(0, 155)} />
      </Helmet>

      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-warm py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link
              to="/#features"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all features
            </Link>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center">
                <Icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground">
                {title}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">{intro}</p>
          </div>
        </section>

        {/* Overview */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
              Overview
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              {overview}
            </div>
          </div>
        </section>

        {/* Topics */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
              Key topics covered
            </h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {topics.map((topic) => (
                <li
                  key={topic}
                  className="flex items-start gap-2 text-foreground bg-card border border-border rounded-lg p-4"
                >
                  <span className="text-gold mt-1">●</span>
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* PDF Resources */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              PDF Resources
            </h2>
            <p className="text-muted-foreground mb-8">
              Open any PDF below to read it in-app, or download for offline use.
            </p>
            <FeaturePdfLibrary featureSlug={featureSlug} />
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-warm">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Explore more features
            </h2>
            <p className="text-muted-foreground mb-6">
              Discover the rest of the toolkit built for new restaurant owners.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link to="/#features">All Features</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FeaturePageLayout;

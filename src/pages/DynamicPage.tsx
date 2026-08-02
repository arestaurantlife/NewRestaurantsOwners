import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBuilder from "@/components/pagebuilder/PageBuilder";
import NotFound from "./NotFound";
import { supabase } from "@/integrations/supabase/client";
import { SitePage } from "@/pagebuilder/usePages";

/** Renders any editable page stored in the CMS, matched by URL slug. */
const DynamicPage = () => {
  const location = useLocation();
  const slug = location.pathname.replace(/^\/+|\/+$/g, "");
  const [page, setPage] = useState<SitePage | null>(null);
  const [state, setState] = useState<"loading" | "found" | "missing">("loading");

  useEffect(() => {
    let cancelled = false;
    setState("loading");
    supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        setPage((data as SitePage) ?? null);
        setState(data ? "found" : "missing");
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (state === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (state === "missing" || !page) return <NotFound />;

  return (
    <>
      <Helmet>
        <title>{page.title}</title>
        {page.meta_description ? (
          <meta name="description" content={page.meta_description} />
        ) : null}
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 md:pt-20">
          <PageBuilder slug={page.slug} />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default DynamicPage;

import { useEffect } from "react";
import { useSiteTheme } from "@/pagebuilder/theme";

/** Applies the published site theme (colors/fonts) on every page. */
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { tokens } = useSiteTheme("published");
  useEffect(() => {
    // useSiteTheme already applies tokens; this keeps the dependency explicit.
  }, [tokens]);
  return <>{children}</>;
};

export default ThemeProvider;

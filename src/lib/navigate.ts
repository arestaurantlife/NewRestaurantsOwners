import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/** Returns a function that follows any link: "#id", "/path", "https://", "mailto:", "tel:". */
export function useGo() {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (href?: string | null) => {
      const h = (href ?? "").trim();
      if (!h || h === "#") return;
      if (h.startsWith("#")) {
        if (location.pathname === "/") {
          document.getElementById(h.slice(1))?.scrollIntoView({ behavior: "smooth" });
          window.history.replaceState(null, "", h);
        } else {
          navigate(`/${h}`);
        }
        return;
      }
      if (/^https?:\/\//i.test(h)) {
        window.open(h, "_blank", "noopener,noreferrer");
        return;
      }
      if (/^(mailto|tel):/i.test(h)) {
        window.location.href = h;
        return;
      }
      navigate(h.startsWith("/") ? h : `/${h}`);
    },
    [navigate, location.pathname],
  );
}

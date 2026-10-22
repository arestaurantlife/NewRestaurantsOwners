import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import OAuthConsent from "./pages/OAuthConsent";
import ProtectedRoute from "./components/ProtectedRoute";
import ResetPassword from "./pages/ResetPassword";
import Learn from "./pages/Learn";
import LearnItem from "./pages/LearnItem";
import AdminContent from "./pages/AdminContent";
import AdminRefundCheck from "./pages/AdminRefundCheck";
import Contact from "./pages/Contact";
import Library from "./pages/Library";
import DynamicPage from "./pages/DynamicPage";
import ScrollToHash from "./components/ScrollToHash";
import ThemeProvider from "./components/pagebuilder/ThemeProvider";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Refunds from "./pages/Refunds";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

// Other pages already render the shared footer themselves.
const SupplementalFooter = () => {
  const { pathname } = useLocation();
  return ["/auth", "/reset-password", "/dashboard", "/.lovable/oauth/consent"].includes(pathname) ? <Footer /> : null;
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToHash />
          <AuthProvider>
            <ThemeProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/learn/:slug" element={<LearnItem />} />
                <Route path="/admin/content" element={<AdminContent />} />
                <Route path="/admin/refund-check" element={<AdminRefundCheck />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/refunds" element={<Refunds />} />
                <Route path="/library" element={<Library />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                {/* Any other URL is resolved against CMS pages, falling back to 404 */}
                <Route path="*" element={<DynamicPage />} />
              </Routes>
              <SupplementalFooter />
            </ThemeProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

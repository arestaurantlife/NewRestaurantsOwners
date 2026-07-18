import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import OAuthConsent from "./pages/OAuthConsent";
import ProtectedRoute from "./components/ProtectedRoute";
import SubscriberRoute from "./components/SubscriberRoute";
import FinancialOperations from "./pages/features/FinancialOperations";
import LaborCostManagement from "./pages/features/LaborCostManagement";
import FoodCostControl from "./pages/features/FoodCostControl";
import EmployeeTraining from "./pages/features/EmployeeTraining";
import EssentialForms from "./pages/features/EssentialForms";
import CommunitySupport from "./pages/features/CommunitySupport";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/features/financial-operations" element={<SubscriberRoute><FinancialOperations /></SubscriberRoute>} />
              <Route path="/features/labor-cost-management" element={<SubscriberRoute><LaborCostManagement /></SubscriberRoute>} />
              <Route path="/features/food-cost-control" element={<SubscriberRoute><FoodCostControl /></SubscriberRoute>} />
              <Route path="/features/employee-training" element={<SubscriberRoute><EmployeeTraining /></SubscriberRoute>} />
              <Route path="/features/essential-forms" element={<SubscriberRoute><EssentialForms /></SubscriberRoute>} />
              <Route path="/features/community-support" element={<SubscriberRoute><CommunitySupport /></SubscriberRoute>} />
              <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

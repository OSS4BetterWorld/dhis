import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import HazardDetail from "./pages/HazardDetail";
import CitizenRiskMap from "./pages/CitizenRiskMap";
import AdminRiskMap from "./pages/AdminRiskMap";
import IncidentReport from "./pages/IncidentReport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/hazard/:hazardType" element={<HazardDetail />} />
          <Route path="/risk-map" element={<CitizenRiskMap />} />
          <Route path="/admin/risk-map" element={<AdminRiskMap />} />
          <Route path="/incident-report" element={<IncidentReport />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from "@/components/common/ErrorBoundary";
import InstallPrompt from "@/components/common/InstallPrompt";
import UpdatePrompt from "@/components/common/UpdatePrompt";
import { SmartDentalChatbot } from "@/components/SmartDentalChatbot";
import CriticalResourceLoader from "@/components/optimized/CriticalResourceLoader";
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import PatientDashboardPage from "./pages/PatientDashboard";
import Feedback from "./pages/Feedback";

// Initialize QueryClient once outside component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <CriticalResourceLoader />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/patient-dashboard" element={<PatientDashboardPage />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <SmartDentalChatbot />
            <InstallPrompt />
            <UpdatePrompt />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;

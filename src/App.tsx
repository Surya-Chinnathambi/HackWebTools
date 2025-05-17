
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import Sidebar from "./components/Layout/Sidebar";
import Tools from "./pages/Tools";
import ToolDetail from "./pages/ToolDetail";
import Payloads from "./pages/Payloads";
import PayloadCategories from "./pages/PayloadCategories";
import XSS from "./pages/XSS";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col dark:bg-background">
          <Header />
          <div className="flex-1 container mx-auto px-4 md:px-6 py-8">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route 
                path="/tools" 
                element={
                  <div className="flex flex-col md:flex-row gap-8 animate-fade-in">
                    <Sidebar className="hidden md:block" />
                    <main className="flex-1">
                      <Tools />
                    </main>
                  </div>
                } 
              />
              <Route 
                path="/tools/:toolId" 
                element={
                  <div className="flex flex-col md:flex-row gap-8 animate-fade-in">
                    <Sidebar className="hidden md:block" />
                    <main className="flex-1">
                      <ToolDetail />
                    </main>
                  </div>
                } 
              />
              <Route path="/payloads" element={<Payloads />} />
              <Route path="/payload-categories" element={<PayloadCategories />} />
              <Route path="/xss" element={<XSS />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

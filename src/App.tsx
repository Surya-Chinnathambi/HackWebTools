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
import EncoderDecoder from "./pages/EncoderDecoder";
import ReverseShellGenerator from "./pages/ReverseShellGenerator";
import CommandGenerator from "./pages/CommandGenerator";
import PayloadHistory from "./pages/PayloadHistory";
import XSSTester from "./pages/XSSTester";
import ReportGenerator from "./pages/ReportGenerator";
import ExploitDB from "./pages/ExploitDB";
import WordlistGenerator from "./pages/WordlistGenerator";
import APISecurityTester from "./pages/APISecurityTester";
import PortScanner from "./pages/PortScanner";
import HashCracker from "./pages/HashCracker";
import OWASPLab from "./pages/OWASPLab";
import AdvancedVulnScanner from "./pages/AdvancedVulnScanner";
import ThreatIntelligence from "./pages/ThreatIntelligence";
import Dashboard from "./pages/Dashboard";
import LearningHub from "./pages/LearningHub";
import Labs from "./pages/Labs";
import Progress from "./pages/Progress";
import Glossary from "./pages/Glossary";
import InterviewPrep from "./pages/InterviewPrep";
import BlueTeam from "./pages/BlueTeam";
import KeyboardShortcuts from "./components/KeyboardShortcuts";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* Skip to main content for keyboard navigation */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg"
          >
            Skip to main content
          </a>
          <div className="min-h-screen flex flex-col dark:bg-background">
            <Header />
            <main id="main-content" className="flex-1 container mx-auto px-4 md:px-6 py-8" role="main">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
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
                <Route path="/payload-history" element={<PayloadHistory />} />
                <Route path="/xss" element={<XSS />} />
                <Route path="/encoder-decoder" element={<EncoderDecoder />} />
                <Route path="/reverse-shell" element={<ReverseShellGenerator />} />
                <Route path="/command-generator" element={<CommandGenerator />} />
                <Route path="/xss-tester" element={<XSSTester />} />
                <Route path="/report-generator" element={<ReportGenerator />} />
                <Route path="/exploit-db" element={<ExploitDB />} />
                <Route path="/wordlist-generator" element={<WordlistGenerator />} />
                <Route path="/api-security-tester" element={<APISecurityTester />} />
                <Route path="/port-scanner" element={<PortScanner />} />
                <Route path="/hash-cracker" element={<HashCracker />} />
                <Route path="/owasp-lab" element={<OWASPLab />} />
                <Route path="/advanced-vuln-scanner" element={<AdvancedVulnScanner />} />
                <Route path="/threat-intelligence" element={<ThreatIntelligence />} />
                <Route path="/learning-hub" element={<LearningHub />} />
                <Route path="/labs" element={<Labs />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/glossary" element={<Glossary />} />
                <Route path="/interview-prep" element={<InterviewPrep />} />
                <Route path="/blue-team" element={<BlueTeam />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <KeyboardShortcuts />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>

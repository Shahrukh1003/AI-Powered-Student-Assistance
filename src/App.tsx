import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import Index from "./pages/Index";
import Chatbot from "./pages/Chatbot";
import Updates from "./pages/Updates";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import AITest from "./components/AITest";

const queryClient = new QueryClient();

const AppContent = () => {
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-reva-dark">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 relative animate-pulse-slow">
            <div className="absolute inset-0 rounded-full bg-reva-blue/20 animate-ping"></div>
            <div className="relative w-full h-full flex items-center justify-center">
              <svg 
                className="w-10 h-10 text-reva-blue" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M10 10H14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <p className="mt-4 font-medium text-white/80 animate-pulse-slow">
            Loading RevaBot...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen overflow-x-hidden ${theme === 'light' ? 'light-mode' : 'bg-reva-dark text-white'}`}>
      <Navbar />
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/ai-test" element={<AITest />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

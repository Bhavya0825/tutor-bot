import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import Index from "./pages/Index";
import ChatInterface from "./components/ChatInterface";
import QuizMode from "./components/QuizMode";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* === FIX: Add flex flex-col to make this a flex container === */}
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          <BrowserRouter>
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-background/95 backdrop-blur">
              <div className="container h-14 flex items-center max-w-6xl mx-auto px-4">
                <Link to="/" className="mr-6 flex items-center space-x-2">
                  <span className="font-bold text-lg">TutorIQ</span>
                </Link>
                <div className="flex flex-1 items-center justify-end">
                  <Button onClick={toggleDarkMode} variant="ghost" size="icon">
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </div>
              </div>
            </header>

            {/* === FIX: Add flex-grow to make the main content expand === */}
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/chat" element={<ChatInterface />} />
                <Route path="/quiz" element={<QuizMode />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            {/* Footer (will now be pushed to the bottom) */}
            <footer className="py-6 border-t border-gray-200 dark:border-gray-700 bg-background/95">
              <div className="container flex items-center justify-center">
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  TutorIQ © {new Date().getFullYear()}. All rights reserved.
                </p>
              </div>
            </footer>
          </BrowserRouter>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
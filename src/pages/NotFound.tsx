
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
          <div className="text-center max-w-md mx-auto p-8 rounded-xl glass-card animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-6">
              <span className="text-2xl font-bold">404</span>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
            
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              The page you're looking for doesn't exist or has been moved to another URL.
            </p>
            
            <Button asChild size="lg" className="rounded-full px-6 animate-pulse">
              <a href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </a>
            </Button>
          </div>
        </main>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default NotFound;

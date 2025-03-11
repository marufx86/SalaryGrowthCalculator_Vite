
import { useRef, useEffect } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SalaryCalculator } from "@/components/SalaryCalculator";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

export default function Index() {
  const featuresRef = useRef<HTMLDivElement>(null);
  
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Parallax effect for the hero section
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroSection = document.getElementById('hero-section');
      if (heroSection) {
        heroSection.style.backgroundPositionY = `${scrollY * 0.5}px`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen flex flex-col calculation-pattern">
        <Header />
        
        {/* Hero Section */}
        <section 
          id="hero-section"
          className="relative pt-28 pb-20 flex flex-col items-center justify-center text-center px-4 overflow-hidden"
          style={{ minHeight: '80vh' }}
        >
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-block animate-fade-in">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground mb-4 inline-block">
                Calculate Your Future Earnings
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mt-4 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent dark:from-blue-400 dark:to-indigo-300 animate-fade-in" style={{ animationDelay: '200ms' }}>
              Plan Your Salary Growth
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in" style={{ animationDelay: '400ms' }}>
              Understand the real value of your salary increases and plan your financial future with our intuitive calculator.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '600ms' }}>
              <Button onClick={scrollToFeatures} size="lg" className="rounded-full px-8 transition-all transform hover:translate-y-[-2px] shadow-md hover:shadow-lg bg-gradient-to-r from-primary to-accent text-white">
                <Calculator className="mr-2 h-5 w-5" /> Get Started
              </Button>
            </div>
          </div>
          
          {/* Background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-accent/10 dark:bg-accent/20 rounded-full blur-3xl"></div>
          </div>
        </section>
        
        {/* Calculator Section */}
        <section ref={featuresRef} className="py-16 px-4 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-2 bg-primary/10 dark:bg-primary/20 rounded-xl mb-4">
                <Calculator className="h-5 w-5 text-primary dark:text-primary-foreground" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300">
                Salary Growth Calculator
              </h2>
              <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400">
                Calculate your salary growth, adjust for inflation, and convert between currencies.
              </p>
            </div>
            
            <SalaryCalculator />
          </div>
          
          {/* Background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[30%] right-[5%] w-72 h-72 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl opacity-70"></div>
            <div className="absolute bottom-[10%] left-[10%] w-64 h-64 bg-accent/5 dark:bg-accent/10 rounded-full blur-3xl opacity-70"></div>
          </div>
        </section>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
}

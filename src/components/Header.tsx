
import { ThemeToggle } from "./ThemeToggle";
import { useState, useEffect } from "react";
import { Calculator } from "lucide-react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Calculator className="h-5 w-5" />
          </div>
          <h1
            className={`text-xl font-medium tracking-tight transition-all ${
              scrolled
                ? "text-slate-900 dark:text-white"
                : "text-slate-900 dark:text-white"
            }`}
          >
            Salary Growth Calculator
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

import { Link, useLocation } from "wouter";
import { Search, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Alojamientos", href: "/apartments" },
    { name: "Equipamiento", href: "/equipment" },
    { name: "Cómo Funciona", href: "/how-it-works" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b",
        isScrolled 
          ? "bg-white/80 backdrop-blur-md border-border shadow-sm py-3" 
          : "bg-white/50 backdrop-blur-sm border-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
              <img 
                src={`${import.meta.env.BASE_URL}images/logo.png`} 
                alt="Snowmarket Logo" 
                className="w-6 h-6 brightness-0 invert" 
              />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-foreground">
              Snowmarket
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-semibold transition-colors duration-200",
                  location === link.href 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
              Ingresar
            </button>
            <button className="px-5 py-2.5 bg-foreground text-background rounded-full text-sm font-bold shadow-md hover:bg-primary hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5">
              Publicar
            </button>
          </div>

          {/* Mobile toggle */}
          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-border p-4 flex flex-col gap-4 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg font-semibold text-foreground py-2 border-b border-border/50"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex flex-col gap-3 mt-4">
            <button className="px-5 py-3 w-full border-2 border-border text-foreground rounded-xl font-bold">
              Ingresar
            </button>
            <button className="px-5 py-3 w-full bg-primary text-primary-foreground rounded-xl font-bold">
              Publicar
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

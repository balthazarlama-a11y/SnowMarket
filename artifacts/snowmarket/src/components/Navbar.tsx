import { Link, useLocation } from "wouter";
import { Package, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHeroPage = location === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Alojamientos", href: "/apartments" },
    { name: "Equipamiento", href: "/equipment" },
    { name: "Publicar", href: "/publish" },
  ];

  const transparent = isHeroPage && !isScrolled;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 border-b ${
        transparent
          ? "bg-transparent border-transparent py-6"
          : "bg-[#f4f8fc]/95 backdrop-blur-md border-[#d8e8f4] shadow-[0_4px_20px_rgba(26,61,43,0.05)] py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded bg-[#0d2137] flex items-center justify-center shadow-md shadow-[#0d2137]/20">
              <Package className="w-5 h-5 text-[#f4f8fc]" />
            </div>
            <span
              className={`font-display font-bold text-2xl tracking-tight transition-colors duration-300 ${
                transparent ? "text-[#f4f8fc]" : "text-[#0d2137]"
              }`}
            >
              Snowmarket
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wide transition-colors duration-300 ${
                  location === link.href
                    ? transparent ? "text-white font-semibold" : "text-[#3b9fd6]"
                    : transparent
                      ? "text-[#f4f8fc]/80 hover:text-white"
                      : "text-[#3f5d75] hover:text-[#3b9fd6]"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-6">
            <button
              className={`text-sm transition-colors duration-300 ${
                transparent ? "text-white" : "text-[#0d2137]"
              } hover:text-[#3b9fd6]`}
            >
              Ingresar
            </button>
            <Link
              href="/publish"
              className="px-6 py-2.5 bg-[#0d2137] text-[#f4f8fc] text-sm tracking-wide shadow-lg shadow-[#0d2137]/20 hover:bg-[#081828] transition-all duration-300 border border-[#0d2137]"
            >
              Publicar
            </Link>
          </div>

          <button
            className={`md:hidden p-2 ${transparent ? "text-white" : "text-[#0d2137]"}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#f4f8fc] border-b border-[#d8e8f4] p-6 flex flex-col gap-6 shadow-2xl">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className={`font-display text-xl py-2 border-b border-[#d8e8f4]/50 ${location === "/" ? "text-[#3b9fd6]" : "text-[#0d2137]"}`}>Inicio</Link>
          <Link href="/apartments" onClick={() => setMobileMenuOpen(false)} className={`font-display text-xl py-2 border-b border-[#d8e8f4]/50 ${location === "/apartments" ? "text-[#3b9fd6]" : "text-[#0d2137]"}`}>Alojamientos</Link>
          <Link href="/equipment" onClick={() => setMobileMenuOpen(false)} className={`font-display text-xl py-2 border-b border-[#d8e8f4]/50 ${location === "/equipment" ? "text-[#3b9fd6]" : "text-[#0d2137]"}`}>Equipamiento</Link>
          <div className="flex flex-col gap-4 mt-4">
            <button className="px-6 py-3 w-full border border-[#0d2137] text-[#0d2137] font-display text-lg">
              Ingresar
            </button>
            <Link href="/publish" onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 w-full bg-[#0d2137] text-[#f4f8fc] font-display text-lg text-center">
              Publicar
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

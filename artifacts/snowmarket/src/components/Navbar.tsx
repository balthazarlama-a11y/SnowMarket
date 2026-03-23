import { Link, useLocation } from "wouter";
import { Package, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Alojamientos", href: "/apartments" },
    { name: "Equipamiento", href: "/equipment" },
    { name: "Experiencias", href: "/experiences" },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 border-b ${
        isScrolled
          ? "bg-[#f8f5ef]/95 backdrop-blur-md border-[#e8dfce] shadow-[0_4px_20px_rgba(26,61,43,0.05)] py-4"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded bg-[#1a3d2b] flex items-center justify-center shadow-md shadow-[#1a3d2b]/20">
              <Package className="w-5 h-5 text-[#f8f5ef]" />
            </div>
            <span
              className={`font-display font-bold text-2xl tracking-tight transition-colors duration-300 ${
                isScrolled ? "text-[#1a3d2b]" : "text-[#f8f5ef]"
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
                    ? isScrolled ? "text-[#c9882a]" : "text-white font-semibold"
                    : isScrolled
                      ? "text-[#5a5a5a] hover:text-[#c9882a]"
                      : "text-[#f8f5ef]/80 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-6">
            <button
              className={`text-sm transition-colors duration-300 ${
                isScrolled ? "text-[#1a3d2b]" : "text-white"
              } hover:text-[#c9882a]`}
            >
              Ingresar
            </button>
            <button className="px-6 py-2.5 bg-[#1a3d2b] text-[#f8f5ef] text-sm tracking-wide shadow-lg shadow-[#1a3d2b]/20 hover:bg-[#132c1f] transition-all duration-300 border border-[#1a3d2b]">
              Publicar
            </button>
          </div>

          <button
            className={`md:hidden p-2 ${isScrolled ? "text-[#1a3d2b]" : "text-white"}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#f8f5ef] border-b border-[#e8dfce] p-6 flex flex-col gap-6 shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-xl text-[#1a3d2b] py-2 border-b border-[#e8dfce]/50"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex flex-col gap-4 mt-4">
            <button className="px-6 py-3 w-full border border-[#1a3d2b] text-[#1a3d2b] font-display text-lg">
              Ingresar
            </button>
            <button className="px-6 py-3 w-full bg-[#1a3d2b] text-[#f8f5ef] font-display text-lg">
              Publicar
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

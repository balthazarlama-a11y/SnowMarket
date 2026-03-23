import { Link } from "wouter";
import { Package } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#11261b] text-[#e8dfce] py-16 border-t border-[#1a3d2b]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 opacity-80 hover:opacity-100 transition-opacity">
              <div className="w-8 h-8 rounded bg-[#f8f5ef] flex items-center justify-center">
                <Package className="w-4 h-4 text-[#11261b]" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-[#f8f5ef]">
                Snowmarket
              </span>
            </Link>
            <p className="text-[#8a8a8a] max-w-sm font-light leading-relaxed">
              Elevando la experiencia en la montaña. El primer refugio digital para la compra y arriendo alpino en Chile.
            </p>
          </div>

          <div>
            <h4 className="font-display text-[#f8f5ef] mb-6 uppercase tracking-widest text-xs">Descubrir</h4>
            <ul className="space-y-4 font-light text-sm text-[#8a8a8a]">
              <li><Link href="/apartments" className="hover:text-[#c9882a] transition-colors">La Colección</Link></li>
              <li><Link href="/equipment" className="hover:text-[#c9882a] transition-colors">Equipamiento</Link></li>
              <li><Link href="/how-it-works" className="hover:text-[#c9882a] transition-colors">Cómo funciona</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-[#f8f5ef] mb-6 uppercase tracking-widest text-xs">Soporte</h4>
            <ul className="space-y-4 font-light text-sm text-[#8a8a8a]">
              <li><Link href="/faq" className="hover:text-[#c9882a] transition-colors">Asistencia</Link></li>
              <li><Link href="/terms" className="hover:text-[#c9882a] transition-colors">Garantía de calidad</Link></li>
              <li><Link href="/contact" className="hover:text-[#c9882a] transition-colors">Contacto</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#1a3d2b] text-xs text-[#5a5a5a] uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} Snowmarket.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-[#e8dfce] transition-colors">Privacidad</Link>
            <Link href="/terms" className="hover:text-[#e8dfce] transition-colors">Términos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

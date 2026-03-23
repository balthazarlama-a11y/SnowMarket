import { Link } from "wouter";
import { Package } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#060f1b] text-[#d8e8f4] py-16 border-t border-[#0d2137]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 opacity-80 hover:opacity-100 transition-opacity">
              <div className="w-8 h-8 rounded bg-[#f4f8fc] flex items-center justify-center">
                <Package className="w-4 h-4 text-[#060f1b]" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-[#f4f8fc]">
                Snowmarket
              </span>
            </Link>
            <p className="text-[#6e8fa6] max-w-sm font-light leading-relaxed">
              Elevando la experiencia en la montaña. El primer refugio digital para la compra y arriendo alpino en Chile.
            </p>
          </div>

          <div>
            <h4 className="font-display text-[#f4f8fc] mb-6 uppercase tracking-widest text-xs">Descubrir</h4>
            <ul className="space-y-4 font-light text-sm text-[#6e8fa6]">
              <li><Link href="/apartments" className="hover:text-[#3b9fd6] transition-colors">La Colección</Link></li>
              <li><Link href="/equipment" className="hover:text-[#3b9fd6] transition-colors">Equipamiento</Link></li>
              <li><Link href="/how-it-works" className="hover:text-[#3b9fd6] transition-colors">Cómo funciona</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-[#f4f8fc] mb-6 uppercase tracking-widest text-xs">Soporte</h4>
            <ul className="space-y-4 font-light text-sm text-[#6e8fa6]">
              <li><Link href="/faq" className="hover:text-[#3b9fd6] transition-colors">Asistencia</Link></li>
              <li><Link href="/terms" className="hover:text-[#3b9fd6] transition-colors">Garantía de calidad</Link></li>
              <li><Link href="/contact" className="hover:text-[#3b9fd6] transition-colors">Contacto</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#0d2137] text-xs text-[#3f5d75] uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} Snowmarket.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-[#d8e8f4] transition-colors">Privacidad</Link>
            <Link href="/terms" className="hover:text-[#d8e8f4] transition-colors">Términos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

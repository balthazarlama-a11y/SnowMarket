import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 group mb-6">
              <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center">
                <img 
                  src={`${import.meta.env.BASE_URL}images/logo.png`} 
                  alt="Snowmarket Logo" 
                  className="w-5 h-5" 
                />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-background">
                Snowmarket
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
              El marketplace premium para los amantes de la nieve. Encuentra alojamientos verificados y compra o vende equipamiento de ski y snowboard con total seguridad.
            </p>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-lg mb-6">Plataforma</h4>
            <ul className="space-y-4">
              <li><Link href="/apartments" className="text-sm text-muted-foreground hover:text-white transition-colors">Alojamientos</Link></li>
              <li><Link href="/equipment" className="text-sm text-muted-foreground hover:text-white transition-colors">Equipamiento</Link></li>
              <li><Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-white transition-colors">Cómo funciona la Bodega</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-lg mb-6">Soporte</h4>
            <ul className="space-y-4">
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-white transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-white transition-colors">Términos y Condiciones</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-white transition-colors">Contacto</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Snowmarket. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Hecho para la montaña 🏔️</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

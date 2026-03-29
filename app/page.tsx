import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingBag,
  Building2,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
  Upload,
  Search,
  Handshake,
  Truck,
  Percent,
  Mail,
  Phone,
  HelpCircle,
  CheckCircle2,
  Star,
  CalendarDays,
  KeyRound,
  Snowflake,
  Footprints,
  Shirt,
  HardHat,
  Glasses,
  Puzzle,
  Recycle,
  MapPin,
  Clock,
  Heart,
} from "lucide-react";
import { HeroSearchForm } from "./components/HeroSearchForm";
import { ADMIN_WHATSAPP, CATEGORY_LABELS } from "@/lib/constants";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  esquis: <Snowflake className="size-7" />,
  botas: <Footprints className="size-7" />,
  ropa_de_esqui: <Shirt className="size-7" />,
  cascos: <HardHat className="size-7" />,
  antiparras: <Glasses className="size-7" />,
  otros_accesorios: <Puzzle className="size-7" />,
};

export default function Home() {
  return (
    <>
      {/* ═══════════════════════════════════════════════════
          SECTION 1 — HERO  (Skier background)
      ═══════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <Image
          src="/images/hero-mountain-hd.jpg"
          alt="Majestuosas montañas nevadas de los Andes"
          fill
          className="object-cover object-center"
          priority
          quality={100}
          unoptimized={true}
        />
        {/* Dark overlay with blue tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/70 via-[#0a1628]/50 to-[#0a1628]/80" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm mb-8 animate-fade-in-up">
            <Snowflake className="size-3.5 text-cyan-300" />
            <span className="text-sm font-medium text-white/80 tracking-wide">
              Marketplace Premium de Nieve — Región Metropolitana
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 animate-fade-in-up [animation-delay:150ms]">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/90">
              Tu próxima aventura en la nieve
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-white/95 to-blue-300">
              comienza aquí.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-white/60 mb-10 leading-relaxed font-light tracking-wide max-w-2xl mx-auto animate-fade-in-up [animation-delay:300ms]">
            Arrienda o compra el mejor equipo para Valle Nevado, La Parva y El Colorado.
            Economía circular para los amantes de la nieve chilena.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center px-4 animate-fade-in-up [animation-delay:450ms]">
            <Button
              size="lg"
              className="bg-[#e8622c] text-white hover:bg-[#d4561f] h-13 px-7 text-base gap-2 shadow-lg shadow-orange-600/30 transition-all duration-300 hover:shadow-xl hover:shadow-orange-600/40 hover:-translate-y-0.5"
              render={<Link href="/productos" />}
            >
              <ShoppingBag className="size-5" data-icon="inline-start" />
              Ver Equipos Disponibles
              <ArrowRight className="size-4" data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="border border-white/30 text-white hover:bg-white/10 hover:text-white h-13 px-7 text-base gap-2 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5"
              render={<Link href="/mis-productos/nuevo" />}
            >
              <Upload className="size-5" data-icon="inline-start" />
              Subir mi Equipo
              <ArrowRight className="size-4" data-icon="inline-end" />
            </Button>
          </div>

          <div className="animate-fade-in-up [animation-delay:600ms]">
            <HeroSearchForm />
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 2 — VALUE PROPOSITIONS
      ═══════════════════════════════════════════════════ */}
      <section className="relative -mt-16 z-20 pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-3">
            <Card className="group border-0 bg-card/80 backdrop-blur-md shadow-xl shadow-black/5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <CardContent className="flex flex-col items-center p-6 sm:p-8 text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 ring-1 ring-primary/10 group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck className="size-7 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold">Productos Verificados</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Equipos revisados y certificados para garantizar calidad y autenticidad en cada transacción.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-0 bg-card/80 backdrop-blur-md shadow-xl shadow-black/5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <CardContent className="flex flex-col items-center p-6 sm:p-8 text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 ring-1 ring-primary/10 group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="size-7 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold">Arriendos Premium</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Departamentos en Valle Nevado, La Parva, El Colorado, Farellones y más centros de esquí.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-0 bg-card/80 backdrop-blur-md shadow-xl shadow-black/5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <CardContent className="flex flex-col items-center p-6 sm:p-8 text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 ring-1 ring-primary/10 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="size-7 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold">Contacto Directo</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Comunícate al instante por WhatsApp con vendedores y nuestro equipo de arriendos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 3 — PRODUCT CATEGORIES
      ═══════════════════════════════════════════════════ */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <Badge variant="secondary" className="mb-4 gap-1.5">
              <ShoppingBag className="size-3" />
              Catálogo
            </Badge>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Explora por categoría
            </h2>
            <p className="mt-3 mx-auto max-w-2xl text-muted-foreground">
              Encuentra exactamente lo que necesitas para tu próxima temporada en la nieve.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:gap-6">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <Link
                key={key}
                href={`/productos?category=${key}`}
                className="group relative flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card p-6 sm:p-8 text-center transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
              >
                <div className="flex size-16 items-center justify-center rounded-2xl bg-secondary text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110">
                  {CATEGORY_ICONS[key]}
                </div>
                <span className="font-heading text-sm sm:text-base font-semibold">{label}</span>
                <ArrowRight className="absolute right-4 top-4 size-4 text-muted-foreground/0 transition-all duration-300 group-hover:text-primary group-hover:translate-x-0.5" style={{ opacity: 0 }} />
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button variant="outline" size="lg" className="gap-2 h-12" render={<Link href="/productos" />}>
              Ver todos los productos
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 4 — COMMUNITY / ¿CÓMO FUNCIONA SNOWMARKET?
          (Market image + text)
      ═══════════════════════════════════════════════════ */}
      <section className="bg-secondary/30 py-16 sm:py-24 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl shadow-black/10">
              <Image
                src="/images/hero-market.png"
                alt="SnowMarket — Mercado de equipos de esquí"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <Badge className="absolute bottom-4 left-4 bg-white/90 text-primary hover:bg-white shadow-md gap-1.5">
                <Recycle className="size-3" />
                Economía Circular
              </Badge>
            </div>

            {/* Text */}
            <div className="lg:pl-4">
              <Badge variant="secondary" className="mb-4 gap-1.5">
                <Heart className="size-3" />
                Nuestra Comunidad
              </Badge>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                ¿Cómo funciona SnowMarket?
              </h2>
              <div className="space-y-5 text-muted-foreground leading-relaxed">
                <p>
                  Somos un <strong className="text-foreground">marketplace de economía circular</strong> que conecta
                  a la comunidad de esquiadores de la Región Metropolitana. Compra, vende y arrienda equipos
                  que merecen una segunda vida en la montaña.
                </p>
                <p>
                  Imagina un mercado vibrante donde cada rack de esquís, cada par de botas y cada chaqueta
                  encuentra un nuevo dueño que los llevará a las pistas. Eso es SnowMarket: <strong className="text-foreground">gente real, equipos reales, experiencias reales.</strong>
                </p>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Recycle className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading text-sm font-semibold">Sustentable</p>
                    <p className="text-xs text-muted-foreground">Dale nueva vida a tu equipo</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <MapPin className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading text-sm font-semibold">Local</p>
                    <p className="text-xs text-muted-foreground">Enfocado en la RM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                    <ShieldCheck className="size-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-heading text-sm font-semibold">Verificados</p>
                    <p className="text-xs text-muted-foreground">Calidad garantizada</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="gap-2 h-12 bg-[#e8622c] hover:bg-[#d4561f]" render={<Link href="/productos" />}>
                  <ShoppingBag className="size-4" />
                  Explorar Equipos
                </Button>
                <Button variant="outline" size="lg" className="gap-2 h-12" render={<Link href="/departamentos" />}>
                  <Building2 className="size-4" />
                  Ver Departamentos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 5 — DEPARTAMENTOS / ARRIENDO SIN COMPLICACIONES
          (Chalet image + text about departamento rentals)
      ═══════════════════════════════════════════════════ */}
      <section className="bg-background py-16 sm:py-24 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Text (left on desktop) */}
            <div className="order-2 lg:order-1 lg:pr-4">
              <Badge variant="secondary" className="mb-4 gap-1.5">
                <Building2 className="size-3" />
                Departamentos
              </Badge>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                Arrienda tu departamento en la nieve
              </h2>
              <div className="space-y-5 text-muted-foreground leading-relaxed">
                <p>
                  Encuentra el <strong className="text-foreground">departamento ideal</strong> para tu
                  próxima escapada a la montaña. Arriendos verificados en Farellones,
                  Valle Nevado, La Parva y El Colorado.
                </p>
                <p>
                  Llega directo a disfrutar del confort de tu alojamiento con vistas
                  a la cordillera. Sin estrés, sin complicaciones — solo tú y la montaña.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 shrink-0 text-green-600" />
                  <span className="text-sm">Departamentos verificados en centros de esquí</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 shrink-0 text-green-600" />
                  <span className="text-sm">Check-in flexible y comunicación directa con el dueño</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 shrink-0 text-green-600" />
                  <span className="text-sm">Fotos reales y disponibilidad actualizada</span>
                </div>
              </div>

              <div className="mt-8">
                <Button size="lg" className="gap-2 h-12" render={<Link href="/departamentos" />}>
                  <Building2 className="size-4" />
                  Ver departamentos disponibles
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>

            {/* Image (right on desktop) */}
            <div className="relative order-1 lg:order-2 aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl shadow-black/10">
              <Image
                src="/images/hero-chalet.png"
                alt="Interior de departamento de lujo con vista a la montaña"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 6 — HOW IT WORKS
      ═══════════════════════════════════════════════════ */}
      <section className="bg-secondary/20 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <Badge variant="secondary" className="mb-4 gap-1.5">
              <HelpCircle className="size-3" />
              Cómo Funciona
            </Badge>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Publicar es fácil y rápido
            </h2>
            <p className="mt-3 mx-auto max-w-2xl text-muted-foreground">
              En solo tres pasos puedes tener tus productos o departamentos visibles para miles de usuarios.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: Upload, num: "1", title: "Crea tu Cuenta", desc: "Regístrate gratis con tu email. Confirma tu cuenta y ya puedes empezar a publicar." },
              { icon: ShoppingBag, num: "2", title: "Publica tu Artículo", desc: "Sube fotos, escribe una descripción y establece tu precio. Agrega tu WhatsApp para contacto directo." },
              { icon: Handshake, num: "3", title: "Conecta y Vende", desc: "Los compradores te contactan por WhatsApp. Coordina la entrega y cierra la venta." },
            ].map((step) => (
              <div key={step.num} className="group relative flex flex-col items-center text-center rounded-2xl bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-110">
                  <step.icon className="size-7" />
                </div>
                <div className="absolute left-1/2 top-4 -translate-x-1/2 font-heading text-7xl font-black text-primary/[0.04]">
                  {step.num}
                </div>
                <h3 className="font-heading text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 7 — COMMISSIONS & TRANSPARENCY
      ═══════════════════════════════════════════════════ */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <Badge variant="secondary" className="mb-4 gap-1.5">
              <Percent className="size-3" />
              Transparencia
            </Badge>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Comisiones claras, sin sorpresas
            </h2>
            <p className="mt-3 mx-auto max-w-2xl text-muted-foreground">
              En SnowMarket creemos en la transparencia total. Aquí te explicamos nuestro modelo.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Departamentos */}
            <Card className="overflow-hidden border-2 border-primary/10 transition-shadow duration-300 hover:shadow-lg">
              <CardContent className="p-0">
                <div className="bg-primary/5 px-6 py-5 sm:px-8">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <Building2 className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold">Departamentos</h3>
                      <p className="text-sm text-muted-foreground">Arriendos administrados</p>
                    </div>
                    <Badge className="ml-auto text-base font-bold px-3 py-1">7%</Badge>
                  </div>
                </div>
                <div className="px-6 py-5 sm:px-8 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <KeyRound className="mt-0.5 size-4 shrink-0 text-green-600" />
                    <span className="text-sm">Publicación y gestión de tu propiedad</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600" />
                    <span className="text-sm">Comunicación directa con arrendatarios</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CalendarDays className="mt-0.5 size-4 shrink-0 text-green-600" />
                    <span className="text-sm">Verificación de disponibilidad y reserva</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600" />
                    <span className="text-sm">Soporte continuo del equipo SnowMarket</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Artículos Verificados */}
            <Card className="relative overflow-hidden border-2 border-amber-400/40 transition-shadow duration-300 hover:shadow-lg">
              <Badge className="absolute right-4 top-4 z-10 bg-amber-500 text-white hover:bg-amber-500 gap-1 shadow-md">
                <Star className="size-3" />
                Premium
              </Badge>
              <div className="absolute -right-8 -top-8 size-24 rounded-full bg-amber-400/10 blur-2xl" />
              <CardContent className="p-0">
                <div className="bg-amber-50 px-6 py-5 sm:px-8 dark:bg-amber-400/5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-amber-500 text-white">
                      <Star className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold">Artículos Verificados</h3>
                      <p className="text-sm text-muted-foreground">Servicio Premium</p>
                    </div>
                    <Badge className="ml-auto bg-amber-500 hover:bg-amber-500 text-white text-base font-bold px-3 py-1">
                      10%
                    </Badge>
                  </div>
                </div>
                <div className="px-6 py-5 sm:px-8 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber-500" />
                    <span className="text-sm">Verificación profesional del artículo</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber-500" />
                    <span className="text-sm font-medium">
                      Logística completa incluida: retiro en domicilio del vendedor
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber-500" />
                    <span className="text-sm font-medium">
                      Entrega directa al comprador en su domicilio
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-amber-500" />
                    <span className="text-sm">
                      <ShieldCheck className="mr-1 inline size-3.5 text-amber-500" />
                      Sello de confianza SnowMarket visible en el listing
                    </span>
                  </div>
                  <Separator className="my-1" />
                  <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800 leading-relaxed dark:bg-amber-400/5 dark:text-amber-200">
                    <Truck className="mb-1 inline-block size-4 mr-1.5" />
                    <strong>Servicio puerta a puerta:</strong> Nosotros vamos a buscar el artículo a la casa
                    del vendedor, lo verificamos y lo entregamos directamente al comprador.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 8 — CTA  (Sell your gear)
      ═══════════════════════════════════════════════════ */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#1a3a55] to-primary" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl text-white mb-4">
            ¿Tienes equipo para vender?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
            Publica tus equipos de esquí en minutos y conecta con compradores reales en la Región Metropolitana.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="h-13 px-7 text-base gap-2 bg-[#e8622c] hover:bg-[#d4561f] text-white shadow-lg"
              render={<Link href="/mis-productos/nuevo" />}
            >
              Publicar mi Producto
              <ArrowRight className="size-4" data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="h-13 px-7 text-base gap-2 border border-white/30 text-white hover:bg-white/10 hover:text-white"
              render={<Link href="/departamentos" />}
            >
              <Building2 className="size-4" />
              Publicar Departamento
            </Button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 9 — CONTACT / HELP
      ═══════════════════════════════════════════════════ */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              ¿Necesitas ayuda?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Nuestro equipo está disponible para resolver tus dudas.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                <div className="flex size-11 items-center justify-center rounded-xl bg-green-500/10">
                  <MessageCircle className="size-5 text-green-600" />
                </div>
                <h3 className="font-heading font-semibold">WhatsApp</h3>
                <p className="text-sm text-muted-foreground">Respuesta rápida en horario hábil</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-1"
                  render={
                    <a
                      href={`https://wa.me/${ADMIN_WHATSAPP.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hola, necesito ayuda con SnowMarket")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <Phone className="size-3.5" data-icon="inline-start" />
                  Escribir por WhatsApp
                </Button>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                <div className="flex size-11 items-center justify-center rounded-xl bg-blue-500/10">
                  <Mail className="size-5 text-blue-600" />
                </div>
                <h3 className="font-heading font-semibold">Email</h3>
                <p className="text-sm text-muted-foreground">Para consultas detalladas</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-1"
                  render={<a href="mailto:soporte@snowmarket.cl" />}
                >
                  <Mail className="size-3.5" data-icon="inline-start" />
                  soporte@snowmarket.cl
                </Button>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                  <Search className="size-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold">Explorar</h3>
                <p className="text-sm text-muted-foreground">Navega nuestro catálogo completo</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-1"
                  render={<Link href="/productos" />}
                >
                  <ShoppingBag className="size-3.5" data-icon="inline-start" />
                  Ver Productos
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 10 — PREMIUM FOOTER
      ═══════════════════════════════════════════════════ */}
      <footer className="border-t bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top area */}
          <div className="py-12 sm:py-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Logo & tagline */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="inline-block">
                <div className="inline-flex items-center justify-center rounded-xl bg-white/95 px-4 py-2 shadow-sm">
                  <Image
                    src="/images/logo.png"
                    alt="SnowMarket"
                    width={150}
                    height={38}
                    className="h-10 w-auto"
                  />
                </div>
              </Link>
              <p className="mt-4 text-sm text-primary-foreground/60 leading-relaxed max-w-xs">
                Marketplace de economía circular para equipos de esquí en la Región Metropolitana de Chile.
              </p>
            </div>

            {/* Marketplace */}
            <div>
              <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-primary-foreground/80 mb-4">
                Marketplace
              </h4>
              <ul className="space-y-2.5 text-sm text-primary-foreground/60">
                <li>
                  <Link href="/productos" className="hover:text-primary-foreground transition-colors">
                    Productos
                  </Link>
                </li>
                <li>
                  <Link href="/departamentos" className="hover:text-primary-foreground transition-colors">
                    Departamentos
                  </Link>
                </li>
                <li>
                  <Link href="/mis-productos/nuevo" className="hover:text-primary-foreground transition-colors">
                    Publicar Equipo
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categorías */}
            <div>
              <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-primary-foreground/80 mb-4">
                Categorías
              </h4>
              <ul className="space-y-2.5 text-sm text-primary-foreground/60">
                {Object.entries(CATEGORY_LABELS).slice(0, 4).map(([key, label]) => (
                  <li key={key}>
                    <Link href={`/productos?category=${key}`} className="hover:text-primary-foreground transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-primary-foreground/80 mb-4">
                Contacto
              </h4>
              <ul className="space-y-2.5 text-sm text-primary-foreground/60">
                <li>
                  <a
                    href={`https://wa.me/${ADMIN_WHATSAPP.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary-foreground transition-colors inline-flex items-center gap-1.5"
                  >
                    <Phone className="size-3.5" />
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a href="mailto:soporte@snowmarket.cl" className="hover:text-primary-foreground transition-colors inline-flex items-center gap-1.5">
                    <Mail className="size-3.5" />
                    soporte@snowmarket.cl
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-primary-foreground/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/50">
            <p>© {new Date().getFullYear()} SnowMarket. Marketplace premium para la nieve chilena.</p>
            <div className="flex items-center gap-1">
              <Snowflake className="size-3" />
              <span>Hecho con ❄️ en Santiago, Chile</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Building2,
  MessageCircle,
  ArrowRight,
  Search,
  Percent,
  Mail,
  Phone,
  HelpCircle,
  CheckCircle2,
  Snowflake,
  Recycle,
  MapPin,
  Heart,
  Ticket,
  Truck,
} from "lucide-react";
import { ADMIN_WHATSAPP, CATEGORY_LABELS } from "@/lib/constants";
import { getCurrentUser } from "@/actions/auth";
import { HeroLeft } from "./components/home/HeroLeft";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          SECTION 1 — HERO (Two-column premium layout)
      ═══════════════════════════════════════════════════ */}
      <section className="relative min-h-[600px] lg:min-h-[680px] overflow-hidden bg-slate-50">
        {/* ── Full-bleed background image (right-aligned on desktop) ── */}
        <div className="absolute inset-0">
          <Image
            src="/images/imagenfondo.png"
            alt="Equipamiento de nieve premium"
            fill
            className="object-cover object-[75%_top] lg:object-[65%_top]"
            priority
            sizes="100vw"
          />
        </div>

        {/* ── Gradient overlays: fuse image into content area ── */}
        {/* Left-to-right: solid white fading into the image */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(248,250,252,0.97) 0%, rgba(248,250,252,0.92) 20%, rgba(248,250,252,0.7) 38%, rgba(248,250,252,0.35) 52%, rgba(248,250,252,0) 68%)",
          }}
        />
        {/* Bottom fade for mini-card integration */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(248,250,252,0.7) 0%, rgba(248,250,252,0.25) 18%, rgba(248,250,252,0) 35%)",
          }}
        />
        {/* Mobile: stronger overlay so text stays legible */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none lg:hidden"
          style={{
            background: "rgba(248,250,252,0.82)",
          }}
        />

        {/* ── Content ── */}
        <div className="relative z-[2] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 lg:pb-28">
          <div className="max-w-2xl">
            <HeroLeft isLoggedIn={!!user} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 2 — VALUE PROPOSITIONS
      ═══════════════════════════════════════════════════ */}
      <section className="relative z-20 pt-8 pb-16 sm:pt-10 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-3">
            <Card className="group border-0 bg-card/80 backdrop-blur-md shadow-xl shadow-black/5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <CardContent className="flex flex-col items-center p-6 sm:p-8 text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-400/5 ring-1 ring-orange-500/10 group-hover:scale-110 transition-transform duration-300">
                  <Truck className="size-7 text-[#e8622c]" />
                </div>
                <h3 className="font-heading text-lg font-semibold">Gestión y Logística</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Nos encargamos de la búsqueda, compra y envío de tu equipo directo a tu puerta.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-0 bg-card/80 backdrop-blur-md shadow-xl shadow-black/5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <CardContent className="flex flex-col items-center p-6 sm:p-8 text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-400/5 ring-1 ring-orange-500/10 group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="size-7 text-[#e8622c]" />
                </div>
                <h3 className="font-heading text-lg font-semibold">Arriendos Premium</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Departamentos en Valle Nevado, La Parva, El Colorado, Farellones y más centros de esquí.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-0 bg-card/80 backdrop-blur-md shadow-xl shadow-black/5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <CardContent className="flex flex-col items-center p-6 sm:p-8 text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-400/5 ring-1 ring-orange-500/10 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="size-7 text-[#e8622c]" />
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
          SECTION 4 — COMMUNITY / ¿CÓMO FUNCIONA SNOWMARKET?
          (Market image + text)
      ═══════════════════════════════════════════════════ */}
      <section className="bg-secondary/30 py-16 sm:py-24 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl shadow-black/10">
              <Image
                src="/images/hero-esquis-hd.png"
                alt="AndesMarket — Mercado de equipos de esquí"
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
                ¿Cómo funciona AndesMarket?
              </h2>
              <div className="space-y-5 text-muted-foreground leading-relaxed">
                <p>
                  Somos un marketplace de economía circular que conecta
                  a la comunidad de esquiadores de la Región Metropolitana. Compra, vende y arrienda equipos
                  que merecen una segunda vida en la montaña.
                </p>
                <p>
                  Imagina un mercado vibrante donde cada rack de esquís, cada par de botas y cada chaqueta
                  encuentra un nuevo dueño que los llevará a las pistas. Eso es AndesMarket: gente real,
                  equipos reales, experiencias reales.
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
                    <Truck className="size-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-heading text-sm font-semibold">Envío incluido</p>
                    <p className="text-xs text-muted-foreground">Gestión puerta a puerta</p>
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
          SECTION 5 — GESTIÓN Y LOGÍSTICA
      ═══════════════════════════════════════════════════ */}
      <section className="bg-background py-16 sm:py-24 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Text */}
            <div className="order-2 lg:order-1 lg:pr-4">
              <Badge variant="secondary" className="mb-4 gap-1.5">
                <Truck className="size-3" />
                Gestión y Logística
              </Badge>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                Compra con confianza en la nieve
              </h2>
              <div className="space-y-5 text-muted-foreground leading-relaxed">
                <p>
                  Nos encargamos de todo: buscamos el equipo que necesitas, gestionamos
                  la compra y lo enviamos directo a tu puerta.
                </p>
                <p>
                  Desde esquís y botas hasta cascos y antiparras: seleccionamos
                  los mejores equipos y coordinamos cada paso para que tú solo disfrutes la montaña.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                {[
                  {
                    Icon: Search,
                    title: "Filtro Experto",
                    body:
                      "Buscamos y verificamos cada equipo personalmente. Solo lo que supera nuestro estándar de calidad llega a la plataforma.",
                  },
                  {
                    Icon: MessageCircle,
                    title: "Logística 1-a-1",
                    body:
                      "Olvídate de bots. Gestionamos tu envío de forma personalizada vía WhatsApp para que sepas exactamente dónde está tu equipo.",
                  },
                  {
                    Icon: Truck,
                    title: "De Nuestra Mano a Tu Puerta",
                    body:
                      "Nos encargamos de todo el proceso: lo buscamos, lo certificamos y lo entregamos directamente en tu casa.",
                  },
                ].map(({ Icon, title, body }) => (
                  <div
                    key={title}
                    className="group relative overflow-hidden rounded-2xl border border-dashed border-primary/25 bg-gradient-to-br from-card to-muted/30 p-4 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md"
                  >
                    <Ticket
                      className="pointer-events-none absolute -right-1 -top-1 size-14 rotate-12 text-primary/[0.08] transition-transform duration-300 group-hover:scale-110 group-hover:text-primary/[0.12]"
                      aria-hidden
                    />
                    <div className="relative flex gap-4">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-green-600 text-white shadow-md ring-4 ring-green-600/15">
                        <CheckCircle2 className="size-5" strokeWidth={2.5} />
                      </div>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5">
                          <Icon className="size-3.5 text-primary" />
                          <span className="font-heading text-xs font-semibold uppercase tracking-wide text-primary">
                            {title}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button size="lg" className="gap-2 h-12 bg-[#e8622c] hover:bg-[#d4561f]" render={<Link href="/productos" />}>
                  <Truck className="size-4" />
                  Ver productos con envío
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>

            {/* Image */}
            <div className="relative order-1 lg:order-2 aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl shadow-black/10">
              <Image
                src="/images/productosverificados.png"
                alt="Productos con gestión y envío en AndesMarket"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <Badge className="absolute bottom-4 left-4 bg-white/90 text-primary hover:bg-white shadow-md gap-1.5">
                <Truck className="size-3" />
                Envío incluido
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 6 — DEPARTAMENTOS / ARRIENDO SIN COMPLICACIONES
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
                  próxima escapada a la montaña. Arriendos en Farellones,
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
                  <span className="text-sm">Departamentos seleccionados en centros de esquí</span>
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
                src="/images/departamento.png"
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
          SECTION 7 — COMMISSIONS & TRANSPARENCY
      ═══════════════════════════════════════════════════ */}
      <section id="comisiones" className="bg-background py-16 sm:py-24">
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
              En AndesMarket creemos en la transparencia total. Aquí te explicamos nuestro modelo.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
            <div className="grid grid-cols-12 border-b border-border/70 bg-secondary/40 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:px-6">
              <p className="col-span-5 sm:col-span-4">Servicio</p>
              <p className="col-span-3 sm:col-span-2">Comisión</p>
              <p className="col-span-4 sm:col-span-3">Incluye</p>
              <p className="hidden sm:block sm:col-span-3">Ideal para</p>
            </div>

            <div className="grid grid-cols-12 items-start gap-y-2 border-b border-border/60 px-4 py-4 sm:px-6">
              <div className="col-span-5 sm:col-span-4">
                <p className="font-heading text-sm font-semibold">Departamentos</p>
                <p className="text-xs text-muted-foreground">Arriendos administrados</p>
              </div>
              <p className="col-span-3 sm:col-span-2 text-sm font-semibold text-primary">7%</p>
              <p className="col-span-4 sm:col-span-3 text-sm text-muted-foreground">
                Publicación, calendario y soporte de reservas.
              </p>
              <p className="col-span-12 sm:col-span-3 text-sm text-muted-foreground">Propietarios que quieren gestionar su propiedad con visibilidad local.</p>
            </div>

            <div className="grid grid-cols-12 items-start gap-y-2 px-4 py-4 sm:px-6">
              <div className="col-span-5 sm:col-span-4">
                <p className="font-heading text-sm font-semibold">Artículos con gestión</p>
                <p className="text-xs text-muted-foreground">Servicio premium</p>
              </div>
              <p className="col-span-3 sm:col-span-2 text-sm font-semibold text-amber-600">10%</p>
              <p className="col-span-4 sm:col-span-3 text-sm text-muted-foreground">
                Búsqueda, gestión de compra y logística puerta a puerta.
              </p>
              <p className="col-span-12 sm:col-span-3 text-sm text-muted-foreground">Compradores que buscan comodidad y entrega asistida.</p>
            </div>
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
                      href={`https://wa.me/${ADMIN_WHATSAPP.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hola, necesito ayuda con AndesMarket")}`}
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
                  render={<a href="mailto:contacto@andes-market.cl" />}
                >
                  <Mail className="size-3.5" data-icon="inline-start" />
                  contacto@andes-market.cl
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
                <div className="inline-flex items-center justify-center rounded-xl bg-white/95 px-3 py-2 shadow-sm">
                  <Image
                    src="/images/Logo.png"
                    alt="AndesMarket"
                    width={180}
                    height={48}
                    className="h-10 w-auto max-w-[200px] object-contain"
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
                  <Link href="/categorias" className="hover:text-primary-foreground transition-colors">
                    Categorías
                  </Link>
                </li>
                <li>
                  <Link href="/departamentos" className="hover:text-primary-foreground transition-colors">
                    Departamentos
                  </Link>
                </li>
                <li>
                  <Link
                    href={user ? "/mis-productos/nuevo" : "/auth/sign-up"}
                    className="hover:text-primary-foreground transition-colors"
                  >
                    {user ? "Publicar Equipo" : "Registrarse"}
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
                  <a href="mailto:contacto@andes-market.cl" className="hover:text-primary-foreground transition-colors inline-flex items-center gap-1.5">
                    <Mail className="size-3.5" />
                    contacto@andes-market.cl
                  </a>
                </li>
                <li>
                  <Link href="/productos" className="hover:text-primary-foreground transition-colors inline-flex items-center gap-1.5">
                    <HelpCircle className="size-3.5" />
                    Explorar productos
                  </Link>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${ADMIN_WHATSAPP.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hola, tengo dudas frecuentes sobre publicar en AndesMarket")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary-foreground transition-colors inline-flex items-center gap-1.5"
                  >
                    <MessageCircle className="size-3.5" />
                    Preguntas frecuentes
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-primary-foreground/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/50">
            <p>© {new Date().getFullYear()} AndesMarket. Marketplace premium para la nieve chilena.</p>
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

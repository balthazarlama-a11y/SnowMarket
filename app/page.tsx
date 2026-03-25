import Link from "next/link";
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
  Mountain,
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
} from "lucide-react";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { ADMIN_WHATSAPP } from "@/lib/constants";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <HeroGeometric
        badge="Marketplace Premium de Nieve"
        title1="Equipa tu aventura."
        title2="Encuentra tu refugio."
      >
        <p className="text-base sm:text-lg md:text-xl text-white/50 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
          Compra y vende equipos de esquí verificados, y arrienda departamentos
          en los mejores centros de ski de Chile — todo en un solo lugar.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center px-4">
          <Button
            size="lg"
            className="bg-white text-slate-900 hover:bg-white/90 h-12 px-6 text-base gap-2"
            render={<Link href="/productos" />}
          >
            <ShoppingBag className="size-5" data-icon="inline-start" />
            Explorar Productos
            <ArrowRight className="size-4" data-icon="inline-end" />
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="border border-white/30 text-white hover:bg-white/10 hover:text-white h-12 px-6 text-base gap-2"
            render={<Link href="/departamentos" />}
          >
            <Building2 className="size-5" data-icon="inline-start" />
            Ver Departamentos
            <ArrowRight className="size-4" data-icon="inline-end" />
          </Button>
        </div>
      </HeroGeometric>

      {/* Value Propositions */}
      <section className="border-b bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            <Card className="border-0 bg-secondary/40 shadow-none">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <ShieldCheck className="size-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold">Productos Verificados</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Equipos revisados y certificados por nuestro equipo para garantizar calidad y autenticidad.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-secondary/40 shadow-none">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <Building2 className="size-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold">Arriendos Premium</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Departamentos en Valle Nevado, La Parva, El Colorado, Farellones y más centros de esquí.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-secondary/40 shadow-none">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <MessageCircle className="size-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold">Contacto Directo</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Comunícate al instante por WhatsApp con vendedores y nuestro equipo de arriendos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-background py-16 sm:py-24">
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
            <div className="relative flex flex-col items-center text-center p-6">
              <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <Upload className="size-7" />
              </div>
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-2 font-heading text-6xl font-black text-primary/[0.06]">
                1
              </div>
              <h3 className="font-heading text-lg font-semibold">Crea tu Cuenta</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Regístrate gratis con tu email. Confirma tu cuenta y ya puedes empezar a publicar.
              </p>
            </div>

            <div className="relative flex flex-col items-center text-center p-6">
              <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <ShoppingBag className="size-7" />
              </div>
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-2 font-heading text-6xl font-black text-primary/[0.06]">
                2
              </div>
              <h3 className="font-heading text-lg font-semibold">Publica tu Artículo</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Sube fotos, escribe una descripción y establece tu precio. Agrega tu WhatsApp para contacto directo.
              </p>
            </div>

            <div className="relative flex flex-col items-center text-center p-6">
              <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <Handshake className="size-7" />
              </div>
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-2 font-heading text-6xl font-black text-primary/[0.06]">
                3
              </div>
              <h3 className="font-heading text-lg font-semibold">Conecta y Vende</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Los compradores te contactan por WhatsApp. Coordina la entrega y cierra la venta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Commissions & Transparency */}
      <section className="border-y bg-secondary/20 py-16 sm:py-24">
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
            <Card className="overflow-hidden border-2 border-primary/10">
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
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600" />
                    <span className="text-sm">Publicación y gestión de tu propiedad</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600" />
                    <span className="text-sm">Comunicación directa con arrendatarios</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600" />
                    <span className="text-sm">Verificación de disponibilidad y reserva</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600" />
                    <span className="text-sm">Soporte continuo del equipo SnowMarket</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Articulos Verificados */}
            <Card className="relative overflow-hidden border-2 border-amber-400/40">
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
                    <span className="text-sm">Sello de confianza SnowMarket visible en el listing</span>
                  </div>
                  <Separator className="my-1" />
                  <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800 leading-relaxed dark:bg-amber-400/5 dark:text-amber-200">
                    <Truck className="mb-1 inline-block size-3.5 mr-1" />
                    <strong>Servicio puerta a puerta:</strong> Nosotros vamos a buscar el artículo a la casa
                    del vendedor, lo verificamos y lo entregamos directamente al comprador.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            ¿Tienes equipo para vender?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Publica tus equipos de esquí en minutos y conecta con compradores reales.
          </p>
          <div className="mt-8">
            <Button size="lg" className="h-11 px-5 text-base gap-2" render={<Link href="/mis-productos/nuevo" />}>
              Publicar mi Producto
              <ArrowRight className="size-4" data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </section>

      {/* Contact / Help */}
      <section className="border-t bg-secondary/30 py-16 sm:py-20">
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
            <Card className="transition-shadow hover:shadow-md">
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

            <Card className="transition-shadow hover:shadow-md">
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

            <Card className="transition-shadow hover:shadow-md">
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

      {/* Footer */}
      <footer className="border-t bg-primary py-12 text-primary-foreground/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Mountain className="size-5 text-primary-foreground" />
            <span className="font-heading text-sm font-semibold text-primary-foreground">
              SnowMarket
            </span>
          </div>
          <p className="text-xs">
            © {new Date().getFullYear()} SnowMarket. Marketplace de lujo para la nieve chilena.
          </p>
        </div>
      </footer>
    </>
  );
}

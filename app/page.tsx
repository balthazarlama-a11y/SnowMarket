import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingBag,
  Building2,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
  Mountain,
} from "lucide-react";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

export default function Home() {
  return (
    <>
      {/* Hero with animated geometric shapes */}
      <HeroGeometric
        badge="Marketplace Premium de Nieve"
        title1="Equipa tu aventura."
        title2="Encuentra tu refugio."
      >
        <p className="text-base sm:text-lg md:text-xl text-white/50 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
          Compra y vende equipos de esquí verificados, y arrienda departamentos
          en los mejores centros de ski de Chile — todo en un solo lugar.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            className="bg-white text-slate-900 hover:bg-white/90"
            render={<Link href="/productos" />}
          >
            <ShoppingBag className="size-4" data-icon="inline-start" />
            Explorar Productos
            <ArrowRight className="size-4" data-icon="inline-end" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 hover:text-white"
            render={<Link href="/departamentos" />}
          >
            <Building2 className="size-4" data-icon="inline-start" />
            Ver Departamentos
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

      {/* CTA Section */}
      <section className="bg-secondary/30 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            ¿Tienes equipo para vender?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Publica tus equipos de esquí en minutos y conecta con compradores reales.
            Es gratis y sin comisiones.
          </p>
          <div className="mt-8">
            <Button size="lg" render={<Link href="/mis-productos/nuevo" />}>
              Publicar mi Producto
              <ArrowRight className="size-4" data-icon="inline-end" />
            </Button>
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

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mountain,
  ShoppingBag,
  Building2,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-accent)/0.15,_transparent_60%)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32 lg:py-40">
          <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1 text-sm">
            <Mountain className="size-3.5" />
            Marketplace Premium de Nieve
          </Badge>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
            Equipa tu aventura.
            <br />
            <span className="text-accent">Encuentra tu refugio.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-primary-foreground/70">
            Compra y vende equipos de esquí verificados, y arrienda departamentos
            en los mejores centros de ski de Chile — todo en un solo lugar.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" variant="secondary" render={<Link href="/productos" />}>
              <ShoppingBag className="size-4" data-icon="inline-start" />
              Explorar Productos
              <ArrowRight className="size-4" data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              render={<Link href="/departamentos" />}
            >
              <Building2 className="size-4" data-icon="inline-start" />
              Ver Departamentos
            </Button>
          </div>
        </div>
      </section>

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
                  Departamentos en Valle Nevado, Portillo, Nevados de Chillán y más centros de esquí.
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

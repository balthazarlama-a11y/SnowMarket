import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Building2, Package, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Panel de Administración",
};

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3 gap-1.5">
          <ShieldCheck className="size-3" />
          Administración
        </Badge>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Panel de Administración
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gestiona productos verificados y propiedades de SnowMarket.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-accent/10">
              <Package className="size-5 text-accent" />
            </div>
            <CardTitle className="font-heading">Productos Verificados</CardTitle>
            <CardDescription>
              Publica equipos certificados por SnowMarket con la insignia de verificado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" render={<Link href="/dashboard/products" />}>
              Gestionar Productos
              <ArrowRight className="size-4" data-icon="inline-end" />
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="size-5 text-primary" />
            </div>
            <CardTitle className="font-heading">Propiedades</CardTitle>
            <CardDescription>
              Publica y gestiona departamentos en centros de esquí.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="w-full" render={<Link href="/dashboard/properties" />}>
              Gestionar Propiedades
              <ArrowRight className="size-4" data-icon="inline-end" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

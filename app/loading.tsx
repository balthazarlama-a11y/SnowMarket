import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-4">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-xl" />
        {/* Spinner */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      </div>
      <p className="animate-pulse text-sm font-medium tracking-wide text-muted-foreground">
        Cargando la nieve fresca...
      </p>
    </div>
  );
}

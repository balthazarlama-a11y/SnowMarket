import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Pages
import { Home } from "./pages/Home";
import { Apartments } from "./pages/Apartments";
import { Equipment } from "./pages/Equipment";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/apartments" component={Apartments} />
      <Route path="/equipment" component={Equipment} />
      {/* Dynamic route placeholders - these can be implemented later */}
      <Route path="/apartments/:id">
        {() => <div className="p-20 text-center text-2xl font-bold">Detalle de Alojamiento (Próximamente)</div>}
      </Route>
      <Route path="/equipment/:id">
        {() => <div className="p-20 text-center text-2xl font-bold">Detalle de Equipo (Próximamente)</div>}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

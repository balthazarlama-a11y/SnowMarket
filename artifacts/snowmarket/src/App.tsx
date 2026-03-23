import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Home } from "./pages/Home";
import { Apartments } from "./pages/Apartments";
import { Equipment } from "./pages/Equipment";
import { ApartmentDetail } from "./pages/ApartmentDetail";
import { EquipmentDetail } from "./pages/EquipmentDetail";
import { Publish } from "./pages/Publish";
import { AlpineLodgePage } from "./pages/AlpineLodgePage";
import { MidnightProPage } from "./pages/MidnightProPage";
import { PowderDayPage } from "./pages/PowderDayPage";

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
      <Route path="/apartments/:id" component={ApartmentDetail} />
      <Route path="/equipment" component={Equipment} />
      <Route path="/equipment/:id" component={EquipmentDetail} />
      <Route path="/publish" component={Publish} />
      <Route path="/theme/alpine-lodge" component={AlpineLodgePage} />
      <Route path="/theme/midnight-pro" component={MidnightProPage} />
      <Route path="/theme/powder-day" component={PowderDayPage} />
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

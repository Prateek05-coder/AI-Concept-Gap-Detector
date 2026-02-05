import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import LandingWrapper from "@/pages/LandingWrapper";

import DebuggerPage from "@/pages/DebuggerPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={DebuggerPage} />
      <Route path="/legacy-home" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <LandingWrapper>
            <Router />
            <Toaster />
          </LandingWrapper>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Navigation } from "@/components/Navigation";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import Post from "@/pages/Post";
import About from "@/pages/About";
import { useEffect } from "react";
import { getBaseUrl } from "./lib/utils";

function Router() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check for redirect path from 404.html
    const redirectPath = sessionStorage.getItem('redirect_path');
    if (redirectPath) {
      // Remove the stored path
      sessionStorage.removeItem('redirect_path');
      // Navigate to the stored path
      setLocation(redirectPath);
    }
  }, [setLocation]);

  // Get the base URL for GitHub Pages
  const baseUrl = getBaseUrl();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Switch>
          <Route path={`${baseUrl}/`} component={Home} />
          <Route path={`${baseUrl}/about`} component={About} />
          <Route path={`${baseUrl}/blog`} component={Blog} />
          <Route path={`${baseUrl}/post/:slug`} component={Post} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
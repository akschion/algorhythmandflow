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
  const [location, setLocation] = useLocation();
  const baseUrl = getBaseUrl();

  useEffect(() => {
    // Check for redirect path from 404.html
    const redirectPath = sessionStorage.getItem('redirect_path');
    if (redirectPath) {
      // Remove the stored path
      sessionStorage.removeItem('redirect_path');
      // Remove the base URL if present
      const cleanPath = redirectPath.replace('/algorhythmandflow', '');
      // Navigate to the cleaned path
      setLocation(cleanPath);
    }
  }, [setLocation]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/blog" component={Blog} />
          <Route path="/post/:slug" component={Post} />
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
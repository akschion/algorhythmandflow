import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Navigation } from "@/components/Navigation";
import { Analytics } from "@/components/Analytics";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import Post from "@/pages/Post";
import About from "@/pages/About";
import { useEffect } from "react";
import { HelmetProvider } from 'react-helmet-async';

// Custom hook for GitHub Pages routing
const useGitHubPagesLocation = () => {
  const [location, setLocation] = useLocation();

  // Check if we're running on GitHub Pages
  const isGitHubPages = window.location.hostname.includes('github.io');
  const base = isGitHubPages ? '/algorhythmandflow' : '';

  // On first load, check for redirect from 404.html
  if (typeof window !== 'undefined') {
    // Check URL parameters for redirect
    const params = new URLSearchParams(window.location.search);
    const path = params.get('p');
    if (path) {
      // Remove the query parameter and update the URL
      const cleanUrl = `${base}${path}`;
      window.history.replaceState(null, null, cleanUrl);
      return [path, setLocation];
    }
  }

  // Remove base path from location for routing
  const path = location.replace(base, '') || '/';
  const navigate = (to: string) => setLocation(base + to);

  return [path, navigate];
};

const useDocumentTitle = (location: string) => {
  useEffect(() => {
    // Set default title for Home, About, and Blog pages
    if (!location.startsWith("/post/")) {
      document.title = "Algorithm + Flow";
    }
    // Post titles are handled by the Post component itself
  }, [location]);
};

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Switch hook={useGitHubPagesLocation}>
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
  const [location] = useGitHubPagesLocation();
  useDocumentTitle(location);
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
        {/* Analytics component only tracks in production */}
        {import.meta.env.PROD && <Analytics />}
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
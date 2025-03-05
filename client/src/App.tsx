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

// Custom hook for GitHub Pages routing
const useGitHubPagesLocation = () => {
  const [location, setLocation] = useLocation();

  // Check if we're running on GitHub Pages
  const isGitHubPages = window.location.hostname.includes('github.io');
  const base = isGitHubPages ? '/algorhythmandflow' : '';

  // On first load, check for redirect
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const redirectPath = params.get('p');
    if (redirectPath) {
      // Clear the URL parameters
      window.history.replaceState(null, null, base + redirectPath);
      return [redirectPath, setLocation];
    }

    // Check session storage for redirect
    const storedPath = sessionStorage.getItem('redirect');
    if (storedPath) {
      sessionStorage.removeItem('redirect');
      window.history.replaceState(null, null, base + storedPath);
      return [storedPath, setLocation];
    }
  }

  // Remove base path from location for routing
  const path = location.replace(base, '') || '/';
  const navigate = (to: string) => setLocation(base + to);

  return [path, navigate];
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
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
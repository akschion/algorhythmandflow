import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Navigation } from "@/components/Navigation";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import Post from "@/pages/Post";
import About from "@/pages/About";
import React from "react";

// Use hash-based routing for GitHub Pages compatibility
const hashRouter = () => {
  // Get the hash without the leading #
  const currentHash = () => window.location.hash.replace("#", "") || "/";

  return {
    hook: () => {
      const [path, setPath] = React.useState(currentHash());

      React.useEffect(() => {
        // Update path when hash changes
        const handleHashChange = () => setPath(currentHash());
        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
      }, []);

      return [path, (to: string) => {
        window.location.hash = to;
      }];
    }
  };
};

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <WouterRouter hook={hashRouter().hook}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/blog" component={Blog} />
            <Route path="/post/:slug" component={Post} />
            <Route component={NotFound} />
          </Switch>
        </WouterRouter>
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
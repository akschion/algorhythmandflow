import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Navigation } from "@/components/Navigation";
import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import Post from "@/pages/Post";
import About from "@/pages/About";
import { useState, useEffect } from "react";

// Simple hash router implementation
function useHashLocation() {
  const [hash, setHash] = useState(window.location.hash || "#/");

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return hash.slice(1); // Remove the # symbol
}

function Router() {
  const path = useHashLocation();
  const [, slug] = path.match(/^\/post\/(.+)/) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        {path === "/" && <Home />}
        {path === "/about" && <About />}
        {path === "/blog" && <Blog />}
        {slug && <Post slug={slug} />}
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
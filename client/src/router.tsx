import { Router, Switch, Route } from "wouter";
import { useState, useEffect } from "react";

// Custom hook to handle hash-based routing
const useHashLocation = () => {
  const [loc, setLoc] = useState(window.location.hash.slice(1) || "/");

  useEffect(() => {
    const handler = () => {
      setLoc(window.location.hash.slice(1) || "/");
    };

    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const navigate = (to: string) => {
    window.location.hash = to;
  };

  return [loc, navigate];
};

export function AppRouter({ children }: { children: React.ReactNode }) {
  return <Router hook={useHashLocation}>{children}</Router>;
}

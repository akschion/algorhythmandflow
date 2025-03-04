import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const currentPath = window.location.hash.slice(1) || "/";

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-background/95 via-background/80 to-muted/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <a href="#/" className="mr-6 flex items-center space-x-2 pl-4">
            <motion.span className="font-bold">
              Algorhythm + Flow
            </motion.span>
          </a>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map(({ href, label }) => (
              <a 
                key={href} 
                href={`#${href}`}
                className={`transition-colors ${
                  isActive(href) ? "text-primary font-semibold" : "text-foreground/60"
                }`}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex w-full items-center justify-between">
          <a href="#/" className="flex items-center">
            <span className="font-bold">Algorhythm + Flow</span>
          </a>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 mt-6">
                {navItems.map(({ href, label }) => (
                  <a
                    key={href}
                    href={`#${href}`}
                    onClick={() => setIsOpen(false)}
                    className={`py-2 px-4 ${
                      isActive(href) ? "text-primary font-semibold" : "text-foreground/60"
                    }`}
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
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
          <Link href="/" className="mr-6 flex items-center space-x-2 pl-4">
            <motion.span 
              className="font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent transition-opacity hover:opacity-80"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Math × Tech × Hip-Hop
            </motion.span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map(({ href, label }) => (
              <Link 
                key={href} 
                href={href}
              >
                <motion.span
                  className={`relative inline-block transition-all hover:text-primary hover:scale-105 ${
                    isActive(href) ? 'text-primary font-semibold' : 'text-foreground/60'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {label}
                  {isActive(href) && (
                    <motion.div
                      className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary"
                      layoutId="underline"
                      initial={false}
                    />
                  )}
                </motion.span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex w-full items-center justify-between">
          <Link href="/" className="flex items-center pl-4">
            <motion.span 
              className="font-bold text-sm bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Math × Tech × Hip-Hop
            </motion.span>
          </Link>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[385px]">
              <nav className="flex flex-col space-y-4 mt-6">
                {navItems.map(({ href, label }) => (
                  <Link 
                    key={href} 
                    href={href}
                    onClick={() => setIsOpen(false)}
                  >
                    <motion.span
                      className={`block py-2 px-4 rounded-md transition-all hover:text-primary ${
                        isActive(href) ? 'text-primary font-semibold bg-primary/10' : 'text-foreground/60'
                      }`}
                      whileHover={{ x: 8 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {label}
                    </motion.span>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
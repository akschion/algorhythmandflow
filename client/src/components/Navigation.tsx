import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-background/95 via-background/80 to-muted/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <motion.span 
              className="font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent transition-opacity hover:opacity-80"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Algorhythm + Flow
            </motion.span>
          </a>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map(({ href, label }) => (
              <a 
                key={href} 
                href={href}
                className="relative inline-block transition-all hover:text-primary"
              >
                <motion.span
                  className="text-foreground/60 hover:text-primary"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {label}
                </motion.span>
              </a>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div className="flex w-full items-center justify-between md:hidden">
          <a href="/" className="flex items-center">
            <motion.span 
              className="font-bold text-sm bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Algorhythm + Flow
            </motion.span>
          </a>
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
                  <a 
                    key={href} 
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className="block py-2 px-4 rounded-md transition-all hover:text-primary text-foreground/60"
                  >
                    <motion.span
                      whileHover={{ x: 8 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {label}
                    </motion.span>
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
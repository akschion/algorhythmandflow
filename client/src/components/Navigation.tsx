import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";

export function Navigation() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-background/95 via-background/80 to-muted/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <motion.span 
              className="hidden font-bold sm:inline-block bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent transition-opacity hover:opacity-80"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Math × Tech × Hip-Hop
            </motion.span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About" },
              { href: "/blog", label: "Posts" }
            ].map(({ href, label }) => (
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
      </div>
    </nav>
  );
}
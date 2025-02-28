import { Link, useLocation } from "wouter";

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
            <span className="hidden font-bold sm:inline-block bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent transition-opacity hover:opacity-80">
              Math × Tech × Hip-Hop
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className={`transition-all hover:text-primary hover:scale-105 ${isActive('/') ? 'text-primary font-semibold' : 'text-foreground/60'}`}>
              Home
            </Link>
            <Link href="/blog" className={`transition-all hover:text-primary hover:scale-105 ${isActive('/blog') ? 'text-primary font-semibold' : 'text-foreground/60'}`}>
              Blog
            </Link>
          </nav>
        </div>
      </div>
    </nav>
  );
}
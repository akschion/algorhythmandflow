import { Link, useLocation } from "wouter";

export function Navigation() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Math × Tech × Hip-Hop
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className={`transition-colors hover:text-primary ${isActive('/') ? 'text-primary' : 'text-foreground/60'}`}>
              Home
            </Link>
            <Link href="/blog" className={`transition-colors hover:text-primary ${isActive('/blog') ? 'text-primary' : 'text-foreground/60'}`}>
              Blog
            </Link>
          </nav>
        </div>
      </div>
    </nav>
  );
}

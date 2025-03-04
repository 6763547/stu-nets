
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Header = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "bg-white/90 backdrop-blur-sm shadow-sm py-3" : "bg-transparent py-4"
    )}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-semibold text-primary transition-all duration-300 hover:opacity-80">
          ПродуктЛист
        </Link>
        
        <nav className="flex space-x-4">
          <Link to="/">
            <Button variant={location.pathname === '/' ? "default" : "ghost"}>
              Мой список
            </Button>
          </Link>
          <Link to="/catalog">
            <Button variant={location.pathname === '/catalog' ? "default" : "ghost"}>
              Каталог
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

import { useState, useEffect } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link } from "@heroui/react";
import { Link as RouterLink } from "react-router-dom";
import { ShoppingCartIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when mobile menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <Navbar 
        className="hero-gradient sticky top-0 z-50"
        classNames={{
          wrapper: "max-w-7xl mx-auto padding-mobile",
          brand: "text-white",
          content: "text-white",
        }}
      >
        <NavbarBrand>
          <RouterLink 
            to="/" 
            onClick={closeMobileMenu}
            className="touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-all"
          >
            <h1 className="text-mobile-h2 sm:text-2xl font-bold text-white">VeoPR</h1>
          </RouterLink>
        </NavbarBrand>
        
        {/* Desktop Navigation */}
        <NavbarContent justify="end" className="hidden md:flex">
          <NavbarItem>
            <RouterLink 
              to="/#programas"
              className="text-white font-medium hover:opacity-80 focus:opacity-80 transition-all touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
            >
              Programas
            </RouterLink>
          </NavbarItem>
          
          <NavbarItem>
            <RouterLink 
              to="/productos"
              className="text-white font-medium hover:opacity-80 focus:opacity-80 transition-all touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
            >
              Productos
            </RouterLink>
          </NavbarItem>
          
          <NavbarItem>
            <Link 
              color="foreground" 
              href="#nosotros"
              className="text-white font-medium hover:opacity-80 focus:opacity-80 transition-all touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
            >
              Nosotros
            </Link>
          </NavbarItem>
          <NavbarItem>
            <button 
              className="text-white hover:opacity-80 focus:opacity-80 transition-all touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
              aria-label="Ver carrito de compras"
            >
              <ShoppingCartIcon className="h-6 w-6" />
            </button>
          </NavbarItem>
        </NavbarContent>

        {/* Mobile Menu Button */}
        <NavbarContent justify="end" className="md:hidden">
          <NavbarItem>
            <button 
              className="text-white hover:opacity-80 focus:opacity-80 transition-all touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
              aria-label="Ver carrito de compras"
            >
              <ShoppingCartIcon className="h-6 w-6" />
            </button>
          </NavbarItem>
          <NavbarItem>
            <button 
              onClick={toggleMobileMenu}
              className="text-white hover:opacity-80 focus:opacity-80 transition-all touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
              aria-label={isMobileMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 md:hidden">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50" 
            onClick={closeMobileMenu}
            aria-hidden="true"
          ></div>
          <div className="relative hero-gradient border-t border-white/20">
            <nav 
              className="padding-mobile py-6 space-y-2"
              id="mobile-menu"
              role="navigation"
              aria-label="Menú de navegación móvil"
            >
              <RouterLink 
                to="/#programas"
                className="block text-white text-mobile-body sm:text-lg font-medium hover:opacity-80 focus:opacity-80 transition-all touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                onClick={closeMobileMenu}
              >
                Programas
              </RouterLink>
              
              <RouterLink 
                to="/productos"
                className="block text-white text-mobile-body sm:text-lg font-medium hover:opacity-80 focus:opacity-80 transition-all touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                onClick={closeMobileMenu}
              >
                Productos
              </RouterLink>
              
              <Link 
                color="foreground" 
                href="#nosotros"
                className="block text-white text-mobile-body sm:text-lg font-medium hover:opacity-80 focus:opacity-80 transition-all touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                onClick={closeMobileMenu}
              >
                Nosotros
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  )
} 
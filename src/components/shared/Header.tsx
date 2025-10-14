'use client'

import { useState, useEffect } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import Link from "next/link";
import { ShoppingCartIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import ShoppingCart from "./ShoppingCart";
import { useCart } from "@/contexts/CartContext";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Handle keyboard navigation
  useEffect(() => {
    if (!isClient) return;

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
  }, [isMobileMenuOpen, isClient]);

  return (
    <>
      <Navbar 
        className="bg-gray-900 sticky top-0 z-50 shadow-sm"
        classNames={{
          wrapper: "max-w-7xl mx-auto padding-mobile",
          brand: "text-white",
          content: "text-white",
        }}
      >
        <NavbarBrand>
          <Link 
            href="/" 
            onClick={closeMobileMenu}
            className="touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white transition-all"
          >
            <img 
              src="/veopr-logo.png" 
              alt="VeoPR Logo" 
              className="h-8 w-auto"
            />
          </Link>
        </NavbarBrand>
        
        {/* Desktop Navigation */}
        <NavbarContent justify="end" className="hidden md:flex">
          <NavbarItem>
            <Link 
              href="/#programas"
              className="text-white font-medium hover:text-blue-400 focus:text-blue-400 transition-all touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Programas
            </Link>
          </NavbarItem>
          
          <NavbarItem>
            <Link 
              href="/productos"
              className="text-white font-medium hover:text-blue-400 focus:text-blue-400 transition-all touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Productos
            </Link>
          </NavbarItem>
          
          <NavbarItem>
            <Link 
              color="foreground" 
              href="#nosotros"
              className="text-white font-medium hover:text-blue-400 focus:text-blue-400 transition-all touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Nosotros
            </Link>
          </NavbarItem>
          <NavbarItem>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="text-white hover:text-blue-400 focus:text-blue-400 transition-all touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 relative"
              aria-label="Ver carrito de compras"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </button>
          </NavbarItem>
        </NavbarContent>

        {/* Mobile Menu Button */}
        <NavbarContent justify="end" className="md:hidden">
          <NavbarItem>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="text-white hover:text-blue-400 focus:text-blue-400 transition-all touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 relative"
              aria-label="Ver carrito de compras"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </button>
          </NavbarItem>
          <NavbarItem>
            <button 
              onClick={toggleMobileMenu}
              className="text-white hover:text-blue-400 focus:text-blue-400 transition-all touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
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
      {isClient && isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 md:hidden">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50" 
            onClick={closeMobileMenu}
            aria-hidden="true"
          ></div>
          <div className="relative bg-white border-t border-gray-200">
            <nav 
              className="padding-mobile py-6 space-y-2"
              id="mobile-menu"
              role="navigation"
              aria-label="Menú de navegación móvil"
            >
              <Link 
                href="/#programas"
                className="block text-gray-900 text-mobile-body sm:text-lg font-medium hover:text-blue-600 focus:text-blue-600 transition-all touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white"
                onClick={closeMobileMenu}
              >
                Programas
              </Link>
              
              <Link 
                href="/productos"
                className="block text-gray-900 text-mobile-body sm:text-lg font-medium hover:text-blue-600 focus:text-blue-600 transition-all touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white"
                onClick={closeMobileMenu}
              >
                Productos
              </Link>
              
              <Link 
                color="foreground" 
                href="#nosotros"
                className="block text-gray-900 text-mobile-body sm:text-lg font-medium hover:text-blue-600 focus:text-blue-600 transition-all touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white"
                onClick={closeMobileMenu}
              >
                Nosotros
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Shopping Cart */}
      <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
} 
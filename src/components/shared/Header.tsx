import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import MobileMenuToggle from "./MobileMenuToggle";

export default function Header() {
  return (
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
            className="text-white hover:text-blue-400 focus:text-blue-400 transition-all touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
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
            className="text-white hover:text-blue-400 focus:text-blue-400 transition-all touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Ver carrito de compras"
          >
            <ShoppingCartIcon className="h-6 w-6" />
          </button>
        </NavbarItem>
        <NavbarItem>
          <MobileMenuToggle />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
} 
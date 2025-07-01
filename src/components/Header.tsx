import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link } from "@heroui/react";
import { Link as RouterLink } from "react-router-dom";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

export default function Header() {
  return (
    <Navbar 
      className="hero-gradient sticky top-0 z-50"
      classNames={{
        wrapper: "max-w-6xl px-5",
        brand: "text-white",
        content: "text-white",
      }}
    >
      <NavbarBrand>
        <RouterLink to="/">
          <h1 className="text-2xl font-bold text-white">VeoPR</h1>
        </RouterLink>
      </NavbarBrand>
      
      <NavbarContent justify="end">
        <NavbarItem>
          <RouterLink 
            to="/#programas"
            className="text-white font-medium hover:opacity-80 transition-opacity"
          >
            Programas
          </RouterLink>
        </NavbarItem>
        
        <NavbarItem>
          <Link 
            color="foreground" 
            href="#nosotros"
            className="text-white font-medium hover:opacity-80 transition-opacity"
          >
            Nosotros
          </Link>
        </NavbarItem>
        <NavbarItem>
          <button className="text-white hover:opacity-80 transition-opacity p-2">
            <ShoppingCartIcon className="h-6 w-6" />
          </button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
} 
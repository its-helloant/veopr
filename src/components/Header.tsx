import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link } from "@heroui/react";

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
        <h1 className="text-2xl font-bold text-white">VeoPR</h1>
      </NavbarBrand>
      
      <NavbarContent justify="end">
        <NavbarItem>
          <Link 
            color="foreground" 
            href="#programas"
            className="text-white font-medium hover:opacity-80 transition-opacity"
          >
            Programas
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link 
            color="foreground" 
            href="#podcasts"
            className="text-white font-medium hover:opacity-80 transition-opacity"
          >
            Podcasts
          </Link>
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
      </NavbarContent>
    </Navbar>
  )
} 
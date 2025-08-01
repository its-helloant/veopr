import { Link as HeroLink } from "@heroui/react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-12">
      <div className="max-w-6xl mx-auto padding-mobile">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="space-y-3 sm:space-y-4">
            <img 
              src="/veopr-logo.png" 
              alt="VeoPR Logo" 
              className="h-8 w-auto"
            />
            <p className="text-mobile-body text-gray-300">
              El mejor entretenimiento puertorriqueño
            </p>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <h5 className="text-mobile-body sm:text-lg font-semibold">Programas</h5>
            <div className="flex flex-col space-y-1 sm:space-y-2">
              <Link 
                href="/programas/dia-a-dia" 
                className="text-mobile-body text-gray-300 hover:text-white focus:text-white transition-colors touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 w-fit"
              >
                Día a Día
              </Link>
              <Link 
                href="/programas/raymond-y-sus-amigos" 
                className="text-mobile-body text-gray-300 hover:text-white focus:text-white transition-colors touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 w-fit"
              >
                Raymond y Sus Amigos
              </Link>
              <Link 
                href="/programas/latin-doctors" 
                className="text-mobile-body text-gray-300 hover:text-white focus:text-white transition-colors touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 w-fit"
              >
                Latin Doctors
              </Link>
              <Link 
                href="/programas/rayos-x" 
                className="text-mobile-body text-gray-300 hover:text-white focus:text-white transition-colors touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 w-fit"
              >
                Rayos X
              </Link>
            </div>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <h5 className="text-mobile-body sm:text-lg font-semibold">Síguenos</h5>
            <div className="flex flex-col space-y-1 sm:space-y-2">
              <HeroLink 
                href="#" 
                color="foreground" 
                className="text-mobile-body text-gray-300 hover:text-white focus:text-white transition-colors touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 w-fit"
                aria-label="Seguir en Facebook"
              >
                Facebook
              </HeroLink>
              <HeroLink 
                href="https://www.youtube.com/@VeoPR" 
                color="foreground" 
                className="text-mobile-body text-gray-300 hover:text-white focus:text-white transition-colors touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 w-fit"
                aria-label="Seguir en YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                YouTube
              </HeroLink>
              <HeroLink 
                href="#" 
                color="foreground" 
                className="text-mobile-body text-gray-300 hover:text-white focus:text-white transition-colors touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 w-fit"
                aria-label="Seguir en Instagram"
              >
                Instagram
              </HeroLink>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-700">
          <p className="text-mobile-body text-gray-400 text-center">
            © 2024 VeoPR. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
} 
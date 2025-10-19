import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="space-y-3 sm:space-y-4">
            <div className="relative h-8 w-[120px]">
              <Image 
                src="/veopr-logo.png" 
                alt="VeoPR Logo" 
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-sm sm:text-base text-gray-300">
              El mejor entretenimiento puertorriqueño
            </p>
            <div className="social-icons">
              <a 
                href="https://youtube.com/@VeoPR" 
                className="social-icon"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-youtube"></i>
              </a>
              <a 
                href="https://instagram.com/veoproficial" 
                className="social-icon"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <h5 className="text-sm sm:text-lg font-semibold">Programas</h5>
            <div className="flex flex-col space-y-1 sm:space-y-2">
              <Link 
                href="/programas/dia-a-dia" 
                className="text-sm sm:text-base text-gray-300 hover:text-white focus:text-white transition-colors touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 w-fit"
              >
                Día a Día
              </Link>
              <Link 
                href="/programas/raymond-y-sus-amigos" 
                className="text-sm sm:text-base text-gray-300 hover:text-white focus:text-white transition-colors touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 w-fit"
              >
                Raymond y Sus Amigos
              </Link>
              <Link 
                href="/programas/latin-doctors" 
                className="text-sm sm:text-base text-gray-300 hover:text-white focus:text-white transition-colors touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 w-fit"
              >
                Latin Doctors
              </Link>
              <Link 
                href="/programas/rayos-x" 
                className="text-sm sm:text-base text-gray-300 hover:text-white focus:text-white transition-colors touch-target rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 w-fit"
              >
                Rayos X
              </Link>
            </div>
          </div>
        </div>
        {/* Copyright */}
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-700">
          <p className="text-sm sm:text-base text-gray-400 text-center">
            © 2025 VeoPR. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
} 
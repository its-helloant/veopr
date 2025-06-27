import { Link } from "@heroui/react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h4 className="text-xl font-bold">VeoPR</h4>
            <p className="text-gray-300">
              El mejor entretenimiento puertorriqueño
            </p>
          </div>
          
          <div className="space-y-4">
            <h5 className="text-lg font-semibold">Programas</h5>
            <div className="flex flex-col space-y-2">
              <Link href="#" color="foreground" className="text-gray-300 hover:text-white transition-colors">
                Día a Día
              </Link>
              <Link href="#" color="foreground" className="text-gray-300 hover:text-white transition-colors">
                Raymond y Sus Amigos
              </Link>
              <Link href="#" color="foreground" className="text-gray-300 hover:text-white transition-colors">
                Latin Doctors
              </Link>
              <Link href="#" color="foreground" className="text-gray-300 hover:text-white transition-colors">
                Rayos X
              </Link>
            </div>
          </div>
          
          <div className="space-y-4">
            <h5 className="text-lg font-semibold">Síguenos</h5>
            <div className="flex flex-col space-y-2">
              <Link href="#" color="foreground" className="text-gray-300 hover:text-white transition-colors">
                Facebook
              </Link>
              <Link href="#" color="foreground" className="text-gray-300 hover:text-white transition-colors">
                YouTube
              </Link>
              <Link href="#" color="foreground" className="text-gray-300 hover:text-white transition-colors">
                Instagram
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 
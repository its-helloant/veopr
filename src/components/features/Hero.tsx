'use client'

import { Button } from "@heroui/react";

export default function Hero() {

  const handleVideoPlay = () => {
    // Video play functionality would go here
  };

  return (
    <section className="hero-gradient py-12 sm:py-16 md:py-24 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-white/20 via-transparent to-white/10"></div>
      </div>
      
      <div className="max-w-6xl mx-auto padding-mobile grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center relative z-10">
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-mobile-h1 font-extrabold leading-tight tracking-tight">
            Los mejores programas puertorriqueños
          </h2>
          <p className="text-mobile-body sm:text-lg md:text-xl opacity-90 leading-relaxed">
            Disfruta del mejor entretenimiento boricua. Programas originales, 
            entrevistas exclusivas y mucho más.
          </p>
        </div>
        
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md shadow-2xl rounded-lg overflow-hidden relative group">
            <img 
              src="/dia-a-dia-logo.png" 
              alt="Programa destacado Día a Día - Ver episodio" 
              className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
            />
            {/* Single button overlay to avoid nested interactive elements */}
            <button
              onClick={handleVideoPlay}
              className="absolute inset-0 w-full h-full bg-transparent border-none outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 hover:bg-black hover:bg-opacity-20 focus:bg-black focus:bg-opacity-20 transition-all"
              aria-label="Reproducir programa destacado Día a Día"
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-white bg-opacity-90 text-black text-xl sm:text-2xl hover:scale-110 focus:scale-110 transition-transform rounded-full w-16 h-16 flex items-center justify-center">
                  <span aria-hidden="true">▶</span>
                </div>
              </div>
              <span className="sr-only">Reproducir programa destacado</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
} 
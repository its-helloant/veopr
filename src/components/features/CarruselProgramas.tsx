'use client'

import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { programs } from '@/data/programas';


export default function Programas() {
  const router = useRouter();

  const handleProgramClick = (slug: string) => {
    router.push(`/programas/${slug}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent, slug: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleProgramClick(slug);
    }
  };

  return (
    <section id="programas" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto padding-mobile">
        <div className="text-center margin-mobile">
          <h3 className="text-mobile-h1 lg:text-4xl font-extrabold text-blue-900 margin-mobile tracking-tight">
            Nuestros Programas
          </h3>
          <p className="text-mobile-body lg:text-lg text-gray-600">
            Descubre todos nuestros shows
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {programs.map((program) => (
            <Card 
              key={program.id}
              className="group hover:scale-105 focus-within:scale-105 hover:shadow-xl focus-within:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
              isPressable
              onPress={() => handleProgramClick(program.slug)}
              tabIndex={0}
              role="button"
              aria-label={`Ver episodios de ${program.title}. ${program.description}.`}
              onKeyDown={(e) => handleKeyDown(e, program.slug)}
            >
              <CardHeader className="p-0 relative">
                <div className="relative w-full h-40 sm:h-48">
                  <Image 
                    src={program.image} 
                    alt={`Imagen promocional de ${program.title}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 group-focus-within:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 bg-white text-black font-semibold text-sm px-4 py-2 rounded-md">
                      Ver Episodios
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardBody className="p-3 sm:p-4">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="text-mobile-body sm:text-lg font-bold text-gray-900">
                      {program.title}
                    </h4>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {program.description}
                  </p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 
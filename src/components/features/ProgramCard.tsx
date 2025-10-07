'use client'

import { Card, CardBody, CardHeader } from "@heroui/react";
import { useRouter } from 'next/navigation';

interface Program {
  id: string;
  title: string;
  description: string;
  slug: string;
  image: string;
}

interface ProgramCardProps {
  program: Program;
}

export default function ProgramCard({ program }: ProgramCardProps) {
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
        <div className="relative w-full">
          <img 
            src={program.image} 
            alt={`Imagen promocional de ${program.title}`}
            className="w-full h-40 sm:h-48 object-cover"
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
  );
}


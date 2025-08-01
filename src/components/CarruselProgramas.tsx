import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { useRouter } from 'next/router';

const programs = [
  {
    id: 1,
    title: "Día a Día",
    slug: "dia-a-dia",
    description: "Programa de variedades con lo mejor del entretenimiento boricua",
    image: "/dia-a-dia-logo.png",
    episodes: "12 episodios",
    hasNewEpisode: true
  },
  {
    id: 2,
    title: "Raymond y Sus Amigos",
    slug: "raymond-y-sus-amigos",
    description: "Entrevistas y conversaciones con personalidades puertorriqueñas",
    image: "/rysa logo.jpeg",
    episodes: "8 episodios",
    hasNewEpisode: false
  },
  {
    id: 3,
    title: "Latin Doctors",
    slug: "latin-doctors",
    description: "Programa de salud y bienestar con profesionales latinos",
    image: "/latin-doctors.jpeg",
    episodes: "15 episodios",
    hasNewEpisode: false
  },
  {
    id: 4,
    title: "Rayos X",
    slug: "rayos-x",
    description: "Investigación y análisis de temas de actualidad",
    image: "/rayos-x-logo.png",
    episodes: "6 episodios",
    hasNewEpisode: true
  }
];

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
              aria-label={`Ver episodios de ${program.title}. ${program.description}. ${program.episodes} disponibles.`}
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
                  <Chip 
                    size="sm" 
                    className="absolute top-3 right-3 bg-black bg-opacity-70 text-white text-xs sm:text-sm"
                    aria-label={`${program.episodes} disponibles`}
                  >
                    {program.episodes}
                  </Chip>
                </div>
              </CardHeader>
              
              <CardBody className="p-3 sm:p-4">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="text-mobile-body sm:text-lg font-bold text-gray-900">
                      {program.title}
                    </h4>
                    {program.hasNewEpisode && (
                      <Chip 
                        size="sm" 
                        color="success" 
                        variant="flat"
                        className="animate-pulse text-xs"
                        aria-label="Tiene nuevo episodio disponible"
                      >
                        <span className="hidden sm:inline">Nuevo Episodio</span>
                        <span className="sm:hidden">Nuevo</span>
                      </Chip>
                    )}
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
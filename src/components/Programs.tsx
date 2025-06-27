import { Card, CardBody, CardHeader, Button, Chip } from "@heroui/react";

const programs = [
  {
    id: 1,
    title: "Día a Día",
    description: "Programa de variedades con lo mejor del entretenimiento boricua",
    image: "/dia-a-dia-logo.png",
    episodes: "12 episodios",
    hasNewEpisode: true
  },
  {
    id: 2,
    title: "Raymond y Sus Amigos",
    description: "Entrevistas y conversaciones con personalidades puertorriqueñas",
    image: "/rysa logo.jpeg",
    episodes: "8 episodios",
    hasNewEpisode: false
  },
  {
    id: 3,
    title: "Latin Doctors",
    description: "Programa de salud y bienestar con profesionales latinos",
    image: "/latin-doctors.jpeg",
    episodes: "15 episodios",
    hasNewEpisode: false
  },
  {
    id: 4,
    title: "Rayos X",
    description: "Investigación y análisis de temas de actualidad",
    image: "/rayos-x-logo.png",
    episodes: "6 episodios",
    hasNewEpisode: true
  }
];

export default function Programs() {
  return (
    <section id="programas" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-12">
          <h3 className="text-3xl lg:text-4xl font-extrabold text-blue-900 mb-3 tracking-tight">
            Nuestros Programas
          </h3>
          <p className="text-lg text-gray-600">
            Descubre todos nuestros shows
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program) => (
            <Card 
              key={program.id}
              className="group hover:scale-105 hover:shadow-xl transition-all duration-300 border border-gray-100"
              isPressable
            >
              <CardHeader className="p-0 relative">
                <div className="relative w-full">
                  <img 
                    src={program.image} 
                    alt={program.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                    <Button
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-black font-semibold"
                      size="sm"
                    >
                      Ver Episodios
                    </Button>
                  </div>
                  <Chip 
                    size="sm" 
                    className="absolute top-3 right-3 bg-black bg-opacity-70 text-white"
                  >
                    {program.episodes}
                  </Chip>
                </div>
              </CardHeader>
              
              <CardBody className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="text-lg font-bold text-gray-900">
                      {program.title}
                    </h4>
                    {program.hasNewEpisode && (
                      <Chip 
                        size="sm" 
                        color="success" 
                        variant="flat"
                        className="animate-pulse"
                      >
                        Nuevo Episodio
                      </Chip>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">
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
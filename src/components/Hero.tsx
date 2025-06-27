import { Button, Card, CardBody } from "@heroui/react";

export default function Hero() {
  return (
    <section className="hero-gradient py-24 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-white/20 via-transparent to-white/10"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-6">
          <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
            Los mejores programas puertorriqueños
          </h2>
          <p className="text-xl opacity-90 leading-relaxed">
            Disfruta del mejor entretenimiento boricua. Programas originales, 
            entrevistas exclusivas y mucho más.
          </p>
          <Button 
            size="lg"
            className="cta-gradient text-white font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            startContent={<span className="text-xl">▶</span>}
          >
            Ver Programas
          </Button>
        </div>
        
        <div className="flex justify-center lg:justify-end">
          <Card className="w-full max-w-md shadow-2xl group cursor-pointer">
            <CardBody className="p-0 relative overflow-hidden">
              <img 
                src="/dia-a-dia-logo.png" 
                alt="Programa destacado" 
                className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button
                  isIconOnly
                  size="lg"
                  className="bg-white bg-opacity-90 text-black text-2xl hover:scale-110 transition-transform"
                  radius="full"
                >
                  ▶
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  )
} 
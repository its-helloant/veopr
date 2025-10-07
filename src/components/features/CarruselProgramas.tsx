import { programs } from '@/data/programas';
import ProgramCard from './ProgramCard';

export default function Programas() {
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
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      </div>
    </section>
  )
} 
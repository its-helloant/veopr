export type Program = {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
};

export const programs: Program[] = [
  {
    id: 1,
    title: "Día a Día",
    slug: "dia-a-dia",
    description: "Programa de variedades con lo mejor del entretenimiento boricua",
    image: "/dia-a-dia-logo.png"
  },
  {
    id: 2,
    title: "Raymond y Sus Amigos",
    slug: "raymond-y-sus-amigos",
    description: "Entrevistas y conversaciones con personalidades puertorriqueñas",
    image: "/rysa logo.jpeg"
  },
  {
    id: 3,
    title: "Latin Doctors",
    slug: "latin-doctors",
    description: "Programa de salud y bienestar con profesionales latinos",
    image: "/latin-doctors.jpeg"
  },
  {
    id: 4,
    title: "Rayos X",
    slug: "rayos-x",
    description: "Investigación y análisis de temas de actualidad",
    image: "/rayos-x-logo.png"
  }
];



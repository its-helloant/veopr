export interface ProgramConfig {
  title: string;
  playlistId: string;
  description: string;
}

export interface ProgramsConfig {
  [key: string]: ProgramConfig;
}

const configPrograma: ProgramsConfig = {
  'dia-a-dia': {
    title: "Día a Día",
    playlistId: "PLUsWg2FfmencnFilb7jcKZ-LUSIUPcVyZ",
    description: "El mejor entretenimiento diario con variedades, música y cultura puertorriqueña."
  },
  'raymond-y-sus-amigos': {
    title: "Raymond y Sus Amigos",
    playlistId: "PLUsWg2Ffmenc2Pkr7si59fgEb-46VZM5r",
    description: "Comedia, entretenimiento y conversaciones divertidas con Raymond y sus invitados."
  },
  'latin-doctors': {
    title: "Latin Doctors",
    playlistId: "PLUsWg2Ffmenc2Pkr7si59fgEb-46VZM5r",
    description: "Información médica y consejos de salud para la comunidad latina."
  },
  'rayos-x': {
    title: "Rayos X",
    playlistId: "PLUsWg2Ffmenc2Pkr7si59fgEb-46VZM5r",
    description: "Periodismo investigativo que expone la verdad detrás de los hechos."
  }
};

export default configPrograma;

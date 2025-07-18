import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { PlayIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import Header from './Header';
import Footer from './Footer';
import CarruselProductos from './CarruselProductos';

// Mock data for YouTube playlists
const programPlaylists = {
  1: {
    title: "Día a Día",
    slug: "dia-a-dia",
    playlistId: "PLKcRz7euAKoO0M-UjCUZFfudX78juCcaJ",
    description: "El mejor entretenimiento diario con variedades, música y cultura puertorriqueña.",
    totalVideos: 120,
    views: "2.5M",
    videos: [
      { id: "dQw4w9WgXcQ", title: "Episodio 120 - Especial Navideño", description: "Celebramos las fiestas navideñas con invitados especiales y música tradicional", date: "24-12-2024", duration: "25:30", views: "45K" },
      { id: "9bZkp7q19f0", title: "Episodio 119 - Artistas Emergentes", description: "Conoce a los nuevos talentos de la música puertorriqueña", date: "17-12-2024", duration: "28:15", views: "38K" },
      { id: "kJQP7kiw5Fk", title: "Episodio 118 - Cocina Boricua", description: "Los mejores chefs nos enseñan recetas tradicionales", date: "10-12-2024", duration: "30:45", views: "52K" },
      { id: "fJ9rUzIMcZQ", title: "Episodio 117 - Festival de Salsa", description: "Lo mejor del festival de salsa con entrevistas exclusivas", date: "03-12-2024", duration: "27:20", views: "41K" },
      { id: "M7lc1UVf-VE", title: "Episodio 116 - Deportes Locales", description: "Cobertura especial del boxeo puertorriqueño", date: "26-11-2024", duration: "32:10", views: "35K" }
    ]
  },
  2: {
    title: "Raymond y Sus Amigos",
    slug: "raymond-y-sus-amigos",
    playlistId: "PLrAcYW6x1URNBBY10P5kRVe3fLT_j0HJg",
    description: "Comedia, entretenimiento y conversaciones divertidas con Raymond y sus invitados.",
    totalVideos: 352,
    views: "8.2M",
    videos: [
      { id: "M7lc1UVf-VE", title: "Episodio 352 - Especial de Año Nuevo", description: "Reflexiones del año y planes para el futuro con mucha diversión", date: "31-12-2024", duration: "35:20", views: "89K" },
      { id: "2Vv-BfVoq4g", title: "Episodio 351 - Invitados Sorpresa", description: "Los mejores momentos con invitados inesperados", date: "29-12-2024", duration: "40:15", views: "76K" },
      { id: "ktvTqknDobU", title: "Episodio 350 - Celebración Especial", description: "Celebramos el episodio 350 con los mejores momentos", date: "27-12-2024", duration: "32:30", views: "95K" },
      { id: "ikwjx9VXv_4", title: "Episodio 349 - Juegos y Risas", description: "Una tarde llena de juegos divertidos y muchas risas", date: "25-12-2024", duration: "38:45", views: "68K" }
    ]
  },
  3: {
    title: "Latin Doctors",
    slug: "latin-doctors",
    playlistId: "PLrAcYW6x1URNBBY10P5kRVe3fLT_j0HJg",
    description: "Información médica y consejos de salud para la comunidad latina.",
    totalVideos: 89,
    views: "1.8M",
    videos: [
      { id: "PAR9QvEe-ew", title: "Salud Mental en Tiempos Difíciles", description: "Estrategias para mantener el bienestar emocional durante crisis", date: "22-12-2024", duration: "45:30", views: "62K" },
      { id: "jNQXAC9IVRw", title: "Prevención de Diabetes Tipo 2", description: "Guía completa para prevenir y manejar la diabetes", date: "15-12-2024", duration: "42:15", views: "74K" },
      { id: "L_LUpnjgPso", title: "Nutrición para Toda la Familia", description: "Recetas saludables y consejos nutricionales", date: "08-12-2024", duration: "38:20", views: "58K" },
      { id: "EWvvhDUFBB0", title: "Ejercicio y Longevidad", description: "Cómo mantenerse activo para una vida más larga y saludable", date: "01-12-2024", duration: "40:10", views: "49K" }
    ]
  },
  4: {
    title: "Rayos X",
    slug: "rayos-x",
    playlistId: "PLrAcYW6x1URNBBY10P5kRVe3fLT_j0HJg",
    description: "Periodismo investigativo que expone la verdad detrás de los hechos.",
    totalVideos: 156,
    views: "4.1M",
    videos: [
      { id: "YykjpeuMNEk", title: "Corrupción en el Gobierno Municipal", description: "Investigación exclusiva sobre irregularidades en contratos públicos", date: "25-12-2024", duration: "50:20", views: "128K" },
      { id: "3AtDnEC4zak", title: "Crisis del Sistema de Salud", description: "Análisis profundo de los problemas estructurales", date: "18-12-2024", duration: "48:15", views: "105K" },
      { id: "JGwWNGJdvx8", title: "Educación en Crisis", description: "Reportaje especial sobre el estado de las escuelas públicas", date: "11-12-2024", duration: "52:30", views: "97K" },
      { id: "ZbZSe6N_BXs", title: "Contaminación Ambiental", description: "Investigación sobre el impacto ambiental de las industrias", date: "04-12-2024", duration: "46:45", views: "89K" }
    ]
  }
};

export default function ProgramDetail() {
  const { showName } = useParams<{ showName: string }>();
  const [currentVideoId, setCurrentVideoId] = useState<string>('');
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [isPlaylistVisible, setIsPlaylistVisible] = useState<boolean>(true);

  const program = Object.values(programPlaylists).find(p => p.slug === showName);

  useEffect(() => {
    if (program && program.videos.length > 0) {
      setCurrentVideoId(program.videos[0].id);
      setCurrentVideoIndex(0);
    }
  }, [program]);

  const handleVideoSelect = (videoId: string, index: number) => {
    setCurrentVideoId(videoId);
    setCurrentVideoIndex(index);
  };

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    // Auto-play the video when ready
    event.target.playVideo();
  };

  const onPlayerEnd: YouTubeProps['onEnd'] = () => {
    // Auto-play next video when current video ends
    if (program && currentVideoIndex < program.videos.length - 1) {
      const nextIndex = currentVideoIndex + 1;
      setCurrentVideoId(program.videos[nextIndex].id);
      setCurrentVideoIndex(nextIndex);
    }
  };

  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      rel: 0,
      modestbranding: 1,
    },
  };

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">Programa no encontrado</p>
      </div>
    );
  }

  const currentVideo = program.videos[currentVideoIndex];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

        {/* Program Title - Full Width */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          {program.title}
        </h1>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Column - Video Player and Info */}
          <div className="flex-1">
            {/* Video Player */}
            <div className="bg-black rounded-lg overflow-hidden mb-4 aspect-video" id="video-player">
              {currentVideoId && (
                <YouTube 
                  videoId={currentVideoId} 
                  opts={opts} 
                  onReady={onPlayerReady} 
                  onEnd={onPlayerEnd}
                  className="w-full h-full"
                />
              )}
            </div>

            {/* Video Info */}
            <div className="mb-4">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                {currentVideo?.title}
              </h1>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <span>{currentVideo?.views} vistas</span>
                <span>•</span>
                <span>{currentVideo?.date}</span>
              </div>
            </div>

            {/* Video Description */}
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-gray-800 text-sm leading-relaxed">
                {currentVideo?.description}
              </p>
            </div>
          </div>

          {/* Right Column - Playlist Section */}
          <div className="lg:w-80 w-full flex-shrink-0">
            <div className="bg-gray-50 rounded-lg overflow-hidden flex flex-col h-auto lg:h-[calc((100vw-4rem-1.5rem-20rem)*9/16)] xl:h-[calc((80rem-4rem-1.5rem-20rem)*9/16)]">
              {/* Playlist Header */}
              <div className="bg-gray-900 text-white p-4 flex-shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ListBulletIcon className="h-5 w-5" />
                    <span className="font-semibold">Lista de reproducción</span>
                  </div>
                  <button
                    onClick={() => setIsPlaylistVisible(!isPlaylistVisible)}
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    <svg
                      className={`h-4 w-4 transition-transform ${isPlaylistVisible ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                
                <p className="text-gray-300 text-sm">{program.description}</p>
                
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-300">
                  <span>{currentVideoIndex + 1} / {program.videos.length}</span>
                  <span>•</span>
                  <span>{program.totalVideos} episodios totales</span>
                </div>
              </div>

              {/* Playlist Videos */}
              {isPlaylistVisible && (
                <div className="flex-1 overflow-y-auto">
                  {program.videos.map((video, index) => (
                    <div
                      key={video.id}
                      onClick={() => handleVideoSelect(video.id, index)}
                      className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-100 transition-colors ${
                        currentVideoIndex === index ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="relative flex-shrink-0">
                        <div className="w-24 h-14 bg-gray-300 rounded flex items-center justify-center relative overflow-hidden">
                          <PlayIcon className="h-6 w-6 text-gray-500" />
                          
                          {/* Episode number */}
                          <div className="absolute top-1 left-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                            {index + 1}
                          </div>
                          
                          {/* Duration */}
                          <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                            {video.duration}
                          </div>
                          
                          {/* Currently playing indicator */}
                          {currentVideoIndex === index && (
                            <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                              <svg className="h-8 w-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-sm line-clamp-2 ${
                          currentVideoIndex === index ? 'text-blue-600' : 'text-gray-900'
                        }`}>
                          {video.title}
                        </h4>
                        
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                          <span>{video.views} vistas</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Mercancia Carousel - Full Width */}
      <div className="mt-8">
        <CarruselProductos showName={program.title} />
      </div>
      
      <Footer />
    </div>
  );
} 
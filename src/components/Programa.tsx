import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { Button } from '@heroui/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Header from './Header'
import Footer from './Footer'
import Mercancia from './Productos';


// Mock data for YouTube playlists - replace with actual playlist IDs
const programPlaylists = {
  1: {
    title: "Día a Día",
    slug: "dia-a-dia",
    playlistId: "PLKcRz7euAKoO0M-UjCUZFfudX78juCcaJ", // Real Día a Día playlist
    colorTheme: {
      background: "bg-gradient-to-br from-cyan-100 to-teal-200",
      primary: "text-cyan-900",
      secondary: "text-cyan-700",
      accent: "bg-cyan-500",
      cardHover: "bg-cyan-50"
    },
    videos: [
      { id: "dQw4w9WgXcQ", title: "Episodio 12", description: "Lo mejor del entretenimiento", date: "24/6/2025", duration: "25:30" },
      { id: "9bZkp7q19f0", title: "Episodio 11", description: "Especial invitados", date: "17/6/2025", duration: "28:15" },
      { id: "kJQP7kiw5Fk", title: "Episodio 10", description: "Variedades boricuas", date: "10/6/2025", duration: "30:45" },
      { id: "fJ9rUzIMcZQ", title: "Episodio 9", description: "Música y cultura", date: "3/6/2025", duration: "27:20" }
    ]
  },
  2: {
    title: "Raymond y Sus Amigos",
    slug: "raymond-y-sus-amigos",
    playlistId: "PLrAcYW6x1URNBBY10P5kRVe3fLT_j0HJg",
    colorTheme: {
      background: "bg-gradient-to-br from-emerald-50 to-teal-100",
      primary: "text-emerald-900",
      secondary: "text-emerald-600",
      accent: "bg-emerald-500",
      cardHover: "bg-emerald-50"
    },
    videos: [
      { id: "M7lc1UVf-VE", title: "Episodio 352", description: "Descripción de camisa o frase", date: "24/6/2025", duration: "35:20" },
      { id: "2Vv-BfVoq4g", title: "Episodio 351", description: "Descripción de camisa o frase", date: "17/6/2025", duration: "40:15" },
      { id: "ktvTqknDobU", title: "Episodio 350", description: "Descripción de camisa o frase", date: "10/6/2025", duration: "32:30" },
      { id: "ikwjx9VXv_4", title: "Episodio 349", description: "Descripción de camisa o frase", date: "3/6/2025", duration: "38:45" }
    ]
  },
  3: {
    title: "Latin Doctors",
    slug: "latin-doctors",
    playlistId: "PLrAcYW6x1URNBBY10P5kRVe3fLT_j0HJg",
    colorTheme: {
      background: "bg-gradient-to-br from-blue-50 to-cyan-100",
      primary: "text-blue-900",
      secondary: "text-blue-600",
      accent: "bg-blue-500",
      cardHover: "bg-blue-50"
    },
    videos: [
      { id: "PAR9QvEe-ew", title: "Salud mental", description: "En la comunidad latina", date: "22/6/2025", duration: "45:30" },
      { id: "jNQXAC9IVRw", title: "Prevención de diabetes", description: "Consejos y dietas", date: "15/6/2025", duration: "42:15" },
      { id: "L_LUpnjgPso", title: "Nutrición saludable", description: "Recetas y hábitos", date: "8/6/2025", duration: "38:20" },
      { id: "EWvvhDUFBB0", title: "Ejercicio y bienestar", description: "Rutinas para todos", date: "1/6/2025", duration: "40:10" }
    ]
  },
  4: {
    title: "Rayos X",
    slug: "rayos-x",
    playlistId: "PLrAcYW6x1URNBBY10P5kRVe3fLT_j0HJg",
    colorTheme: {
      background: "bg-gradient-to-br from-purple-50 to-indigo-100",
      primary: "text-purple-900",
      secondary: "text-purple-600",
      accent: "bg-purple-500",
      cardHover: "bg-purple-50"
    },
    videos: [
      { id: "YykjpeuMNEk", title: "Corrupción municipal", description: "Investigación a fondo", date: "25/6/2025", duration: "50:20" },
      { id: "3AtDnEC4zak", title: "Crisis económica", description: "Análisis de expertos", date: "18/6/2025", duration: "48:15" },
      { id: "JGwWNGJdvx8", title: "Educación pública", description: "Reportaje especial", date: "11/6/2025", duration: "52:30" },
      { id: "ZbZSe6N_BXs", title: "Medio ambiente", description: "Retos y soluciones", date: "4/6/2025", duration: "46:45" }
    ]
  }
};

export default function ProgramDetail() {
  const { showName } = useParams<{ showName: string }>();
  const navigate = useNavigate();
  const [currentVideoId, setCurrentVideoId] = useState<string>('');
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);

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
      controls: 0,
    },
  };

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-100">
        <p className="text-xl text-gray-600">Programa no encontrado</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${program.colorTheme.background} text-gray-800`}>
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center gap-4">
          <Button
            isIconOnly
            variant="light"
            onPress={() => navigate('/')}
            className="text-gray-700 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </Button>
          <h1 className={`text-4xl md:text-5xl font-bold ${program.colorTheme.primary}`}>{program.title}</h1>
        </div>

        {/* Video Player Section */}
        <div className="bg-black rounded-lg shadow-2xl overflow-hidden mb-12 aspect-video">
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

        {/* Episodios Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-3xl font-bold ${program.colorTheme.primary}`}>Episodios ({program.videos.length})</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Desplázate para ver más</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {/* Vertical Carousel Container */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {program.videos.map((video, index) => (
                <div
                  key={video.id}
                  onClick={() => handleVideoSelect(video.id, index)}
                  className={`flex items-center p-4 cursor-pointer transition-all duration-200 hover:shadow-sm ${
                    currentVideoIndex === index 
                      ? `${program.colorTheme.cardHover} border-l-4 ${program.colorTheme.accent.replace('bg-', 'border-')}` 
                      : 'hover:bg-gray-50'
                  } ${index !== program.videos.length - 1 ? 'border-b border-gray-200' : ''}`}
                >
                  <div className="w-32 h-18 bg-gray-200 rounded-md flex-shrink-0 relative overflow-hidden">
                    {/* Thumbnail placeholder with play icon */}
                    <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    {/* Episode number overlay */}
                    <div className="absolute top-1 left-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                      #{program.videos.length - index}
                    </div>
                  </div>
                  
                  <div className="flex-grow mx-4 min-w-0">
                    <h3 className={`font-bold text-md ${
                      currentVideoIndex === index ? program.colorTheme.primary : 'text-gray-800'
                    } truncate`}>
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{video.description}</p>
                    {video.duration && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        <span>{video.duration}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <div className="text-gray-500 text-sm whitespace-nowrap">{video.date}</div>
                    {currentVideoIndex === index && (
                      <div className={`text-xs ${program.colorTheme.secondary} font-medium mt-1`}>
                        Reproduciendo
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Scroll to current playing indicator */}
            {program.videos.length > 4 && (
              <div className="bg-gray-50 px-4 py-2 text-center">
                <button 
                  onClick={() => {
                    const container = document.querySelector('.overflow-y-auto');
                    const currentItem = container?.children[currentVideoIndex] as HTMLElement;
                    currentItem?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className={`text-sm ${program.colorTheme.secondary} hover:opacity-80 transition-opacity`}
                >
                  Ir al episodio actual
                </button>
              </div>
            )}
          </div>
        </div>

        
      <Mercancia />

      </div>
      <Footer />
    </div>
  );
} 
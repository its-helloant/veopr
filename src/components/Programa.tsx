import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { Button } from '@heroui/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Header from './Header'
import Footer from './Footer'


// Mock data for YouTube playlists - replace with actual playlist IDs
const programPlaylists = {
  1: {
    title: "Día a Día",
    slug: "dia-a-dia",
    playlistId: "PLrAcYW6x1URNBBY10P5kRVe3fLT_j0HJg", // Example playlist ID
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
    <div className="min-h-screen bg-sky-100 text-gray-800">
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{program.title}</h1>
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
            <h2 className="text-3xl font-bold text-gray-900">Episodios</h2>
            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800">
              Ver todos
            </a>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div>
              {program.videos.slice(0, 4).map((video, index) => (
                <div
                  key={video.id}
                  onClick={() => handleVideoSelect(video.id, index)}
                  className={`flex items-center p-4 cursor-pointer transition-colors duration-200 ${
                    currentVideoIndex === index ? 'bg-sky-50' : 'hover:bg-gray-50'
                  } ${index !== program.videos.slice(0, 4).length - 1 ? 'border-b border-gray-200' : ''}`}
                >
                  <div className="w-32 h-18 bg-gray-200 rounded-md flex-shrink-0">
                    {/* Thumbnail placeholder */}
                  </div>
                  <div className="flex-grow mx-4">
                    <h3 className={`font-bold text-md ${currentVideoIndex === index ? 'text-blue-800' : 'text-gray-800'}`}>{video.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{video.description}</p>
                  </div>
                  <div className="text-gray-500 text-sm whitespace-nowrap">{video.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { useYouTubePlaylist } from '@/src/hooks/useYouTubePlaylist';
import { ProcessedVideo } from '@/src/types/youtube';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

// Program configuration mapping slugs to playlist IDs
const programPlaylists = {
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
} as const;

interface ProgramDetailProps {
  params: Promise<{
    showName: string;
  }>;
}

export default function DetallePrograma({ params }: ProgramDetailProps) {
  const [resolvedParams, setResolvedParams] = useState<{ showName: string } | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string>('');
  const [currentVideo, setCurrentVideo] = useState<ProcessedVideo | null>(null);

  // Resolve params
  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  const programConfig = resolvedParams ? programPlaylists[resolvedParams.showName as keyof typeof programPlaylists] : null;

  const { playlist, videos, loading, error } = useYouTubePlaylist({
    playlistId: programConfig?.playlistId || '',
    maxResults: 50,
    autoFetch: !!programConfig?.playlistId
  });

  // Set initial video when videos load
  useEffect(() => {
    if (videos.length > 0 && !currentVideoId) {
      const firstVideo = videos[0];
      setCurrentVideoId(firstVideo.id);
      setCurrentVideo(firstVideo);
    }
  }, [videos, currentVideoId]);

  const handleVideoSelect = (video: ProcessedVideo) => {
    setCurrentVideoId(video.id);
    setCurrentVideo(video);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatViews = (views: string) => {
    const numViews = parseInt(views);
    if (isNaN(numViews)) return 'Sin datos de visualizaciones';
    
    if (numViews >= 1000000) {
      return `${(numViews / 1000000).toFixed(1)}M visualizaciones`;
    } else if (numViews >= 1000) {
      return `${(numViews / 1000).toFixed(1)}K visualizaciones`;
    }
    return `${numViews} visualizaciones`;
  };

  const formatDuration = (duration: string) => {
    if (!duration) return '';
    
    // Parse ISO 8601 duration (PT4M20S)
    const match = duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '';
    
    const minutes = parseInt(match[1] || '0');
    const seconds = parseInt(match[2] || '0');
    
    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return `0:${seconds.toString().padStart(2, '0')}`;
  };

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    // Auto-play the video
    event.target.playVideo();
  };

  const onPlayerEnd: YouTubeProps['onEnd'] = (event) => {
    // Auto-play next video when current video ends
    if (currentVideo) {
      const currentIndex = videos.findIndex(v => v.id === currentVideo.id);
      if (currentIndex < videos.length - 1) {
        const nextVideo = videos[currentIndex + 1];
        handleVideoSelect(nextVideo);
      }
    }
  };

  const onPlayerError: YouTubeProps['onError'] = (event) => {
    console.error('YouTube Player Error:', event.data);
    // Could show a toast notification or error message here
  };

  const playerOpts: YouTubeProps['opts'] = {
    height: '400',
    width: '100%',
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      controls: 1,
      fs: 1, // Allow fullscreen
      iv_load_policy: 3 // Hide annotations
    }
  };

  if (!resolvedParams) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!programConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Programa no encontrado</h1>
          <p className="text-gray-600">El programa que buscas no existe.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <a href="/" className="hover:text-gray-700">Inicio</a>
            </li>
            <li>/</li>
            <li>
              <a href="/#programas" className="hover:text-gray-700">Programas</a>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{programConfig.title}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{programConfig.title}</h1>
          <p className="text-gray-600">{programConfig.description}</p>
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          {/* Left side - Video Player and Info */}
          <div className="xl:w-2/3">
            {/* Video Player */}
            <div className="bg-black rounded-lg overflow-hidden shadow-lg mb-6 aspect-video">
              {currentVideoId ? (
                <YouTube
                  videoId={currentVideoId}
                  opts={playerOpts}
                  onReady={onPlayerReady}
                  onEnd={onPlayerEnd}
                  onError={onPlayerError}
                  className="w-full h-full"
                  iframeClassName="w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <p className="text-white">Selecciona un video para reproducir</p>
                </div>
              )}
            </div>

            {/* Video Info */}
            {currentVideo && (
              <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3">
                  {currentVideo.title}
                </h2>
                
                <div className="flex items-center text-sm text-gray-600 mb-4 space-x-4">
                  <span>{formatViews(currentVideo.views)}</span>
                  <span>•</span>
                  <span>{formatDate(currentVideo.date)}</span>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Descripción</h3>
                  <div className="text-gray-700 text-sm whitespace-pre-wrap">
                    {currentVideo.description || 'Sin descripción disponible.'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right side - Playlist */}
          <div className="xl:w-1/3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-4">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h3 className="font-semibold text-gray-900">
                  Lista de reproducción
                </h3>
                <p className="text-sm text-gray-600">
                  {videos.length} videos
                </p>
              </div>

              <div className="max-h-96 lg:max-h-[600px] overflow-y-auto">
                {videos.map((video, index) => (
                  <div
                    key={video.id}
                    onClick={() => handleVideoSelect(video)}
                    className={`p-3 lg:p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                      currentVideoId === video.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex space-x-3">
                      <div className="flex-shrink-0 relative">
                        <img
                          src={video.thumbnails.medium?.url || video.thumbnails.default?.url}
                          alt={video.title}
                          className="w-16 h-10 lg:w-20 lg:h-12 object-cover rounded"
                        />
                        {video.duration && (
                          <span className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                            {formatDuration(video.duration)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                          {video.title}
                        </p>
                        <div className="mt-1 text-xs text-gray-500 space-x-2">
                          <span>{formatViews(video.views)}</span>
                          <span>•</span>
                          <span>{formatDate(video.date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
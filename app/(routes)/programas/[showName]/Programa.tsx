'use client'

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { PlayIcon, ListBulletIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Header from '@/src/components/shared/Header';
import Footer from '@/src/components/shared/Footer';
import CarruselProductos from '@/src/components/shared/CarruselProductos';
import { useYouTubePlaylist } from '@/src/hooks/useYouTubePlaylist';

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
  params?: Promise<{
    showName: string;
  }>;
}

export default function ProgramDetail({ params }: ProgramDetailProps) {
  const router = useRouter();
  const [showName, setShowName] = useState<string>('');
  const [currentVideoId, setCurrentVideoId] = useState<string>('');
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [isPlaylistVisible, setIsPlaylistVisible] = useState<boolean>(true);

  // Handle async params
  useEffect(() => {
    if (params) {
      params.then(resolvedParams => {
        setShowName(resolvedParams.showName);
      });
    }
  }, [params]);

  // Get program configuration
  const programConfig = programPlaylists[showName as keyof typeof programPlaylists];
  
  // Fetch YouTube playlist data
  const {
    playlist,
    videos,
    loading,
    error,
    hasMore,
    loadMore,
    refetch
  } = useYouTubePlaylist({
    playlistId: programConfig?.playlistId || '',
    maxResults: 50,
    autoFetch: Boolean(programConfig?.playlistId)
  });

  useEffect(() => {
    // Scroll to top when component mounts or program changes
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
    
    if (videos.length > 0) {
      setCurrentVideoId(videos[0].id);
      setCurrentVideoIndex(0);
    }
  }, [videos]);

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
    if (videos && currentVideoIndex < videos.length - 1) {
      const nextIndex = currentVideoIndex + 1;
      setCurrentVideoId(videos[nextIndex].id);
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

  // Show loading state
  if (loading && !videos.length) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Cargando programa...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar el programa</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={refetch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show not found state
  if (!programConfig) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Programa no encontrado</h2>
            <p className="text-gray-600">El programa que buscas no existe.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentVideo = videos[currentVideoIndex];
  const displayTitle = playlist?.title || programConfig.title;
  const displayDescription = playlist?.description || programConfig.description;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

        {/* Program Title - Full Width */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          {displayTitle}
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
                
                <p className="text-gray-300 text-sm">{displayDescription}</p>
                
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-300">
                  <span>{currentVideoIndex + 1} / {videos.length}</span>
                  <span>•</span>
                  <span>{playlist?.totalVideos || videos.length} episodios totales</span>
                  {hasMore && (
                    <span className="text-blue-300">+ más videos</span>
                  )}
                </div>
              </div>

              {/* Playlist Videos */}
              {isPlaylistVisible && (
                <div className="flex-1 overflow-y-auto">
                  {videos.map((video, index) => (
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
                          {video.thumbnails?.medium?.url ? (
                            <img 
                              src={video.thumbnails.medium.url} 
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <PlayIcon className="h-6 w-6 text-gray-500" />
                          )}
                          
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
                  
                  {/* Load More Button */}
                  {hasMore && (
                    <div className="p-4 border-t border-gray-200">
                      <button
                        onClick={loadMore}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Cargando...
                          </>
                        ) : (
                          'Cargar más videos'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Mercancia Carousel - Full Width */}
      <div className="mt-8">
        <CarruselProductos showName={displayTitle} />
      </div>
      
      <Footer />
    </div>
  );
} 

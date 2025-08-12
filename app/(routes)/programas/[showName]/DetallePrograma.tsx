'use client';

import { useState, useEffect } from 'react';
import { YouTubeProps } from 'react-youtube';
import { useYouTubePlaylist } from '@/src/hooks/useYouTubePlaylist';
import { ProcessedVideo } from '@/src/types/youtube';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import YoutubeVideoPlayer, { VideoInfo } from '@/components/youtube/YoutubeVideoPlayer';
import YoutubePlaylist from '@/components/youtube/YoutubePlaylist';

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

const Breadcrumb = ({ title }: { title: string }) => (
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
      <li className="text-gray-900 font-medium">{title}</li>
    </ol>
  </nav>
);

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
    <div className="min-h-screen bg-gray-200">
        <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb title={programConfig.title} />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{programConfig.title}</h1>
          <p className="text-gray-600">{programConfig.description}</p>
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          {/* Left side - Video Player and Info */}
          <div className="xl:w-2/3">
            <YoutubeVideoPlayer
              videoId={currentVideoId}
              playerOpts={playerOpts}
              onPlayerReady={onPlayerReady}
              onPlayerEnd={onPlayerEnd}
              onPlayerError={onPlayerError}
            />

            <VideoInfo
              currentVideo={currentVideo}
              formatViews={formatViews}
              formatDate={formatDate}
            />
          </div>

          {/* Right side - Playlist */}
          <div className="xl:w-1/3">
            <YoutubePlaylist
              videos={videos}
              currentVideoId={currentVideoId}
              handleVideoSelect={handleVideoSelect}
              formatDuration={formatDuration}
              formatViews={formatViews}
              formatDate={formatDate}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
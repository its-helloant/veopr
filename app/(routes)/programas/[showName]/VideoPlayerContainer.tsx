'use client';

import { useState, useEffect } from 'react';
import { YouTubeProps } from 'react-youtube';
import { ProcessedVideo } from '@/src/types/youtube';
import YoutubeVideoPlayer, { VideoInfo } from '@/src/components/youtube/YoutubeVideoPlayer';
import YoutubePlaylist from '@/src/components/youtube/YoutubePlaylist';

interface VideoPlayerContainerProps {
  videos: ProcessedVideo[];
}

export default function VideoPlayerContainer({ videos }: VideoPlayerContainerProps) {
  const [currentVideoId, setCurrentVideoId] = useState<string>('');
  const [currentVideo, setCurrentVideo] = useState<ProcessedVideo | null>(null);

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
      fs: 1,
      iv_load_policy: 3
    }
  };

  return (
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
  );
}


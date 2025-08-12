import YouTube, { YouTubeProps } from 'react-youtube';
import { ProcessedVideo } from '@/src/types/youtube';

interface YoutubeVideoPlayerProps {
  videoId: string;
  playerOpts: YouTubeProps['opts'];
  onPlayerReady: YouTubeProps['onReady'];
  onPlayerEnd: YouTubeProps['onEnd'];
  onPlayerError: YouTubeProps['onError'];
}

const YoutubeVideoPlayer: React.FC<YoutubeVideoPlayerProps> = ({
  videoId,
  playerOpts,
  onPlayerReady,
  onPlayerEnd,
  onPlayerError,
}) => {
  return (
    <div className="bg-black rounded-lg overflow-hidden shadow-lg mb-6 aspect-video">
      {videoId ? (
        <YouTube
          videoId={videoId}
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
  );
};

interface VideoInfoProps {
  currentVideo: ProcessedVideo | null;
  formatViews: (views: string) => string;
  formatDate: (dateString: string) => string;
}

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

const VideoInfo: React.FC<VideoInfoProps> = ({ currentVideo }) => {
  if (!currentVideo) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
      <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3">
        {currentVideo.title}
      </h2>

      <div className="flex items-center text-sm text-gray-600 mb-4 space-x-4">
        <span>{formatViews(currentVideo.views)}</span>
        <span>•</span>
        <span>{formatDate(currentVideo.date)}</span>
      </div>

      { currentVideo.description && (
        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-900 mb-2">Descripción</h3>
          <div className="text-gray-700 text-sm whitespace-pre-wrap">
            {currentVideo.description || 'Sin descripción disponible.'}
          </div>
        </div>
      )}
    </div>
  );
};

export { VideoInfo };
export default YoutubeVideoPlayer;
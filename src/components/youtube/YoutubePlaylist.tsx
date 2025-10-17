import React from 'react';
import Image from 'next/image';
import { ProcessedVideo } from '@/src/types/youtube';

interface YoutubePlaylistProps {
  videos: ProcessedVideo[];
  currentVideoId: string;
  handleVideoSelect: (video: ProcessedVideo) => void;
  formatDuration: (duration: string) => string;
  formatViews: (views: string) => string;
  formatDate: (dateString: string) => string;
}

const YoutubePlaylist: React.FC<YoutubePlaylistProps> = ({
  videos,
  currentVideoId,
  handleVideoSelect,
  formatDuration,
  formatViews,
  formatDate
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden top-4 border border-gray-300">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-300">
        <h3 className="font-semibold text-gray-900">Lista de reproducción</h3>
        <p className="text-sm text-gray-600">{videos.length} videos</p>
      </div>

      <div className="max-h-96 lg:max-h-[600px] overflow-y-auto">
        {videos.map((video) => (
          <div
            key={video.id}
            onClick={() => handleVideoSelect(video)}
            className={`p-3 lg:p-4 cursor-pointer hover:bg-gray-200 border-b border-gray-300 last:border-b-0 transition-colors ${
              currentVideoId === video.id ? 'bg-blue-200 border-l-4 border-l-blue-500' : ''
            }`}
          >
            <div className="flex space-x-3">
              <div className="flex-shrink-0 relative w-16 h-10 lg:w-20 lg:h-12">
                <Image
                  src={video.thumbnails.medium?.url || video.thumbnails.default?.url || '/placeholder.png'}
                  alt={video.title}
                  fill
                  className="object-cover rounded"
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
  );
};

export default YoutubePlaylist;

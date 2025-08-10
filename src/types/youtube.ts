// YouTube Data API v3 Response Types

export interface YouTubeApiError {
  error: {
    code: number;
    message: string;
    errors: Array<{
      domain: string;
      reason: string;
      message: string;
    }>;
  };
}

export interface YouTubeThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface YouTubeThumbnails {
  default?: YouTubeThumbnail;
  medium?: YouTubeThumbnail;
  high?: YouTubeThumbnail;
  standard?: YouTubeThumbnail;
  maxres?: YouTubeThumbnail;
}

export interface YouTubeVideoSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: YouTubeThumbnails;
  channelTitle: string;
  playlistId: string;
  position: number;
  resourceId: {
    kind: string;
    videoId: string;
  };
  videoOwnerChannelTitle?: string;
  videoOwnerChannelId?: string;
}

export interface YouTubeVideoContentDetails {
  videoId: string;
  startAt?: string;
  endAt?: string;
  note?: string;
  videoPublishedAt: string;
}

export interface YouTubeVideoStatistics {
  viewCount?: string;
  likeCount?: string;
  favoriteCount?: string;
  commentCount?: string;
}

export interface YouTubeVideoDuration {
  duration: string;
}

export interface YouTubePlaylistItem {
  kind: string;
  etag: string;
  id: string;
  snippet: YouTubeVideoSnippet;
  contentDetails?: YouTubeVideoContentDetails;
  statistics?: YouTubeVideoStatistics;
}

export interface YouTubePlaylistItemsResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YouTubePlaylistItem[];
}

export interface YouTubePlaylistSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: YouTubeThumbnails;
  channelTitle: string;
  defaultLanguage?: string;
  localized?: {
    title: string;
    description: string;
  };
}

export interface YouTubePlaylistContentDetails {
  itemCount: number;
}

export interface YouTubePlaylistStatistics {
  viewCount?: string;
}

export interface YouTubePlaylistDetails {
  kind: string;
  etag: string;
  id: string;
  snippet: YouTubePlaylistSnippet;
  contentDetails?: YouTubePlaylistContentDetails;
  statistics?: YouTubePlaylistStatistics;
}

export interface YouTubePlaylistResponse {
  kind: string;
  etag: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YouTubePlaylistDetails[];
}

// App-specific types for transformed data
export interface ProcessedVideo {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  views: string;
  thumbnails: YouTubeThumbnails;
  position: number;
}

export interface ProcessedPlaylist {
  id: string;
  title: string;
  description: string;
  totalVideos: number;
  views: string;
  videos: ProcessedVideo[];
  thumbnails: YouTubeThumbnails;
}

// API Response types for our Next.js API routes
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PlaylistVideosApiResponse extends ApiResponse<ProcessedVideo[]> {
  pagination?: {
    nextPageToken?: string;
    prevPageToken?: string;
    totalResults: number;
    resultsPerPage: number;
  };
}

export interface PlaylistInfoApiResponse extends ApiResponse<ProcessedPlaylist> {}
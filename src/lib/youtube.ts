import {
  YouTubePlaylistItemsResponse,
  YouTubePlaylistResponse,
  ProcessedVideo,
  ProcessedPlaylist,
  YouTubeApiError,
  YouTubePlaylistItem
} from '../types/youtube';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

/**
 * Duration converter from ISO 8601 duration to readable format
 * Example: PT4M13S -> 4:13, PT1H2M30S -> 1:02:30
 */
function formatDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';

  const [, hours, minutes, seconds] = match;
  const h = parseInt(hours || '0', 10);
  const m = parseInt(minutes || '0', 10);
  const s = parseInt(seconds || '0', 10);

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Format view count to readable format
 * Example: 1234567 -> 1.2M, 12345 -> 12K
 */
function formatViewCount(viewCount: string): string {
  const count = parseInt(viewCount, 10);
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

/**
 * Format date to readable format
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-PR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Fetch video details including duration and view count
 */
async function fetchVideoDetails(videoIds: string[], apiKey: string): Promise<Map<string, { duration: string; viewCount: string }>> {
  if (videoIds.length === 0) return new Map();

  const url = new URL(`${YOUTUBE_API_BASE}/videos`);
  url.searchParams.set('part', 'contentDetails,statistics');
  url.searchParams.set('id', videoIds.join(','));
  url.searchParams.set('key', apiKey);

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      console.warn('Failed to fetch video details:', response.status);
      return new Map();
    }

    const data = await response.json();
    const videoDetailsMap = new Map<string, { duration: string; viewCount: string }>();

    data.items?.forEach((video: any) => {
      videoDetailsMap.set(video.id, {
        duration: formatDuration(video.contentDetails?.duration || 'PT0S'),
        viewCount: formatViewCount(video.statistics?.viewCount || '0')
      });
    });

    return videoDetailsMap;
  } catch (error) {
    console.warn('Error fetching video details:', error);
    return new Map();
  }
}

/**
 * Fetch playlist videos from YouTube Data API v3
 */
export async function fetchPlaylistVideos(
  playlistId: string,
  apiKey: string,
  maxResults: number = 50,
  pageToken?: string
): Promise<{ videos: ProcessedVideo[]; nextPageToken?: string; totalResults: number }> {
  const url = new URL(`${YOUTUBE_API_BASE}/playlistItems`);
  url.searchParams.set('part', 'snippet,contentDetails');
  url.searchParams.set('playlistId', playlistId);
  url.searchParams.set('maxResults', maxResults.toString());
  url.searchParams.set('key', apiKey);
  
  if (pageToken) {
    url.searchParams.set('pageToken', pageToken);
  }

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorData: YouTubeApiError = await response.json();
      throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data: YouTubePlaylistItemsResponse = await response.json();
    
    // Extract video IDs for additional details
    const videoIds = data.items
      .map(item => item.snippet.resourceId?.videoId)
      .filter(Boolean) as string[];

    // Fetch video details (duration, view count)
    const videoDetailsMap = await fetchVideoDetails(videoIds, apiKey);

    // Process and transform the data
    const processedVideos: ProcessedVideo[] = data.items.map((item: YouTubePlaylistItem, index: number) => {
      const videoId = item.snippet.resourceId?.videoId || '';
      const videoDetails = videoDetailsMap.get(videoId) || { duration: '0:00', viewCount: '0' };

      return {
        id: videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        date: formatDate(item.snippet.publishedAt),
        duration: videoDetails.duration,
        views: videoDetails.viewCount,
        thumbnails: item.snippet.thumbnails,
        position: item.snippet.position || index
      };
    });

    return {
      videos: processedVideos,
      nextPageToken: data.nextPageToken,
      totalResults: data.pageInfo.totalResults
    };
  } catch (error) {
    console.error('Error fetching playlist videos:', error);
    throw error;
  }
}

/**
 * Fetch playlist information from YouTube Data API v3
 */
export async function fetchPlaylistInfo(
  playlistId: string,
  apiKey: string
): Promise<ProcessedPlaylist> {
  const url = new URL(`${YOUTUBE_API_BASE}/playlists`);
  url.searchParams.set('part', 'snippet,contentDetails');
  url.searchParams.set('id', playlistId);
  url.searchParams.set('key', apiKey);

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorData: YouTubeApiError = await response.json();
      throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data: YouTubePlaylistResponse = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error('Playlist not found');
    }

    const playlist = data.items[0];

    return {
      id: playlist.id,
      title: playlist.snippet.title,
      description: playlist.snippet.description,
      totalVideos: playlist.contentDetails?.itemCount || 0,
      views: formatViewCount(playlist.statistics?.viewCount || '0'),
      videos: [], // Will be populated separately
      thumbnails: playlist.snippet.thumbnails
    };
  } catch (error) {
    console.error('Error fetching playlist info:', error);
    throw error;
  }
}

/**
 * Validate YouTube API key by making a simple request
 */
export async function validateApiKey(apiKey: string): Promise<boolean> {
  const url = new URL(`${YOUTUBE_API_BASE}/search`);
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('maxResults', '1');
  url.searchParams.set('q', 'test');
  url.searchParams.set('key', apiKey);

  try {
    const response = await fetch(url.toString());
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Extract playlist ID from various YouTube URL formats
 */
export function extractPlaylistId(url: string): string | null {
  const patterns = [
    /[?&]list=([a-zA-Z0-9_-]+)/,
    /\/playlist\?list=([a-zA-Z0-9_-]+)/,
    /^([a-zA-Z0-9_-]+)$/ // Direct playlist ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}
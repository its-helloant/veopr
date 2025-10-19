import { useState, useEffect, useCallback } from 'react';
import { ProcessedPlaylist, ProcessedVideo } from '../types/youtube';

interface UseYouTubePlaylistOptions {
  playlistId: string;
  maxResults?: number;
  pageToken?: string;
  autoFetch?: boolean;
}

interface UseYouTubePlaylistState {
  playlist: ProcessedPlaylist | null;
  videos: ProcessedVideo[];
  loading: boolean;
  error: string | null;
  nextPageToken?: string;
  totalResults: number;
  hasMore: boolean;
}

interface UseYouTubePlaylistActions {
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook for fetching YouTube playlist data
 * 
 * @param options Configuration options for the hook
 * @returns State and actions for managing YouTube playlist data
 */
export function useYouTubePlaylist(
  options: UseYouTubePlaylistOptions
): UseYouTubePlaylistState & UseYouTubePlaylistActions {
  const { playlistId, maxResults = 50, pageToken, autoFetch = true } = options;

  const [state, setState] = useState<UseYouTubePlaylistState>({
    playlist: null,
    videos: [],
    loading: false,
    error: null,
    totalResults: 0,
    hasMore: false
  });

  const fetchPlaylist = useCallback(async (token?: string, append = false) => {
    if (!playlistId) {
      setState(prev => ({ ...prev, error: 'Playlist ID is required' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const url = new URL(`/api/youtube/playlist/${playlistId}`, window.location.origin);
      url.searchParams.set('maxResults', maxResults.toString());
      
      if (token) {
        url.searchParams.set('pageToken', token);
      }

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch playlist');
      }

      setState(prev => ({
        ...prev,
        playlist: data.data,
        videos: append ? [...prev.videos, ...data.data.videos] : data.data.videos,
        loading: false,
        error: null,
        nextPageToken: data.pagination?.nextPageToken,
        totalResults: data.pagination?.totalResults || 0,
        hasMore: Boolean(data.pagination?.nextPageToken)
      }));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    }
  }, [playlistId, maxResults]);

  const refetch = useCallback(async () => {
    await fetchPlaylist(pageToken);
  }, [fetchPlaylist, pageToken]);

  const loadMore = useCallback(async () => {
    if (state.nextPageToken && !state.loading) {
      await fetchPlaylist(state.nextPageToken, true);
    }
  }, [fetchPlaylist, state.nextPageToken, state.loading]);

  const reset = useCallback(() => {
    setState({
      playlist: null,
      videos: [],
      loading: false,
      error: null,
      totalResults: 0,
      hasMore: false
    });
  }, []);

  // Auto-fetch on mount or when dependencies change
  useEffect(() => {
    if (autoFetch && playlistId) {
      fetchPlaylist(pageToken);
    }
  }, [autoFetch, playlistId, pageToken, fetchPlaylist]);

  return {
    ...state,
    refetch,
    loadMore,
    reset
  };
}

/**
 * Simplified hook for fetching just playlist videos
 */
export function useYouTubeVideos(playlistId: string, maxResults = 50) {
  const { videos, loading, error, refetch, loadMore, hasMore, totalResults } = useYouTubePlaylist({
    playlistId,
    maxResults,
    autoFetch: true
  });

  return {
    videos,
    loading,
    error,
    refetch,
    loadMore,
    hasMore,
    totalResults
  };
}

/**
 * Hook for fetching playlist information only (without videos)
 */
export function useYouTubePlaylistInfo(playlistId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playlist, setPlaylist] = useState<ProcessedPlaylist | null>(null);

  const fetchPlaylistInfo = useCallback(async () => {
    if (!playlistId) {
      setError('Playlist ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/youtube/playlist/${playlistId}/info`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch playlist info');
      }

      setPlaylist(data.data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [playlistId]);

  useEffect(() => {
    if (playlistId) {
      fetchPlaylistInfo();
    }
  }, [playlistId, fetchPlaylistInfo]);

  return {
    playlist,
    loading,
    error,
    refetch: fetchPlaylistInfo
  };
}
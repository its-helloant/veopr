import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchPlaylistInfo, fetchPlaylistVideos } from '../../../../../src/lib/youtube';
import { ProcessedPlaylist } from '../../../../../src/types/youtube';
import { ApiResponse } from '../../../../../src/types/youtube';

interface CombinedPlaylistResponse extends ApiResponse<ProcessedPlaylist> {
  pagination?: {
    nextPageToken?: string;
    totalResults: number;
    resultsPerPage: number;
  };
}

/**
 * API Route: /api/youtube/playlist/[playlistId]
 * 
 * Fetches both playlist information and videos in a single request
 * 
 * Query Parameters:
 * - maxResults: number (optional, default: 50, max: 50)
 * - pageToken: string (optional, for pagination)
 * 
 * Example: /api/youtube/playlist/PLrAcYW6x1URNBBY10P5kRVe3fLT_j0HJg?maxResults=25
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CombinedPlaylistResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use GET.'
    });
  }

  try {
    const { playlistId } = req.query;
    const { maxResults = '50', pageToken } = req.query;

    // Validate playlist ID
    if (!playlistId || typeof playlistId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid or missing playlist ID'
      });
    }

    // Validate API key
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      console.error('YouTube API key not configured');
      return res.status(500).json({
        success: false,
        error: 'YouTube API not configured'
      });
    }

    // Validate maxResults parameter
    const maxResultsNum = parseInt(maxResults as string, 10);
    if (isNaN(maxResultsNum) || maxResultsNum < 1 || maxResultsNum > 50) {
      return res.status(400).json({
        success: false,
        error: 'maxResults must be a number between 1 and 50'
      });
    }

    // Fetch playlist info and videos in parallel
    const [playlistInfo, videosResult] = await Promise.all([
      fetchPlaylistInfo(playlistId, apiKey),
      fetchPlaylistVideos(
        playlistId,
        apiKey,
        maxResultsNum,
        pageToken as string | undefined
      )
    ]);

    // Combine the results
    const combinedResult: ProcessedPlaylist = {
      ...playlistInfo,
      videos: videosResult.videos
    };

    // Set cache headers (cache for 10 minutes)
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=300');

    return res.status(200).json({
      success: true,
      data: combinedResult,
      pagination: {
        nextPageToken: videosResult.nextPageToken,
        totalResults: videosResult.totalResults,
        resultsPerPage: maxResultsNum
      }
    });

  } catch (error) {
    console.error('Error in combined playlist API:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Handle specific YouTube API errors
    if (errorMessage.includes('playlistNotFound') || errorMessage.includes('Playlist not found')) {
      return res.status(404).json({
        success: false,
        error: 'Playlist not found'
      });
    }
    
    if (errorMessage.includes('quotaExceeded')) {
      return res.status(429).json({
        success: false,
        error: 'API quota exceeded. Please try again later.'
      });
    }
    
    if (errorMessage.includes('keyInvalid')) {
      return res.status(401).json({
        success: false,
        error: 'Invalid API key'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to fetch playlist data',
      message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
}
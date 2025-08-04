import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchPlaylistVideos } from '../../../../../src/lib/youtube';
import { PlaylistVideosApiResponse } from '../../../../../src/types/youtube';

/**
 * API Route: /api/youtube/playlist/[playlistId]/videos
 * 
 * Fetches videos from a YouTube playlist using the YouTube Data API v3
 * 
 * Query Parameters:
 * - maxResults: number (optional, default: 50, max: 50)
 * - pageToken: string (optional, for pagination)
 * 
 * Example: /api/youtube/playlist/PLrAcYW6x1URNBBY10P5kRVe3fLT_j0HJg/videos?maxResults=25
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PlaylistVideosApiResponse>
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

    // Fetch playlist videos
    const result = await fetchPlaylistVideos(
      playlistId,
      apiKey,
      maxResultsNum,
      pageToken as string | undefined
    );

    // Set cache headers (cache for 10 minutes)
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=300');

    return res.status(200).json({
      success: true,
      data: result.videos,
      pagination: {
        nextPageToken: result.nextPageToken,
        totalResults: result.totalResults,
        resultsPerPage: maxResultsNum
      }
    });

  } catch (error) {
    console.error('Error in playlist videos API:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Handle specific YouTube API errors
    if (errorMessage.includes('playlistNotFound')) {
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
      error: 'Failed to fetch playlist videos',
      message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
}
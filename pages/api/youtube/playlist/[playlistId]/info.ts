import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchPlaylistInfo } from '../../../../../src/lib/youtube';
import { PlaylistInfoApiResponse } from '../../../../../src/types/youtube';

/**
 * API Route: /api/youtube/playlist/[playlistId]/info
 * 
 * Fetches playlist information from YouTube Data API v3
 * 
 * Example: /api/youtube/playlist/PLrAcYW6x1URNBBY10P5kRVe3fLT_j0HJg/info
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PlaylistInfoApiResponse>
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

    // Fetch playlist information
    const playlistInfo = await fetchPlaylistInfo(playlistId, apiKey);

    // Set cache headers (cache for 1 hour since playlist info changes less frequently)
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=1800');

    return res.status(200).json({
      success: true,
      data: playlistInfo
    });

  } catch (error) {
    console.error('Error in playlist info API:', error);
    
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
      error: 'Failed to fetch playlist information',
      message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
}
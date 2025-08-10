import { NextRequest, NextResponse } from 'next/server';
import { fetchPlaylistInfo } from '@/src/lib/youtube';
import { PlaylistInfoApiResponse } from '@/src/types/youtube';

/**
 * API Route: /api/youtube/playlist/[playlistId]/info
 * 
 * Fetches playlist information from YouTube Data API v3
 * 
 * Example: /api/youtube/playlist/PLrAcYW6x1URNBBY10P5kRVe3fLT_j0HJg/info
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ playlistId: string }> }
) {
  try {
    const { playlistId } = await params;

    // Validate playlist ID
    if (!playlistId) {
      return NextResponse.json({
        success: false,
        error: 'Invalid or missing playlist ID'
      }, { status: 400 });
    }

    // Validate API key
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      console.error('YouTube API key not configured');
      return NextResponse.json({
        success: false,
        error: 'YouTube API not configured'
      }, { status: 500 });
    }

    // Fetch playlist information
    const playlistInfo = await fetchPlaylistInfo(playlistId, apiKey);

    const response = NextResponse.json({
      success: true,
      data: playlistInfo
    });

    // Set cache headers (cache for 1 hour since playlist info changes less frequently)
    response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate=1800');

    return response;

  } catch (error) {
    console.error('Error in playlist info API:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Handle specific YouTube API errors
    if (errorMessage.includes('playlistNotFound') || errorMessage.includes('Playlist not found')) {
      return NextResponse.json({
        success: false,
        error: 'Playlist not found'
      }, { status: 404 });
    }
    
    if (errorMessage.includes('quotaExceeded')) {
      return NextResponse.json({
        success: false,
        error: 'API quota exceeded. Please try again later.'
      }, { status: 429 });
    }
    
    if (errorMessage.includes('keyInvalid')) {
      return NextResponse.json({
        success: false,
        error: 'Invalid API key'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch playlist information',
      message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 });
  }
} 
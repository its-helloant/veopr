import { NextRequest, NextResponse } from 'next/server';
import { fetchPlaylistVideos } from '@/src/lib/youtube';
import { PlaylistVideosApiResponse } from '@/src/types/youtube';
import { logger } from '@/src/lib/logger';

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
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ playlistId: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const maxResults = searchParams.get('maxResults') || '50';
    const pageToken = searchParams.get('pageToken');
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
      return NextResponse.json({
        success: false,
        error: 'YouTube API not configured'
      }, { status: 500 });
    }

    // Validate maxResults parameter
    const maxResultsNum = parseInt(maxResults, 10);
    if (isNaN(maxResultsNum) || maxResultsNum < 1 || maxResultsNum > 50) {
      return NextResponse.json({
        success: false,
        error: 'maxResults must be a number between 1 and 50'
      }, { status: 400 });
    }

    // Fetch playlist videos
    const result = await fetchPlaylistVideos(
      playlistId,
      apiKey,
      maxResultsNum,
      pageToken || undefined
    );

    const response = NextResponse.json({
      success: true,
      data: result.videos,
      pagination: {
        nextPageToken: result.nextPageToken,
        totalResults: result.totalResults,
        resultsPerPage: maxResultsNum
      }
    });

    // Set cache headers (cache for 10 minutes)
    response.headers.set('Cache-Control', 's-maxage=600, stale-while-revalidate=300');

    return response;

  } catch (error) {
    const { playlistId } = await params;
    logger.error('YouTube playlist videos fetch failed', error, { playlistId });
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Handle specific YouTube API errors
    if (errorMessage.includes('playlistNotFound')) {
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
      error: 'Failed to fetch playlist videos',
      message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 });
  }
} 
# YouTube API Integration Setup

This document explains how to set up and use the YouTube Data API v3 integration in your Next.js application.

## Prerequisites

1. A Google Cloud Platform (GCP) account
2. YouTube Data API v3 enabled
3. An API key with YouTube Data API v3 permissions

## Setup Instructions

### 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3:
   - Navigate to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click on it and press "Enable"

### 2. Create API Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. (Optional) Restrict the API key:
   - Click on the API key to edit it
   - Under "API restrictions", select "Restrict key"
   - Choose "YouTube Data API v3"
   - Under "Application restrictions", you can restrict by HTTP referrers for security

### 3. Environment Configuration

1. Create a `.env.local` file in your project root:
```bash
# Copy the env.example file
cp env.example .env.local
```

2. Add your YouTube API key:
```env
YOUTUBE_API_KEY=your_actual_api_key_here
```

**Important:** Never commit your `.env.local` file to version control. It's already in `.gitignore`.

## Usage

### API Endpoints

The application provides the following API endpoints:

#### 1. Get Playlist Information
```
GET /api/youtube/playlist/[playlistId]/info
```

Returns playlist metadata (title, description, video count, etc.)

#### 2. Get Playlist Videos
```
GET /api/youtube/playlist/[playlistId]/videos?maxResults=50&pageToken=nextPageToken
```

Returns video list with details (title, description, duration, view count, thumbnails)

Query parameters:
- `maxResults`: Number of videos to return (1-50, default: 50)
- `pageToken`: For pagination (optional)

#### 3. Get Complete Playlist Data
```
GET /api/youtube/playlist/[playlistId]?maxResults=50&pageToken=nextPageToken
```

Returns both playlist info and videos in a single request.

### React Hooks

#### useYouTubePlaylist

Main hook for fetching YouTube playlist data:

```typescript
import { useYouTubePlaylist } from '../hooks/useYouTubePlaylist';

function MyComponent() {
  const {
    playlist,
    videos,
    loading,
    error,
    hasMore,
    loadMore,
    refetch
  } = useYouTubePlaylist({
    playlistId: 'PLrAcYW6x1URNBBY10P5kRVe3fLT_j0HJg',
    maxResults: 25,
    autoFetch: true
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{playlist?.title}</h1>
      {videos.map(video => (
        <div key={video.id}>{video.title}</div>
      ))}
      {hasMore && (
        <button onClick={loadMore}>Load More</button>
      )}
    </div>
  );
}
```

#### useYouTubeVideos

Simplified hook for just fetching videos:

```typescript
import { useYouTubeVideos } from '../hooks/useYouTubePlaylist';

function VideoList({ playlistId }) {
  const { videos, loading, error } = useYouTubeVideos(playlistId);
  
  // ... component logic
}
```

#### useYouTubePlaylistInfo

Hook for fetching only playlist metadata:

```typescript
import { useYouTubePlaylistInfo } from '../hooks/useYouTubePlaylist';

function PlaylistHeader({ playlistId }) {
  const { playlist, loading, error } = useYouTubePlaylistInfo(playlistId);
  
  // ... component logic
}
```

### Component Integration

The `Programa` component demonstrates how to integrate YouTube API data:

```typescript
// Program configuration
const programPlaylists = {
  'dia-a-dia': {
    title: "Día a Día",
    playlistId: "PLKcRz7euAKoO0M-UjCUZFfudX78juCcaJ",
    description: "Program description..."
  }
};

// In component
const programConfig = programPlaylists[showName];
const { playlist, videos, loading, error } = useYouTubePlaylist({
  playlistId: programConfig?.playlistId || '',
  maxResults: 50,
  autoFetch: Boolean(programConfig?.playlistId)
});
```

## Error Handling

The API includes comprehensive error handling:

- **400**: Invalid playlist ID or parameters
- **401**: Invalid API key
- **404**: Playlist not found
- **429**: API quota exceeded
- **500**: Server error

Errors are handled gracefully in the UI with retry functionality.

## Performance Optimization

### Caching

API responses are cached using Next.js cache headers:
- Playlist info: 1 hour cache
- Playlist videos: 10 minutes cache

### Pagination

Videos are loaded in batches of 50 (YouTube API maximum) with "Load More" functionality.

### Image Optimization

YouTube thumbnails are used directly from YouTube's CDN with multiple resolution options.

## Troubleshooting

### Common Issues

1. **"YouTube API not configured"**
   - Check that `YOUTUBE_API_KEY` is set in `.env.local`
   - Restart your development server after adding the environment variable

2. **"Invalid API key"**
   - Verify your API key is correct
   - Check that YouTube Data API v3 is enabled in your GCP project
   - Ensure the API key has the necessary permissions

3. **"Playlist not found"**
   - Verify the playlist ID is correct
   - Check that the playlist is public
   - Some playlists might be region-restricted

4. **"API quota exceeded"**
   - YouTube Data API has daily quotas
   - Monitor your usage in the GCP Console
   - Consider implementing additional caching

### Testing

You can test the API endpoints directly:

```bash
# Test playlist info
curl "http://localhost:3000/api/youtube/playlist/PLrAcYW6x1URNBBY10P5kRVe3fLT_j0HJg/info"

# Test playlist videos
curl "http://localhost:3000/api/youtube/playlist/PLrAcYW6x1URNBBY10P5kRVe3fLT_j0HJg/videos?maxResults=5"
```

## Security Best Practices

1. **Never expose your API key in client-side code**
2. **Use API key restrictions in GCP Console**
3. **Monitor API usage and set up alerts**
4. **Implement rate limiting if needed**
5. **Use environment variables for configuration**

## API Quota Management

YouTube Data API v3 has the following quota costs:
- Playlist details: 1 unit
- Playlist items: 1 unit
- Video details: 1 unit

Each API call in this implementation typically costs 2-3 quota units. The default daily quota is 10,000 units, allowing for approximately 3,000-5,000 requests per day.

## Further Resources

- [YouTube Data API v3 Documentation](https://developers.google.com/youtube/v3)
- [Google Cloud Console](https://console.cloud.google.com/)
- [API Quotas and Limits](https://developers.google.com/youtube/v3/getting-started#quota)
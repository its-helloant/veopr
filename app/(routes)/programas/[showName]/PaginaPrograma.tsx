'use client';

import { useYouTubePlaylist } from '@/src/hooks/useYouTubePlaylist';
import Header from '@/src/components/shared/Header';
import Footer from '@/src/components/shared/Footer';
import VideoPlayerContainer from './VideoPlayerContainer';
import { ProgramConfig } from './ConfigProgramas';

interface DetalleProgramaProps {
  programConfig: ProgramConfig;
}

const Breadcrumb = ({ title }: { title: string }) => (
  <nav className="mb-6">
    <ol className="flex items-center space-x-2 text-sm text-gray-500">
      <li>
        <a href="/" className="hover:text-gray-700">Inicio</a>
      </li>
      <li>/</li>
      <li>
        <a href="/#programas" className="hover:text-gray-700">Programas</a>
      </li>
      <li>/</li>
      <li className="text-gray-900 font-medium">{title}</li>
    </ol>
  </nav>
);

export default function DetallePrograma({ programConfig }: DetalleProgramaProps) {
  const { videos, loading, error } = useYouTubePlaylist({
    playlistId: programConfig?.playlistId || '',
    maxResults: 50,
    autoFetch: !!programConfig?.playlistId
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb title={programConfig.title} />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{programConfig.title}</h1>
          <p className="text-gray-600">{programConfig.description}</p>
        </div>

        <VideoPlayerContainer videos={videos} />
      </div>
      <Footer />
    </div>
  );
}
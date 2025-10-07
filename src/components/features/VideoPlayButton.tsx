'use client'

export default function VideoPlayButton() {
  const handleVideoPlay = () => {
    // Video play functionality would go here
    console.log('Playing featured video');
  };

  return (
    <button
      onClick={handleVideoPlay}
      className="absolute inset-0 w-full h-full bg-transparent border-none outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 hover:bg-black hover:bg-opacity-20 focus:bg-black focus:bg-opacity-20 transition-all"
      aria-label="Reproducir programa destacado Día a Día"
    >
      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="bg-white bg-opacity-90 text-black text-xl sm:text-2xl hover:scale-110 focus:scale-110 transition-transform rounded-full w-16 h-16 flex items-center justify-center">
          <span aria-hidden="true">▶</span>
        </div>
      </div>
      <span className="sr-only">Reproducir programa destacado</span>
    </button>
  );
}


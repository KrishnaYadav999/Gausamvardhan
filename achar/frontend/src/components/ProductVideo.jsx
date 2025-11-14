import { Play, Maximize, Minimize } from "lucide-react";
import { useState, useRef } from "react";

const ProductVideo = ({ videoUrl, thumbnail }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);

  const handlePlay = () => {
    setIsPlaying(true);
    videoRef.current?.play();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg bg-black">
      {/* Video element */}
      <video
        ref={videoRef}
        src={videoUrl}
        controls={isPlaying}
        className="w-full h-full object-cover"
        poster={thumbnail || "/default-thumbnail.jpg"}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Overlay play button */}
      {!isPlaying && (
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition"
        >
          <Play className="w-16 h-16 text-white drop-shadow-lg" />
        </button>
      )}

      {/* Fullscreen button */}
      {isPlaying && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-3 right-3 bg-black/50 p-2 rounded-full hover:bg-black/70 transition"
        >
          {isFullscreen ? (
            <Minimize className="w-5 h-5 text-white" />
          ) : (
            <Maximize className="w-5 h-5 text-white" />
          )}
        </button>
      )}
    </div>
  );
};

export default ProductVideo;
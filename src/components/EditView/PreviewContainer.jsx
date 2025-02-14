/* eslint-disable react/prop-types */
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState, useEffect } from 'react';

export function PreviewContainer({ file, settings }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [file.preview]);

  // Convert any ratio format to number (e.g., "16:9" or "1920x1080" to 16/9)
  const getRatioValue = (ratio) => {
    if (!ratio) return undefined;
    
    if (ratio.includes(':')) {
      const [width, height] = ratio.split(':').map(Number);
      return width / height;
    }
    
    if (ratio.includes('x')) {
      const [width, height] = ratio.split('x').map(Number);
      return width / height;
    }
    
    return undefined;
  };

  const formatDimensions = (width, height) => {
    if (width * height > 1000000) {
      const mp = ((width * height) / 1000000).toFixed(1);
      return `${mp}MP (${width.toLocaleString()}×${height.toLocaleString()})`;
    }
    return `${width.toLocaleString()}×${height.toLocaleString()}`;
  };

  return (
    <div className="relative rounded-lg overflow-hidden bg-gray-100">
      <AspectRatio
        ratio={getRatioValue(settings.aspectRatio)}
        className="relative bg-gray-100"
      >
        {/* Background color while loading */}
        <div className="absolute inset-0 bg-gray-200" />
        
        {/* Image */}
        <img
          src={file.preview}
          alt={file.name}
          className={`
            absolute inset-0 w-full h-full object-cover transition-all duration-200
            ${isLoading ? 'opacity-50' : 'opacity-100'}
          `}
          onLoad={() => setIsLoading(false)}
        />

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200/50 animate-pulse" />
        )}

        {/* Guidelines Overlay */}
        <div className="absolute inset-0 border-2 border-white/20 pointer-events-none" />

        {/* Dimension Overlay */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs space-y-0.5">
          <div>Original: {formatDimensions(file.width, file.height)}</div>
          <div>
            Target: {formatDimensions(
              Math.round(settings.width),
              Math.round(settings.height)
            )}
          </div>
        </div>
      </AspectRatio>
    </div>
  );
}
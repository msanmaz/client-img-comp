/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

export function PreviewContainer({ file, settings }) {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
  }, [file.preview]); // Only reset loading when preview URL changes
  
  const getContainerStyle = (aspectRatio) => {
    if (aspectRatio.includes(':')) {
      const [width, height] = aspectRatio.split(':').map(Number);
      return {
        aspectRatio: `${width}/${height}`
      };
    } else {
      const [width, height] = aspectRatio.split('x').map(Number);
      return {
        aspectRatio: `${width}/${height}`
      };
    }
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
      <div
        className="relative w-full"
        style={getContainerStyle(settings.aspectRatio)}
      >
        {/* Image is always visible but dimmed during loading */}
        <img
          src={file.preview}
          alt={file.name}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-200"
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
      </div>
    </div>
  );
}
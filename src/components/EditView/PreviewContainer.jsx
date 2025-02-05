/* eslint-disable react/prop-types */
export function PreviewContainer({ file, settings }) {
  const getContainerStyle = (aspectRatio) => {
    // Handle both formats: "16:9" and "1920x1080"
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

  const getDimensions = () => {
    const { width: origWidth, height: origHeight } = file;
    const { aspectRatio } = settings;
    
    let targetWidth, targetHeight;
    if (aspectRatio.includes(':')) {
      const [w, h] = aspectRatio.split(':').map(Number);
      const ratio = w / h;
      if (origWidth / origHeight > ratio) {
        targetHeight = origHeight;
        targetWidth = origHeight * ratio;
      } else {
        targetWidth = origWidth;
        targetHeight = origWidth / ratio;
      }
    } else {
      [targetWidth, targetHeight] = aspectRatio.split('x').map(Number);
    }
    
    return { targetWidth, targetHeight };
  };

  const dimensions = getDimensions();

  return (
    <div className="relative rounded-lg overflow-hidden">
      <div 
        className="relative w-full"
        style={getContainerStyle(settings.aspectRatio)}
      >
        <img
          src={file.preview}
          alt={file.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Dimension Overlay */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
          <div>Original: {file.width}×{file.height}</div>
          <div>Target: {dimensions.targetWidth.toFixed(0)}×{dimensions.targetHeight.toFixed(0)}</div>
        </div>

        {/* Guidelines Overlay (optional) */}
        <div className="absolute inset-0 border-2 border-white/20 pointer-events-none" />
      </div>
    </div>
  );
}
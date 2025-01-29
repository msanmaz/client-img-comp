/* eslint-disable react/prop-types */
export function PreviewContainer({ file, previewDimensions, settings }) {
    const formatScale = (scale) => {
      if (!scale && scale !== 0) return '0.000';
      if (typeof scale === 'string') {
        return parseFloat(scale).toFixed(3);
      }
      return scale.toFixed(3);
    };
  
    const getScale = () => {
      const preview = previewDimensions[file.id];
      if (!preview || !preview.scale) return '0.000';
      return formatScale(preview.scale);
    };
  
    const isFixedSize = (ratio) => {
      return ratio.includes('x') && ['250x250', '1024x768', '1920x1080', '1280x720'].includes(ratio);
    };
  
    const getContainerStyle = () => {
      const { aspectRatio } = settings;
      
      if (isFixedSize(aspectRatio)) {
        // For fixed dimension presets
        const [width, height] = aspectRatio.split('x').map(Number);
        const ratio = width / height;
        
        return {
          position: 'relative',
          paddingTop: `${(1 / ratio) * 100}%`,
          width: '100%'
        };
      }
      
      // For aspect ratio formats (1:1, 16:9, etc.)
      if (aspectRatio.includes(':')) {
        const [w, h] = aspectRatio.split(':').map(Number);
        return {
          position: 'relative',
          paddingTop: `${(h / w) * 100}%`,
          width: '100%'
        };
      }
      
      // Fallback
      const ratio = settings.width / settings.height;
      return {
        position: 'relative',
        paddingTop: `${(1 / ratio) * 100}%`,
        width: '100%'
      };
    };
  
    const getImageStyle = () => {
      return {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
        transition: 'transform 0.3s ease-in-out'
      };
    };
  
    const getTargetDimensions = () => {
      const { aspectRatio } = settings;
      
      if (isFixedSize(aspectRatio)) {
        const [width, height] = aspectRatio.split('x').map(Number);
        return `${width.toLocaleString()} × ${height.toLocaleString()}`;
      }
      
      if (aspectRatio.includes(':')) {
        const [w, h] = aspectRatio.split(':').map(Number);
        const ratio = w / h;
        const targetHeight = Math.min(file.height, Math.round(file.width / ratio));
        const targetWidth = Math.round(targetHeight * ratio);
        return `${targetWidth.toLocaleString()} × ${targetHeight.toLocaleString()}`;
      }
      
      return `${settings.width.toLocaleString()} × ${settings.height.toLocaleString()}`;
    };
  
    return (
      <div className="bg-gray-50 rounded-lg">
        <div 
          className="w-full overflow-hidden"
          style={getContainerStyle()}
        >
          <img
            src={file.preview}
            alt={file.name}
            style={getImageStyle()}
          />
          
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1.5 rounded text-xs backdrop-blur-sm">
            <div className="space-y-0.5">
              <div className="text-gray-300 text-[10px]">
                Original: {file.width.toLocaleString()}×{file.height.toLocaleString()}
              </div>
              <div className="font-medium text-[10px]">
                Target: {getTargetDimensions()}
              </div>
              <div className="text-blue-300 text-[10px]">
                Scale: {getScale()}x
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default PreviewContainer;
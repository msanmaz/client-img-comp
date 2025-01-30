/* eslint-disable react/prop-types */
import { forwardRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export const ImageCanvas = forwardRef(function ImageCanvas(
  { image, crop, onChange, onComplete, aspect }, 
  ref
) {
  return (
    <div  data-testid="image-canvas"  className="relative w-full h-[calc(100vh-250px)] flex items-center justify-center bg-gray-800/50 rounded-lg">
      <div className="h-full w-full flex items-center justify-center p-4">
        <ReactCrop
          crop={crop}
          onChange={onChange}
          onComplete={onComplete}
          aspect={aspect}
          className="max-h-full max-w-full"
        >
          <img
            ref={ref}
            src={image.preview}
            alt={image.name}
            style={{
              maxHeight: 'calc(100vh - 300px)',
              maxWidth: '100%',
              objectFit: 'contain'
            }}
          />
        </ReactCrop>
      </div>
    </div>
  );
});
/* eslint-disable react/prop-types */

import { forwardRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export const ImageCanvas = forwardRef(function ImageCanvas(
  { image, crop, onChange, onComplete, aspect }, 
  ref
) {
  return (
    <div className="max-h-[70vh] overflow-hidden">
      <ReactCrop
        crop={crop}
        onChange={onChange}
        onComplete={onComplete}
        aspect={aspect}
      >
        <img
          ref={ref}
          src={image.preview}
          alt={image.name}
          className="max-w-full h-auto"
        />
      </ReactCrop>
    </div>
  );
});
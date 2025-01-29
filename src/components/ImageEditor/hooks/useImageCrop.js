import { useState, useCallback } from 'react';

export function useImageCrop() {
  const [crop, setCrop] = useState(null);
  const [completedCrop, setCompletedCrop] = useState(null);
  const [aspect, setAspect] = useState(undefined);

  const handleCropComplete = useCallback((cropResult) => {
    setCompletedCrop(cropResult);
  }, []);

  const generateCroppedImage = useCallback(async (imageRef, pixelCrop) => {
    if (!imageRef || !pixelCrop) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      imageRef,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve({
          blob,
          url: URL.createObjectURL(blob),
          width: pixelCrop.width,
          height: pixelCrop.height
        });
      }, 'image/jpeg', 1);
    });
  }, []);

  return {
    crop,
    setCrop,
    completedCrop,
    aspect,
    setAspect,
    handleCropComplete,
    generateCroppedImage
  };
}
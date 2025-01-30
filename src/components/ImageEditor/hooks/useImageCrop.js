import { useState, useCallback } from 'react';

export function useImageCrop() {
  const [crop, setCrop] = useState(null);
  const [completedCrop, setCompletedCrop] = useState(null);
  const [aspect, setAspect] = useState(undefined);

  const handleCropComplete = useCallback((cropResult) => {
    setCompletedCrop(cropResult);
  }, []);

  const generateCroppedImage = useCallback(async (imageRef, pixelCrop) => {
    if (!imageRef || !pixelCrop?.width || !pixelCrop?.height) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const scaleX = imageRef.naturalWidth / imageRef.width;
    const scaleY = imageRef.naturalHeight / imageRef.height;

    // Set canvas dimensions to match the cropped area
    canvas.width = pixelCrop.width * scaleX;
    canvas.height = pixelCrop.height * scaleY;

    ctx.drawImage(
      imageRef,
      pixelCrop.x * scaleX,
      pixelCrop.y * scaleY,
      pixelCrop.width * scaleX,
      pixelCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve({
            blob,
            url: URL.createObjectURL(blob),
            width: canvas.width,
            height: canvas.height
          });
        }
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
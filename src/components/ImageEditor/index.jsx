/* eslint-disable react/prop-types */
import { useRef, useCallback } from 'react';
import { ImageCanvas } from './components/ImageCanvas';
import { CropControls } from './components/CropControls';
import { useImageCrop } from './hooks/useImageCrop';

export function ImageEditor({ image, onSave, onCancel }) {
  const imageRef = useRef(null);
  const {
    crop,
    setCrop,
    completedCrop,
    aspect,
    setAspect,
    handleCropComplete,
    generateCroppedImage
  } = useImageCrop();

  const handleSave = useCallback(async () => {
    if (!imageRef.current || !completedCrop) return;

    try {
      const result = await generateCroppedImage(
        imageRef.current,
        completedCrop
      );

      if (result) {
        onSave({
          ...image,
          preview: result.url,
          blob: result.blob,
          width: result.width,
          height: result.height
        });
      }
    } catch (error) {
      console.error('Failed to generate cropped image:', error);
    }
  }, [completedCrop, generateCroppedImage, image, onSave]);

  return (
    <div data-testid='image-editor-modal' className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-[95vw] max-w-6xl mx-4">
        <h2 className="text-xl font-bold mb-4 text-white">Edit Image</h2>
        
        <div className="mb-4">
          <ImageCanvas
            ref={imageRef}
            image={image}
            crop={crop}
            onChange={setCrop}
            onComplete={handleCropComplete}
            aspect={aspect}
          />
        </div>

        <CropControls
          onAspectChange={setAspect}
          onSave={handleSave}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
}
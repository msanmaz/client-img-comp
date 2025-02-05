/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from 'react';
import { OutputSettings } from './OutputSettings';
import { ImageGrid } from './ImageGrid';
import { useImageProcessing } from '../../features/upload/hooks/useImageProcessing';
import { useProcessingQueue } from '../../features/upload/hooks/useProcessingQueue';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';

export function EditView({ files, onBack, setFiles }) {
  const [imageDimensions, setImageDimensions] = useState({});
  const [settings, setSettings] = useState({
    outputFormat: 'webp',
    aspectRatio: '1920x1080',
    width: 0,
    height: 0,
    quality: 75
  });

  // Core processing hooks
  const { processFile, cancelProcessing } = useImageProcessing(
    { format: settings.outputFormat, quality: settings.quality },
    setFiles
  );
  const { addToQueue, processingCount } = useProcessingQueue(processFile);

  // Image dimensions loading
  useEffect(() => {
    const loadImageDimensions = async () => {
      const dimensions = {};
      await Promise.all(files.map(file => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            dimensions[file.id] = {
              width: img.width,
              height: img.height
            };
            resolve();
          };
          img.src = file.preview;
        });
      }));
      setImageDimensions(dimensions);
      
      if (files.length > 0) {
        const firstImageDims = dimensions[files[0].id];
        const width = settings.width || firstImageDims.width;
        const height = settings.height || firstImageDims.height;
        
        setSettings(prev => ({
          ...prev,
          aspectRatio: `${width}x${height}`,
          width,
          height
        }));
      }
    };

    if (files.length > 0) {
      loadImageDimensions();
    }
  }, [files]);

  const handleProcessImages = useCallback((images) => {
    const imagesArray = Array.isArray(images) ? images : [images];
    const processOptions = imagesArray.map(image => ({
      ...image,
      width: settings.width,
      height: settings.height,
      format: settings.outputFormat.toLowerCase(),
      quality: settings.quality,
      status: 'processing'
    }));
    addToQueue(processOptions);
  }, [settings, addToQueue]);

  const handleCroppedImage = useCallback((croppedImage) => {
    setFiles(prev => prev.map(f => 
      f.id === croppedImage.id ? {
        ...f,
        preview: croppedImage.preview,
        width: croppedImage.width,
        height: croppedImage.height,
        blob: croppedImage.blob,
        isEdited: true
      } : f
    ));

    setImageDimensions(prev => ({
      ...prev,
      [croppedImage.id]: {
        width: croppedImage.width,
        height: croppedImage.height
      }
    }));
  }, [setFiles]);

  return (
    <div className="max-w-6xl mx-auto bg-gray-100 text-gray-700" data-testid="edit-view">
      <div className="flex items-center justify-between gap-4 mb-6">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="text-sm text-gray-500">
          {processingCount > 0 && `Processing ${processingCount} images...`}
        </div>
      </div>

      <OutputSettings 
        settings={settings} 
        onSettingsChange={setSettings}
        originalDimensions={imageDimensions[files[0]?.id] || { width: 0, height: 0 }}
      />

      <ImageGrid 
        files={files}
        settings={settings}
        onImageUpdate={handleProcessImages}
        onCropComplete={handleCroppedImage}
        onCancel={cancelProcessing}
      />

      <Button
        className="w-full mt-6"
        onClick={() => handleProcessImages(files)}
        disabled={processingCount > 0}
      >
        {processingCount > 0 ? `Processing ${processingCount} images...` : 'Process All Images'}
      </Button>
    </div>
  );
}
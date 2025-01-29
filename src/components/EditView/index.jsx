/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from 'react';
import { OutputSettings } from './OutputSettings';
import { ImageGrid } from './ImageGrid';
import { useImageProcessing } from '../../features/upload/hooks/useImageProcessing';
import { useProcessingQueue } from '../../features/upload/hooks/useProcessingQueue';

export function EditView({ files, onBack, setFiles }) {
  const [imageDimensions, setImageDimensions] = useState({});
  const [settings, setSettings] = useState({
    outputFormat: 'webp',
    aspectRatio: '1920x1080',
    width: 0,
    height: 0,
    quality: 75
  });

  // Initialize processing hooks
  const { processFile, cancelProcessing } = useImageProcessing(
    { format: settings.outputFormat, quality: settings.quality },
    setFiles
  );

  const { addToQueue, processingCount } = useProcessingQueue(processFile);

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
        setSettings(prev => ({
          ...prev,
          width: firstImageDims.width,
          height: firstImageDims.height
        }));
      }
    };

    if (files.length > 0) {
      loadImageDimensions();
    }
  }, [files]);

  const [previewDimensions, setPreviewDimensions] = useState({});

  useEffect(() => {
    if (!settings.aspectRatio || Object.keys(imageDimensions).length === 0) return;

    const calculateDimensions = (originalWidth, originalHeight, targetRatio) => {
      let [targetWidth, targetHeight] = targetRatio.split('x').map(Number);
      
      if (!targetWidth || !targetHeight) {
        const [w, h] = targetRatio.split(':').map(Number);
        targetWidth = w;
        targetHeight = h;
      }

      const originalRatio = originalWidth / originalHeight;
      const newRatio = targetWidth / targetHeight;

      let width, height;
      if (originalRatio > newRatio) {
        height = originalHeight;
        width = height * newRatio;
      } else {
        width = originalWidth;
        height = width / newRatio;
      }

      return { width: Math.round(width), height: Math.round(height) };
    };

    const newPreviewDimensions = {};
    files.forEach(file => {
      const originalDims = imageDimensions[file.id];
      if (originalDims) {
        const dims = calculateDimensions(
          originalDims.width,
          originalDims.height,
          settings.aspectRatio
        );
        newPreviewDimensions[file.id] = dims;
      }
    });

    setPreviewDimensions(newPreviewDimensions);
  }, [settings.aspectRatio, imageDimensions, files]);

  useEffect(() => {
    if (!settings.width || !settings.height || Object.keys(imageDimensions).length === 0) return;
  
    const calculatePreviewDimensions = (originalWidth, originalHeight, targetWidth, targetHeight) => {
      console.log('📐 Calculate Preview - Input:', {
        original: `${originalWidth}x${originalHeight}`,
        target: `${targetWidth}x${targetHeight}`,
        aspectRatio: (targetWidth / targetHeight).toFixed(2)
      });
  
      // Container constraints
      const PREVIEW_CONTAINER = {
        width: 280,  // Max width of preview container
        height: 180  // Max height of preview container
      };
  
      console.log('📦 Container Constraints:', PREVIEW_CONTAINER);
  
      // Calculate scale factors
      const containerRatio = PREVIEW_CONTAINER.width / PREVIEW_CONTAINER.height;
      const targetRatio = targetWidth / targetHeight;
  
      console.log('📊 Ratios:', {
        container: containerRatio.toFixed(2),
        target: targetRatio.toFixed(2)
      });
  
      let previewWidth, previewHeight;
  
      // First, try to fit by width
      previewWidth = PREVIEW_CONTAINER.width;
      previewHeight = previewWidth / targetRatio;
  
      console.log('🔄 Initial Scaling:', {
        byWidth: {
          width: Math.round(previewWidth),
          height: Math.round(previewHeight)
        }
      });
  
      // If height exceeds container, scale by height instead
      if (previewHeight > PREVIEW_CONTAINER.height) {
        previewHeight = PREVIEW_CONTAINER.height;
        previewWidth = previewHeight * targetRatio;
  
        console.log('↕️ Adjusting for height:', {
          width: Math.round(previewWidth),
          height: Math.round(previewHeight)
        });
      }
  
      const finalDimensions = {
        width: Math.round(previewWidth),
        height: Math.round(previewHeight),
        scale: (previewWidth / targetWidth).toFixed(3),
        targetWidth,
        targetHeight
      };
  
      console.log('✅ Final Preview Dimensions:', finalDimensions);
  
      return finalDimensions;
    };
  
    console.log('🎯 Processing Files for Preview:', {
      filesCount: files.length,
      settings: {
        width: settings.width,
        height: settings.height,
        ratio: (settings.width / settings.height).toFixed(2)
      }
    });
  
    const newPreviewDimensions = {};
    files.forEach(file => {
      const originalDims = imageDimensions[file.id];
      if (originalDims) {
        console.log(`\n📝 Processing Preview for ${file.name}:`, {
          original: `${originalDims.width}x${originalDims.height}`,
          target: `${settings.width}x${settings.height}`
        });
  
        newPreviewDimensions[file.id] = calculatePreviewDimensions(
          originalDims.width,
          originalDims.height,
          settings.width,
          settings.height
        );
      }
    });
  
    setPreviewDimensions(newPreviewDimensions);
  }, [settings.width, settings.height, imageDimensions, files]);

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
    console.log(`PROCESS OPTIONS: ${processOptions}`)
    addToQueue(processOptions);
  }, [settings, addToQueue]);

  return (
    <div className="max-w-6xl mx-auto bg-gray-100 text-gray-700">
      <div className="flex items-center justify-between gap-4 mb-6">
        <button onClick={onBack} className="text-gray-400 hover:text-white">
          ← Back to Upload
        </button>
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
        onImageUpdate={handleProcessImages}
        previewDimensions={previewDimensions}
        onCancel={cancelProcessing}
        settings={settings} 
      />

      <button 
        onClick={() => handleProcessImages(files)}
        className="w-full mt-6 bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700 font-medium"
        disabled={processingCount > 0}
      >
        {processingCount > 0 ? `Processing ${processingCount} images...` : 'Process All Images'}
      </button>
    </div>
  );
}
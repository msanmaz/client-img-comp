import { useState, useCallback } from 'react';
import { DropZone } from './DropZone';
import { FilePreviewGrid } from './FilePreviewGrid';
import { CompressionOptions } from './CompressionOptions';
import { processImage, getFileType } from '../lib/utils/imageProcessing';

export function ImageUploadContainer() {
  const [files, setFiles] = useState([]);
  const [compressionSettings, setCompressionSettings] = useState({
    format: 'webp',
    quality: 75
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesAccepted = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file: file.file || file, // Handle both processed and raw files
      name: file.name,
      size: file.size,
      type: getFileType(file.file || file),
      preview: file.preview || null, // Use existing preview if available
      status: 'pending'
    }));
  
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleRemoveFile = useCallback((fileId) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  }, []);

  const handleFormatChange = useCallback((format) => {
    setCompressionSettings(prev => ({ ...prev, format }));
  }, []);

  const handleQualityChange = useCallback((quality) => {
    setCompressionSettings(prev => ({ ...prev, quality }));
  }, []);

  const handleCompression = useCallback(async () => {
    if (!files.length) return;
    
    try {
      setIsProcessing(true);
      
      // Take first file for testing
      const file = files[0];
      
      console.log('Starting compression with settings:', {
        format: compressionSettings.format,
        quality: compressionSettings.quality,
        originalSize: file.size,
        fileType: file.type
      });

      // Process the image
      const compressedBuffer = await processImage(file.file, compressionSettings);
      
      // Create blob and preview
      const blob = new Blob([compressedBuffer], { 
        type: `image/${compressionSettings.format}` 
      });
      const preview = URL.createObjectURL(blob);

      console.log('Compression complete:', {
        originalSize: file.size,
        compressedSize: compressedBuffer.byteLength,
        reduction: ((1 - compressedBuffer.byteLength / file.size) * 100).toFixed(2) + '%'
      });

      // Update file state with result
      setFiles(prev => 
        prev.map(f => 
          f.id === file.id ? {
            ...f,
            preview,
            compressedSize: compressedBuffer.byteLength,
            status: 'complete',
            blob,
            outputType: compressionSettings.format
          } : f
        )
      );

    } catch (error) {
      console.error('Compression failed:', error);
      // Update file status to error
      setFiles(prev =>
        prev.map(f =>
          f.id === files[0].id ? {
            ...f,
            status: 'error',
            error: error.message
          } : f
        )
      );
    } finally {
      setIsProcessing(false);
    }
  }, [files, compressionSettings]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl text-center font-bold mb-6">
        Image Compression Tool
      </h1>

      <CompressionOptions
        format={compressionSettings.format}
        quality={compressionSettings.quality}
        onFormatChange={handleFormatChange}
        onQualityChange={handleQualityChange}
      />

      <DropZone
        onFileAccepted={handleFilesAccepted}
        maxFiles={10}
      />

      {files.length > 0 && (
        <>
          <FilePreviewGrid
            files={files}
            onRemove={handleRemoveFile}
          />

          <div className="mt-6 text-center">
            <button
              className={`
                px-6 py-2 rounded-lg transition-colors duration-200
                ${isProcessing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
                }
                text-white
              `}
              onClick={handleCompression}
              disabled={isProcessing || !files.length}
            >
              {isProcessing 
                ? 'Processing...' 
                : `Compress Test Image`
              }
            </button>
          </div>
        </>
      )}
    </div>
  );
}
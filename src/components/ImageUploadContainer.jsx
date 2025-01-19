import { useState, useCallback, useMemo } from 'react';
import { DropZone } from './dropZone';
import { FilePreviewGrid } from './filePreviewGrid';
import { CompressionOptions } from './CompressionOptions/index'
import { useImageProcessing } from '../features/upload/hooks/useImageProcessing';
import { useProcessingQueue } from '../features/upload/hooks/useProcessingQueue';
import { useCompressionSettings } from '../features/upload/hooks/useCompressionSettings';

export function ImageUploadContainer() {
  const [files, setFiles] = useState([]);

  const {
    settings: compressionSettings,
    handleFormatChange,
    handleQualityChange
  } = useCompressionSettings();

  const { processFile, cancelProcessing } = useImageProcessing(
    compressionSettings, 
    setFiles
  );

  const { addToQueue, processingCount, cancelProcessing: cancelQueue } = useProcessingQueue(processFile);

  const handleFilesAccepted = useCallback((acceptedFiles) => {
    const createPreview = (file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file.file || file);
      });
    };
  
    const processFiles = async (files) => {
      const newFiles = await Promise.all(
        files.map(async (file) => {
          const preview = await createPreview(file.file || file);
          return {
            id: Math.random().toString(36).substr(2, 9),
            file: file.file || file,
            name: file.name,
            size: file.size,
            preview,  // Preview at root level
            status: 'pending'
          };
        })
      );
  
      setFiles(prev => [...prev, ...newFiles]);
      addToQueue(newFiles);
    };
  
    processFiles(acceptedFiles);
  }, [addToQueue]);

  const handleRemoveFile = useCallback((fileId) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  }, []);

  const handleCancelProcessing = useCallback((fileId) => {
    cancelProcessing(fileId);
    cancelQueue(fileId);
  }, [cancelProcessing, cancelQueue]);

  // Memoize child components' props
  const compressionProps = useMemo(() => ({
    format: compressionSettings.format,
    quality: compressionSettings.quality,
    onFormatChange: handleFormatChange,
    onQualityChange: handleQualityChange
  }), [compressionSettings.format, compressionSettings.quality, handleFormatChange, handleQualityChange]);

  const dropZoneProps = useMemo(() => ({
    onFileAccepted: handleFilesAccepted,
    maxFiles: 10
  }), [handleFilesAccepted]);

  const previewGridProps = useMemo(() => ({
    files,
    onRemove: handleRemoveFile,
    onCancel: handleCancelProcessing,
    processingCount,
  }), [files, handleRemoveFile, handleCancelProcessing, processingCount]);

  return (
    <div className="container mx-auto p-6" data-testid="image-upload-container">
      <h1 className="text-2xl text-center font-bold mb-6">
        Image Compression Tool
      </h1>

      <CompressionOptions {...compressionProps} />

      <DropZone {...dropZoneProps} />

      {files.length > 0 && (
        <FilePreviewGrid {...previewGridProps} />
      )}
    </div>
  );
}
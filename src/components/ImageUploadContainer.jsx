import { useState, useCallback, useMemo } from 'react';
import { DropZone } from './DropZone';
import { FilePreviewGrid } from './FilePreviewGrid';
import { CompressionOptions } from './CompressionOptions';
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


  const { processFile } = useImageProcessing(
    compressionSettings, 
    setFiles
  );

  const { addToQueue } = useProcessingQueue(processFile);

  const handleFilesAccepted = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      status: 'pending'
    }));

    setFiles(prev => [...prev, ...newFiles]);
    addToQueue(newFiles);
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
      onRemove: handleRemoveFile
    }), [files, handleRemoveFile]);
  


  return (
    <div className="container mx-auto p-6">
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
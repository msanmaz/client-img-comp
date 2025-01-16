import { useState, useCallback } from 'react';
import { fileService } from '@fileUpload/fileService';

export function useFileUpload({ onFileAccepted, maxFiles = 10 } = {}) {
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState([]);

  const resetState = useCallback(() => {
    setErrors([]);
    setIsDragging(false);
  }, []);

  const processFiles = useCallback(async (files) => {
    resetState();
    const newErrors = [];

    // Check number of files
    if (files.length > maxFiles) {
      setErrors([`Maximum ${maxFiles} files allowed`]);
      return;
    }

    // Process each file
    const processedFiles = await Promise.all(
      Array.from(files).map(async (file) => {
        try {
          return await fileService.processFile(file);
        } catch (error) {
          newErrors.push(`${file.name}: ${error.message}`);
          return null;
        }
      })
    );

    // Handle results
    const validFiles = processedFiles.filter(Boolean);
    if (validFiles.length && onFileAccepted) {
      onFileAccepted(validFiles);
    }

    if (newErrors.length) {
      setErrors(newErrors);
    }
  }, [maxFiles, onFileAccepted, resetState]);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    resetState();
    
    const { files } = event.dataTransfer;
    if (files?.length) {
      processFiles(files);
    }
  }, [processFiles, resetState]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  return {
    isDragging,
    errors,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    processFiles
  };
}

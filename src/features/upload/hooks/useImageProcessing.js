import { useCallback, useEffect, useRef } from "react";
import { processImage } from "../../../lib/utils/imageProcessing";

export function useImageProcessing(compressionSettings, setFiles) {
  // Keep track of aborted files
  const abortedFiles = useRef(new Set());

  // Cleanup function to handle component unmount
  useEffect(() => {
    const currentAbortedFiles = abortedFiles.current;
    return () => {
      // Cleanup any pending operations
      currentAbortedFiles.clear();
    };
  }, []);

  const processFile = useCallback(async (file) => {
    // Skip if this file was aborted
    if (abortedFiles.current.has(file.id)) {
      return { success: false, error: 'Operation aborted' };
    }

    try {
      // Update status to processing
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'processing' } : f
      ));

      // Process the image in the worker
      const compressedBuffer = await processImage(file, compressionSettings);

      // Skip further processing if aborted
      if (abortedFiles.current.has(file.id)) {
        return { success: false, error: 'Operation aborted' };
      }

      // Create result blob and preview
      const blob = new Blob([compressedBuffer], {
        type: `image/${compressionSettings.format}`
      });
      const preview = URL.createObjectURL(blob);

      // Update success state
      setFiles(prev => prev.map(f => 
        f.id === file.id ? {
          ...f,
          status: 'complete',
          preview,
          blob,
          compressedSize: compressedBuffer.byteLength,
          outputType: compressionSettings.format
        } : f
      ));

      return { success: true };
    } catch (error) {
      // Skip error state update if aborted
      if (abortedFiles.current.has(file.id)) {
        return { success: false, error: 'Operation aborted' };
      }

      // Update error state
      setFiles(prev => prev.map(f => 
        f.id === file.id ? {
          ...f,
          status: 'error',
          error: error.message
        } : f
      ));

      return { success: false, error };
    }
  }, [compressionSettings, setFiles]);

  // Add ability to cancel processing
  const cancelProcessing = useCallback((fileId) => {
    abortedFiles.current.add(fileId);
  }, []);

  // Clear abort flag for a file
  const clearAborted = useCallback((fileId) => {
    abortedFiles.current.delete(fileId);
  }, []);

  return { 
    processFile,
    cancelProcessing,
    clearAborted
  };
}
  
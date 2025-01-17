import { useCallback } from "react";
import { processImage } from "../../../lib/utils/imageProcessing";

export function useImageProcessing(compressionSettings, setFiles) {
    const processFile = useCallback(async (file) => {
      try {
        // Update status to processing
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'processing'} : f
        ));
        console.log(file,'file processsing in useImageProcessing');
        const compressedBuffer = await processImage(
          file.file, 
          compressionSettings
        );
        console.log('creating the blob');

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
  
    return { processFile };
  }
  
import { useState, useCallback, useRef, useEffect } from 'react';
import { decode, encode, getFileType } from '../../../lib/utils/imageProcessing'

export function useProcessingQueue(compressionSettings) {
  const MAX_PARALLEL_PROCESSING = 3;
  const [queue, setQueue] = useState([]);
  const processingCount = useRef(0);
  const processingFiles = useRef(new Set());

  const processFile = useCallback(async (file) => {
    if (processingFiles.current.has(file.id)) return;
    
    processingFiles.current.add(file.id);
    processingCount.current++;

    try {
      file.setStatus('processing');

      const fileBuffer = await file.file.arrayBuffer();
      const sourceType = getFileType(file.file);

      // Decode image
      const imageData = await decode(sourceType, fileBuffer);

      // Encode to target format
      const compressedBuffer = await encode(
        compressionSettings.format, 
        imageData, 
        { quality: compressionSettings.quality }
      );

      // Create preview
      const blob = new Blob(
        [compressedBuffer], 
        { type: `image/${compressionSettings.format}` }
      );
      const preview = URL.createObjectURL(blob);

      file.setResult({
        preview,
        blob,
        compressedSize: compressedBuffer.byteLength,
        outputType: compressionSettings.format
      });
      
      file.setStatus('complete');
    } catch (error) {
      console.error('Processing failed:', error);
      file.setError(error.message || 'Failed to process file');
      file.setStatus('error');
    } finally {
      processingFiles.current.delete(file.id);
      processingCount.current--;
      setTimeout(processNextInQueue, 0);
    }
  }, [compressionSettings]);

  const processNextInQueue = useCallback(() => {
    if (queue.length === 0) return;

    while (
      queue.length > 0 && 
      processingCount.current < MAX_PARALLEL_PROCESSING
    ) {
      const nextFile = queue.shift();
      if (!processingFiles.current.has(nextFile.id)) {
        processFile(nextFile);
      }
    }
  }, [queue, processFile]);

  useEffect(() => {
    if (queue.length > 0) {
      processNextInQueue();
    }
  }, [queue, processNextInQueue]);

  const addToQueue = useCallback((file) => {
    setQueue(prev => [...prev, file]);
  }, []);

  return { addToQueue };
}
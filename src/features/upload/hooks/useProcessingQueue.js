import { useCallback, useEffect, useRef, useState } from "react";

export function useProcessingQueue(processFile) {
  const MAX_PARALLEL = 3;
  const processingFiles = useRef(new Set());
  const [queue, setQueue] = useState([]);
  const isProcessing = useRef(false);
  const queueRef = useRef([]);

  const cancelProcessing = useCallback((fileId) => {
    // Remove from queue if present
    if (queueRef.current.some(f => f.id === fileId)) {
      const newQueue = queueRef.current.filter(f => f.id !== fileId);
      queueRef.current = newQueue;
      setQueue(newQueue);
    }

    // If currently processing, mark for cancellation
    if (processingFiles.current.has(fileId)) {
      processingFiles.current.delete(fileId);
    }
  }, []);

  const processNextInQueue = useCallback(async () => {
    console.log('🔄 Checking queue:', {
      queueLength: queue.length,
      currentlyProcessing: processingFiles.current.size,
      isProcessing: isProcessing.current,
      processingFiles: Array.from(processingFiles.current)
    });

    if (isProcessing.current) {
      console.log('⏳ Already processing, skipping...');
      return;
    }
    if (queue.length === 0) {
      console.log('✅ Queue empty, nothing to process');
      return;
    }

    try {
      isProcessing.current = true;
      console.log('🚀 Starting processing cycle');

      const availableSlots = MAX_PARALLEL - processingFiles.current.size;
      console.log(`📊 Available processing slots: ${availableSlots}`);

      if (availableSlots <= 0) return;

      const processableFiles = queue
        .filter(file => !processingFiles.current.has(file.id))
        .slice(0, availableSlots);

      if (processableFiles.length === 0) return;

      // Update queue
      queueRef.current = queue.filter(file => 
        !processableFiles.some(pFile => pFile.id === file.id)
      );
      setQueue(queueRef.current);

      // Process files in parallel
      await Promise.all(processableFiles.map(async (file) => {
        if (processingFiles.current.has(file.id)) return;
        
        processingFiles.current.add(file.id);
        
        try {
          await processFile(file);
        } catch (error) {
          console.error(`Error processing file ${file.id}:`, error);
        } finally {
          processingFiles.current.delete(file.id);
        }
      }));

    } finally {
      console.log('🏁 Processing cycle complete', {
        remainingInQueue: queueRef.current.length,
        processingCount: processingFiles.current.size
      });
      isProcessing.current = false;
    }
  }, [queue, processFile]);

  const addToQueue = useCallback((files) => {
    console.log('📥 Adding files to queue:', {
      filesCount: files.length,
      currentQueue: queueRef.current.length,
      processingCount: processingFiles.current.size
    });
    const newFiles = files.filter(
      file => !processingFiles.current.has(file.id) &&
             !queueRef.current.some(qFile => qFile.id === file.id)
    );

    if (newFiles.length > 0) {
      queueRef.current = [...queueRef.current, ...newFiles];
      setQueue(queueRef.current);
    }
  }, []);

  useEffect(() => {
    if (queue.length > 0 && !isProcessing.current) {
      processNextInQueue();
    }
  }, [queue, processNextInQueue]);

  return { 
    addToQueue,
    cancelProcessing,
    isProcessing: isProcessing.current,
    queueLength: queueRef.current.length,
    processingCount: processingFiles.current.size
  };
}
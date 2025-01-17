import { useCallback, useEffect, useRef, useState } from "react";

export function useProcessingQueue(processFile) {
  const MAX_PARALLEL = 3;
  const processingFiles = useRef(new Set());
  const [queue, setQueue] = useState([]);
  const isProcessing = useRef(false);
  const queueRef = useRef([]); // Add ref to track actual queue state

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

      // Calculate available slots
      const availableSlots = MAX_PARALLEL - processingFiles.current.size;
      console.log(`📊 Available processing slots: ${availableSlots}`);

      if (availableSlots <= 0) {
        console.log('⚠️ No available slots, waiting...');
        return;
      }

      const processableFiles = queue
        .filter(file => !processingFiles.current.has(file.id))
        .slice(0, availableSlots);

      console.log('📋 Files to process:', {
        count: processableFiles.length,
        files: processableFiles.map(f => ({
          id: f.id,
          name: f.name,
          size: f.size
        }))
      });

      if (processableFiles.length === 0) {
        console.log('ℹ️ No eligible files to process');
        return;
      }

      // Update queue first - using both ref and state
      queueRef.current = queue.filter(file => 
        !processableFiles.some(pFile => pFile.id === file.id)
      );
      
      setQueue(queueRef.current);
      console.log('🔄 Updated queue:', {
        before: queue.length,
        after: queueRef.current.length,
        removed: queue.length - queueRef.current.length
      });

      // Process files sequentially
      for (const file of processableFiles) {
        if (processingFiles.current.has(file.id)) {
          console.log(`⚠️ File ${file.id} already processing, skipping`);
          continue;
        }

        console.log(`🔄 Processing file: ${file.id}`, {
          name: file.name,
          size: file.size
        });
        
        processingFiles.current.add(file.id);
        
        try {
          await processFile(file);
          console.log(`✅ Successfully processed file: ${file.id}`);
        } catch (error) {
          console.error(`❌ Error processing file ${file.id}:`, error);
        } finally {
          processingFiles.current.delete(file.id);
          console.log(`🧹 Cleaned up file: ${file.id}`, {
            remainingInProcess: processingFiles.current.size
          });
        }
      }
    } finally {
      isProcessing.current = false;
      console.log('🏁 Processing cycle complete', {
        remainingInQueue: queueRef.current.length,
        processingCount: processingFiles.current.size
      });
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

    console.log('✨ New files to add:', {
      eligible: newFiles.length,
      filtered: files.length - newFiles.length
    });

    if (newFiles.length > 0) {
      queueRef.current = [...queueRef.current, ...newFiles];
      setQueue(queueRef.current);
      console.log('📊 Queue updated:', {
        before: queue.length,
        after: queueRef.current.length
      });
    }
  }, [queue]);

  // Single useEffect to handle queue processing
  useEffect(() => {
    console.log('👀 Queue changed:', {
      length: queue.length,
      isProcessing: isProcessing.current
    });

    if (queue.length > 0 && !isProcessing.current) {
      console.log('🎬 Initiating processing cycle');
      processNextInQueue();
    }
  }, [queue, processNextInQueue]);

  return { 
    addToQueue,
    isProcessing: isProcessing.current,
    queueLength: queueRef.current.length,
    processingCount: processingFiles.current.size
  };
}
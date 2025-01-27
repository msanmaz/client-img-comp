let workerCounter = 0;

function createWorker() {
  const worker = new Worker(
    new URL('../workers/imageProcessing.worker.js', import.meta.url),
    { type: 'module' }
  );
  return worker;
}

export function getFileType(file) {
  if (file.name.toLowerCase().endsWith('jxl')) return 'jxl';
  const type = file.type.split('/')[1];
  return type === 'jpeg' ? 'jpg' : type;
}

export const processImage = (fileObj, options) => {
  return new Promise((resolve, reject) => {
    const file = fileObj.file || fileObj;
    const sourceType = getFileType(file);
    
    // Validate compression options
    const compressionOptions = {
      format: options?.format || 'webp',
      quality: options?.format === 'png' ? 100 : (options?.quality || 75)
    };
    
    console.log('🎯 Processing image:', {
      name: file.name,
      type: sourceType,
      size: file.size,
      options: compressionOptions
    });

    file.arrayBuffer().then(buffer => {
      // Create a new worker for each file
      const worker = createWorker();
      const workerId = ++workerCounter;
      
      console.log(`🔧 Created worker #${workerId} for ${file.name}`);
      
      worker.onmessage = (e) => {
        if (e.data.success) {
          console.log(`✅ Worker #${workerId} completed successfully`);
          resolve(e.data.buffer);
        } else {
          console.error(`❌ Worker #${workerId} failed:`, e.data.error);
          reject(new Error(e.data.error));
        }
        // Terminate the worker after completion
        worker.terminate();
        console.log(`🔚 Terminated worker #${workerId}`);
      };

      worker.onerror = (error) => {
        console.error(`💥 Worker #${workerId} error:`, error);
        reject(new Error(`Worker error: ${error.message}`));
        worker.terminate();
        console.log(`🔚 Terminated worker #${workerId} due to error`);
      };

      console.log(`📤 Sending to worker #${workerId}:`, { 
        fileName: file.name,
        bufferSize: buffer.byteLength 
      });
      
      worker.postMessage({
        file: buffer,
        sourceType,
        options: compressionOptions
      }, [buffer]);
    });
  });
};



import * as webp from '@jsquash/webp';
import * as jpeg from '@jsquash/jpeg';
import * as png from '@jsquash/png';

// Initialize WASM modules
const wasmInitialized = new Map();

async function ensureWasmLoaded(format) {
  if (wasmInitialized.get(format)) return;
  
  try {
    switch (format) {
      case 'webp':
        await import('@jsquash/webp');
        break;
      case 'jpeg':
      case 'jpg':
        await import('@jsquash/jpeg');
        break;
      case 'png':
        await import('@jsquash/png');
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
    wasmInitialized.set(format, true);
  } catch (error) {
    throw new Error(`Failed to initialize ${format} support: ${error.message}`);
  }
}

async function decode(sourceType, fileBuffer) {
  await ensureWasmLoaded(sourceType);
  
  try {
    switch (sourceType) {
      case 'jpeg':
      case 'jpg':
        return await jpeg.decode(fileBuffer);
      case 'png':
        return await png.decode(fileBuffer);
      case 'webp':
        return await webp.decode(fileBuffer);
      default:
        throw new Error(`Unsupported source type: ${sourceType}`);
    }
  } catch (error) {
    throw new Error(`Failed to decode ${sourceType} image: ${error.message}`);
  }
}

async function encode(outputType, imageData, options) {
  await ensureWasmLoaded(outputType);
  
  try {
    switch (outputType) {
      case 'webp':
        return await webp.encode(imageData, { 
          quality: options.quality / 100
        });
      case 'jpeg':
        return await jpeg.encode(imageData, { 
          quality: options.quality 
        });
      case 'png':
        return await png.encode(imageData);
      default:
        throw new Error(`Unsupported output type: ${outputType}`);
    }
  } catch (error) {
    throw new Error(`Failed to encode to ${outputType}: ${error.message}`);
  }
}

self.onmessage = async (e) => {
  const { file, sourceType, options } = e.data;
  
  console.log('👷 Worker received file:', { 
    sourceType, 
    options,
    bufferSize: file.byteLength 
  });
  
  try {
    const imageData = await decode(sourceType, file);
    console.log('🔍 Decoded image:', { 
      width: imageData.width, 
      height: imageData.height 
    });
    
    const compressedBuffer = await encode(options.format, imageData, options);
    console.log('💾 Compressed image:', { 
      originalSize: file.byteLength,
      compressedSize: compressedBuffer.byteLength,
      ratio: (compressedBuffer.byteLength / file.byteLength * 100).toFixed(2) + '%'
    });
    
    self.postMessage({ 
      success: true, 
      buffer: compressedBuffer 
    }, [compressedBuffer]);
  } catch (error) {
    console.error('❌ Worker error:', error);
    self.postMessage({ 
      success: false, 
      error: error.message 
    });
  }
}; 
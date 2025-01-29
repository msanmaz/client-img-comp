import * as webp from '@jsquash/webp';
import * as jpeg from '@jsquash/jpeg';
import * as png from '@jsquash/png';
import * as avif from '@jsquash/avif';
import * as jxl from '@jsquash/jxl';

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
      case 'avif':
        await import('@jsquash/avif');
        break;
      case 'jxl':
        await import('@jsquash/jxl');
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
      case 'avif':
        return await avif.decode(fileBuffer);
      case 'jxl':
        return await jxl.decode(fileBuffer);
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
      case 'avif':
        return await avif.encode(imageData, {
          quality: options.quality,
          speed: 8  // Range 0-10, higher is faster but lower quality
        });
      case 'jxl':
        return await jxl.encode(imageData, {
          quality: options.quality,
          speed: 7,  // Range 1-9, higher is faster but lower quality
          progressive: true
        });
      default:
        throw new Error(`Unsupported output type: ${outputType}`);
    }
  } catch (error) {
    throw new Error(`Failed to encode to ${outputType}: ${error.message}`);
  }
}

async function resizeImage(imageData, targetWidth, targetHeight) {
  console.log('📏 Resize params:', {
    sourceWidth: imageData.width,
    sourceHeight: imageData.height,
    targetWidth,
    targetHeight
  });

  // Create temporary canvas for the source image
  const sourceCanvas = new OffscreenCanvas(imageData.width, imageData.height);
  const sourceCtx = sourceCanvas.getContext('2d');
  
  // Put the imageData on the source canvas
  sourceCtx.putImageData(imageData, 0, 0);
  
  // Create target canvas
  const targetCanvas = new OffscreenCanvas(targetWidth, targetHeight);
  const targetCtx = targetCanvas.getContext('2d');
  
  // Draw from source to target with resize
  targetCtx.drawImage(
    sourceCanvas,
    0, 0, imageData.width, imageData.height,
    0, 0, targetWidth, targetHeight
  );
  
  // Get the resized image data
  return targetCtx.getImageData(0, 0, targetWidth, targetHeight);
}

self.onmessage = async (e) => {
  const { file, sourceType, options } = e.data;
  
  console.log('👷 Worker received:', {
    sourceType,
    options,
    bufferSize: file.byteLength
  });
  
  try {
    let imageData = await decode(sourceType, file);
    console.log('🎨 Decoded image:', {
      width: imageData.width,
      height: imageData.height,
      hasData: !!imageData.data
    });
    
    if (options.width && options.height) {
      console.log('✂️ Resizing to:', {
        width: options.width,
        height: options.height
      });
      imageData = await resizeImage(imageData, options.width, options.height);
      console.log('✅ Resize complete:', {
        width: imageData.width,
        height: imageData.height
      });
    }
    
    console.log('🎯 Encoding with:', options);
    const compressedBuffer = await encode(options.format, imageData, options);
    
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
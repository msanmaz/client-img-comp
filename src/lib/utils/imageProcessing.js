import * as webp from '@jsquash/webp';
import * as jpeg from '@jsquash/jpeg';
import * as png from '@jsquash/png';
import { ensureWasmLoaded } from './wasm';

export const decode = async (sourceType, fileBuffer) => {
  // Ensure WASM is loaded before attempting decode
  await ensureWasmLoaded(sourceType);
  console.log('sourceType', sourceType);
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
    console.error(`Failed to decode ${sourceType} image:`, error);
    throw new Error(`Failed to decode ${sourceType} image: ${error.message}`);
  }
};

export const encode = async (outputType, imageData, options) => {
  // Ensure WASM is loaded before attempting encode
  await ensureWasmLoaded(outputType);
  
  try {
    switch (outputType) {
      case 'webp':
        return await webp.encode(imageData, { 
          quality: options.quality / 100 // Convert to 0-1 range
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
    console.error(`Failed to encode to ${outputType}:`, error);
    throw new Error(`Failed to encode to ${outputType}: ${error.message}`);
  }
};


export function getFileType(file) {
  if (file.name.toLowerCase().endsWith('jxl')) return 'jxl';
  const type = file.type.split('/')[1];
  return type === 'jpeg' ? 'jpg' : type;
}


// Export our core image processing functions
export const processImage = async (file, options) => {
  const sourceType = getFileType(file);
  const fileBuffer = await file.arrayBuffer();
  
  // Decode
  const imageData = await decode(sourceType, fileBuffer);
  
  // Encode
  const compressedBuffer = await encode(options.format, imageData, options);
  
  return compressedBuffer;
};



// Track WASM module initialization
const wasmInitialized = new Map();

export async function ensureWasmLoaded(format) {
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
    console.log(`WASM initialized for ${format}`);
  } catch (error) {
    console.error(`Failed to initialize WASM for ${format}:`, error);
    throw new Error(`Failed to initialize ${format} support`);
  }
}
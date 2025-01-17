export const generateDownloadFilename = (originalName, format) => {
    const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    return `${baseName}_compressed.${format}`;
  };


export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };
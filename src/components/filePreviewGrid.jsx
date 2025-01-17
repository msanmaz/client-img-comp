/* eslint-disable react/prop-types */
import { useCallback } from 'react';
import { generateDownloadFilename,formatFileSize } from '../utils/fileUtils';

export function FilePreviewGrid({ files, onRemove }) {
  const handleDownload = useCallback((file) => {
    if (!file.blob || file.status !== 'complete') return;

    const downloadUrl = URL.createObjectURL(file.blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = generateDownloadFilename(file.name, file.outputType);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
  }, []);


  
  console.log(files,'incoming files in filepreviewgrid');
  return (
    <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {files.map(file => (
        <div 
          key={file.id} 
          className="relative group bg-white rounded-lg shadow-sm overflow-hidden"
        >
          {/* Existing preview image */}
          <img 
            src={file.preview} 
            alt={file.name}
            className="w-full h-48 object-cover"
          />
          
          {/* Status and Controls */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black bg-opacity-50 transition-opacity duration-200">
            {file.status === 'complete' && (
              <button
                onClick={() => handleDownload(file)}
                className="mx-2 p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>
            )}
            <button
              onClick={() => onRemove(file.id)}
              className="mx-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
          {/* File Info */}
          <div className="p-2">
            <p className="text-sm font-medium text-gray-900 truncate">
              {file.name}
            </p>
            {file.status === 'complete' && (
              <p className="text-xs text-gray-500">
                {`${formatFileSize(file.size)} → ${formatFileSize(file.compressedSize)}`}
                <span className="ml-2 text-green-500">
                  ({((1 - file.compressedSize / file.size) * 100).toFixed(1)}% smaller)
                </span>
              </p>
            )}
            {file.status === 'error' && (
              <p className="text-xs text-red-500">{file.error}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
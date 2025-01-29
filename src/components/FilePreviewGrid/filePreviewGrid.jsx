/* eslint-disable react/prop-types */
import { useCallback } from 'react';
import { generateDownloadFilename, formatFileSize } from '../../utils/fileUtils';
import { ImageEditor } from '../ImageEditor';
import { useState } from 'react';

export function FilePreviewGrid({ files, onRemove, onCancel, processingCount, onImageUpdate }) {
  const [editingFile, setEditingFile] = useState(null);
  
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

  const handleEditComplete = useCallback((editedFile) => {
    onImageUpdate?.(editedFile);
    setEditingFile(null);
  }, [onImageUpdate]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {files.map(file => (
          <div key={file.id} className="bg-gray-900 rounded-lg overflow-hidden relative group">
            <div className="h-64 relative">
              <img
                src={file.preview || "/placeholder.svg"}
                alt={file.name}
                className="w-full h-full object-cover"
              />
              {(file.status === 'pending' || file.status === 'processing') && processingCount > 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <svg className="w-6 h-6 animate-spin text-blue-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              )}
              
              {/* Controls Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity duration-200">
                {file.status === 'complete' && (
                  <>
                    <button
                      onClick={() => setEditingFile(file)}
                      aria-label="Edit image"
                      className="mx-2 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDownload(file)}
                      aria-label="Download compressed file"
                      className="mx-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onRemove(file.id)}
                      aria-label="Remove file"
                      className="mx-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </>
                )}
                {(file.status === 'processing' || file.status === 'pending') && (
                  <button
                    onClick={() => onCancel(file.id)}
                    aria-label="Cancel processing"
                    className="mx-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                {file.status === 'cancelled' && (
                  <button
                    onClick={() => onRemove(file.id)}
                    aria-label="Remove cancelled file"
                    className="mx-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="p-4">
              <p className="text-sm font-medium truncate mb-2 text-white">
                {file.name}
              </p>
              {file.status === 'complete' && (
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{formatFileSize(file.size)} → {formatFileSize(file.compressedSize)}</span>
                  <span className="text-green-400">
                    ({((1 - file.compressedSize / file.size) * 100).toFixed(1)}% smaller)
                  </span>
                </div>
              )}
              {(file.status === 'pending' || file.status === 'processing') && processingCount > 0 && (
                <p className="text-xs text-blue-400">
                  {file.status === 'processing' ? 'Compressing...' : 'Waiting...'}
                </p>
              )}
              {file.status === 'error' && (
                <p className="text-xs text-red-500">{file.error}</p>
              )}
              {file.status === 'cancelled' && (
                <p className="text-xs text-yellow-500">Cancelled - Click to remove</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {editingFile && (
        <ImageEditor
          image={editingFile}
          onSave={handleEditComplete}
          onCancel={() => setEditingFile(null)}
        />
      )}
    </>
  );
}
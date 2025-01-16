import { useState } from 'react';
import { DropZone } from './dropZone';
import { FilePreviewGrid } from './filePreviewGrid';

export function ImageUploadContainer() {
  const [files, setFiles] = useState([]);

  const handleFilesAccepted = (acceptedFiles) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  };

  const handleRemoveFile = (fileId) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl text-center font-bold mb-6">
        Image Compression Tool
      </h1>
      
      <DropZone
        onFileAccepted={handleFilesAccepted}
        maxFiles={10}
      />
      
      <FilePreviewGrid
        files={files}
        onRemove={handleRemoveFile}
      />

      {files.length > 0 && (
        <div className="mt-6 text-center">
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            onClick={() => {/* Handle compression */}}
          >
            Compress {files.length} {files.length === 1 ? 'Image' : 'Images'}
          </button>
        </div>
      )}
    </div>
  );
}

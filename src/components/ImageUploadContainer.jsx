/* eslint-disable react/prop-types */
import { useCallback, useMemo, useState, useEffect } from 'react';
import { DropZone } from './dropZone';
import { EditView } from './EditView';
import { Button } from "@/components/ui/button";

export function ImageUploadContainer() {
  const [files, setFiles] = useState([]);
  const [activeTab, setActiveTab] = useState('compress');
  const [objectUrls, setObjectUrls] = useState(new Set());

  const getImageDimensions = useCallback((file) => {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      setObjectUrls(prev => new Set(prev).add(objectUrl));

      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          preview: objectUrl
        });
      };
      img.src = objectUrl;
    });
  }, []);

  const handleFilesAccepted = useCallback((acceptedFiles) => {
    const initialFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      preview: null,
      width: 0,
      height: 0,
      status: 'loading'
    }));

    setFiles(prev => [...prev, ...initialFiles]);
    setActiveTab('edit');

    // Process each file independently without waiting for others
    initialFiles.forEach((fileObj) => {
      getImageDimensions(fileObj.file)
        .then(({ width, height, preview }) => {
          setFiles(prev => {
            const fileIndex = prev.findIndex(f => f.id === fileObj.id);
            if (fileIndex === -1) return prev;

            const newFiles = [...prev];
            newFiles[fileIndex] = {
              ...newFiles[fileIndex],
              preview,
              width,
              height,
              status: 'pending'
            };
            return newFiles;
          });
        })
        .catch(() => {
          setFiles(prev => {
            const fileIndex = prev.findIndex(f => f.id === fileObj.id);
            if (fileIndex === -1) return prev;

            const newFiles = [...prev];
            newFiles[fileIndex] = {
              ...newFiles[fileIndex],
              status: 'error',
              error: 'Failed to load image'
            };
            return newFiles;
          });
        });
    });
  }, [getImageDimensions]);

  // Cleanup object URLs when component unmounts or files change
  useEffect(() => {
    return () => {
      objectUrls.forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, [objectUrls]);

  const dropZoneProps = useMemo(() => ({
    onFileAccepted: handleFilesAccepted,
    maxFiles: 10
  }), [handleFilesAccepted]);

  return (
    <div className="container mx-auto p-6 bg-gray-100 text-gray-700" data-testid="image-upload-container">
      <h1 className="text-2xl text-center font-bold mb-6">
        Transform Your Images with Precision
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Optimize your images without compromising quality. Perfect for web
        developers, designers, and content creators.
      </p>

      {activeTab === 'compress' ? (
        <>
          <DropZone {...dropZoneProps} />
          
          <div className="flex justify-center gap-4 mt-8">
            <Button
              onClick={() => files.length > 0 && setActiveTab('edit')}
              className={`px-6 py-2 rounded-lg transition-colors ${
                files.length > 0 
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continue to Edit ({files.length})
            </Button>
          </div>
        </>
      ) : (
        <EditView 
          files={files}
          onBack={() => setActiveTab('compress')}
          setFiles={setFiles}
        />
      )}
    </div>
  );
}
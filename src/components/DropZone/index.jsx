import { useCallback, useState } from 'react';
import { fileService } from '../../features/upload/fileService';

// eslint-disable-next-line react/prop-types
export function DropZone({ onFileAccepted, maxFiles }) {
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState([]);

  const validateAndProcessFiles = useCallback((files) => {
    const validationResults = files.map(file => ({
      file,
      validation: fileService.validateFile(file)
    }));

    const newErrors = validationResults
      .filter(result => !result.validation.valid)
      .map(result => result.validation.error);

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return [];
    }

    setErrors([]);
    return validationResults
      .filter(result => result.validation.valid)
      .map(result => result.file);
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(event.dataTransfer.files);
    const validFiles = validateAndProcessFiles(droppedFiles);

    if (validFiles.length > 0) {
      onFileAccepted(validFiles);
    }
  }, [onFileAccepted, validateAndProcessFiles]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = maxFiles > 1;
    input.accept = 'image/*';
    input.onchange = (e) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);
        const validFiles = validateAndProcessFiles(files);
        if (validFiles.length > 0) {
          onFileAccepted(validFiles);
        }
      }
    };
    input.click();
  }, [onFileAccepted, validateAndProcessFiles, maxFiles]);

  return (
    <div className="relative">
      <div
        className={`
          min-h-[400px] w-full max-w-3xl mx-auto 
          border-4 border-dashed rounded-lg
          flex flex-col items-center justify-center
          transition-all duration-200
          ${isDragging ? 'border-blue-500 bg-blue-50/10' : 'border-gray-300 hover:border-gray-400'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <div className="text-center p-8">
          <div className="mb-4">
            <svg
              className={`
                w-16 h-16 mx-auto
                transition-colors duration-200
                ${isDragging ? 'text-blue-500' : 'text-gray-400'}
              `}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          <p className="text-xl text-gray-600 mb-2">
            {isDragging ? 'Drop images here' : 'Drop images here or click to select'}
          </p>
          
          <p className="text-sm text-gray-500">
            Supports PNG, JPEG, and WebP up to 30MB
          </p>

          {errors.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 rounded-md" role="alert">
              {errors.map((error, index) => (
                <p 
                  key={index}
                  className="text-sm text-red-600"
                >
                  {error}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useCallback, useState } from 'react';
import { fileService } from '../../features/upload/fileService';
import { Upload } from "lucide-react";

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
          h-64 w-full
          border-2 border-dashed 
          flex flex-col items-center justify-center cursor-pointer
          transition-all duration-200
          rounded-2xl
          ${isDragging ? 'border-primary/20 bg-primary/5' : 'border-primary/10 hover:border-primary/20'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <Upload size={48} className="text-primary/40 mb-4" />
        <p className="text-lg mb-2">Drag & drop your images here</p>
        <p className="text-sm text-primary/60 mb-4">or</p>
        <button className="button-primary">
          Choose Files
        </button>

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
  );
}

import { useFileUpload } from '@hooks/useFileUpload';

// eslint-disable-next-line react/prop-types
export function DropZone({ onFileAccepted, maxFiles }) {
  const {
    isDragging,
    errors,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    processFiles
  } = useFileUpload({ onFileAccepted, maxFiles });

  return (
    <div className="relative">
      <div
        className={`
          min-h-[400px] w-full max-w-3xl mx-auto 
          border-4 border-dashed rounded-lg
          flex flex-col items-center justify-center
          transition-all duration-200
          ${isDragging ? 
            'border-blue-500 bg-blue-50' : 
            'border-gray-300 hover:border-gray-400'
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.multiple = true;
          input.accept = 'image/*';
          input.onchange = (e) => processFiles(e.target.files);
          input.click();
        }}
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
            <div className="mt-4 p-4 bg-red-50 rounded-md">
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

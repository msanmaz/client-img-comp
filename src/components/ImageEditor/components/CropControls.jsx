/* eslint-disable react/prop-types */
export function CropControls({ onAspectChange, onSave, onCancel, selectedRatio, mode }) {
  const aspectRatios = [
    { label: 'Free', value: undefined },
    { label: 'Square (1:1)', value: 1 },
    { label: 'Portrait (3:4)', value: '3:4' },
    { label: 'Landscape (4:3)', value: '4:3' },
    { label: 'Widescreen (16:9)', value: '16:9' }
  ];

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-800 rounded-lg">
      <div className="flex items-center gap-4">
        <span className="text-gray-400 text-sm">
          {/* {mode === 'fit' ? 'Fit image to:' : 'Crop image as:'} */}
        </span>
        {/* <div className="flex flex-wrap gap-2">
          {aspectRatios.map(ratio => (
            <button
              key={ratio.label}
              onClick={() => onAspectChange(ratio.value)}
              className={`
                px-3 py-1 rounded transition-colors
                ${selectedRatio === ratio.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
                }
              `}
            >
              {ratio.label}
            </button>
          ))}
        </div> */}
      </div>
      
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
/* eslint-disable react/prop-types */
export function CropControls({ onAspectChange, onSave, onCancel }) {
  const aspectRatios = [
    { label: 'Free', value: undefined },
    { label: 'Square (1:1)', value: 1 },
    { label: 'Portrait (3:4)', value: 3/4 },
    { label: 'Landscape (4:3)', value: 4/3 },
    { label: 'Widescreen (16:9)', value: 16/9 }
  ];

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-800 rounded-lg">
      <div className="flex flex-wrap gap-2">
        {aspectRatios.map(ratio => (
          <button
            key={ratio.label}
            onClick={() => onAspectChange(ratio.value)}
            className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
          >
            {ratio.label}
          </button>
        ))}
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
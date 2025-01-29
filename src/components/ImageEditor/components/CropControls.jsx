/* eslint-disable react/prop-types */
export function CropControls({ onAspectChange, onSave, onCancel }) {
  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-800 rounded-lg">
      <div className="flex gap-2">
        <button
          onClick={() => onAspectChange(undefined)}
          className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          Free
        </button>
        <button
          onClick={() => onAspectChange(1)}
          className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          1:1
        </button>
        <button
          onClick={() => onAspectChange(16/9)}
          className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          16:9
        </button>
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
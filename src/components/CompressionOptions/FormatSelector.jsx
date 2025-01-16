/* eslint-disable react/prop-types */
const formats = [
  { id: 'avif', label: 'AVIF' },
  { id: 'jpeg', label: 'JPEG' },
  { id: 'jxl', label: 'JXL' },
  { id: 'png', label: 'PNG' },
  { id: 'webp', label: 'WEBP' }
];

export function FormatSelector({ selected, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {formats.map(format => (
        <button
          key={format.id}
          onClick={() => onChange(format.id)}
          className={`
            px-6 py-2 rounded-lg font-medium transition-all duration-200
            ${selected === format.id
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          {format.label}
        </button>
      ))}
    </div>
  );
}
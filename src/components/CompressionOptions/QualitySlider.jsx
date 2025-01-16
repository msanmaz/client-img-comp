/* eslint-disable react/prop-types */

export function QualitySlider({ value, onChange }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="font-medium text-gray-200">
          Quality
        </label>
        <span className="text-gray-500">
          {value}%
        </span>
      </div>
      
      <div className="relative h-2 mt-4 mb-4"> {/* Added vertical margin for thumb */}
        {/* Background track */}
        <div className="absolute inset-0 bg-gray-200 rounded-full" />
        
        {/* Progress bar */}
        <div 
          className="absolute inset-y-0 left-0 bg-blue-500 rounded-full"
          style={{ width: `${value}%` }}
        />
        
        {/* Thumb */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg 
                     border border-gray-200 cursor-pointer transition-transform
                     hover:scale-110 active:scale-95"
          style={{ left: `${value}%`, transform: `translate(-50%, -50%)` }}
        />
        
        {/* Range input - keep on top for interaction but invisible */}
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{
            WebkitAppearance: 'none',
            // Increase interaction area for better touch
            margin: '-8px 0',
            padding: '8px 0',
          }}
        />
      </div>
    </div>
  );
}

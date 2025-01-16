/* eslint-disable react/prop-types */
import { FormatSelector } from './FormatSelector';
import { QualitySlider } from './QualitySlider';

export function CompressionOptions({ 
  format, 
  quality, 
  onFormatChange, 
  onQualityChange 
}) {
  return (
    <div className="space-y-6 my-8">
      <div className="space-y-2">
        <h3 className="font-medium text-gray-200">
          Output Format
        </h3>
        <FormatSelector
          selected={format}
          onChange={onFormatChange}
        />
      </div>

      <QualitySlider
        value={quality}
        onChange={onQualityChange}
      />
    </div>
  );
}
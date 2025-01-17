/* eslint-disable react/prop-types */
import { memo } from 'react';
import { FormatSelector } from './FormatSelector';
import { QualitySlider } from './QualitySlider';

export const CompressionOptions = memo(function CompressionOptions({ 
  format, 
  quality, 
  onFormatChange, 
  onQualityChange 
}) {
  return (
    <div className="space-y-6 my-8">
      <FormatSelector
        selected={format}
        onChange={onFormatChange}
      />
      <QualitySlider
        value={quality}
        onChange={onQualityChange}
      />
    </div>
  );
});
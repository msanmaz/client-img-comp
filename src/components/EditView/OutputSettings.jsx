/* eslint-disable react/prop-types */
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function OutputSettings({ settings, onSettingsChange, originalDimensions }) {
  const formats = [
    { value: 'webp', label: 'WEBP' },
    { value: 'jpeg', label: 'JPEG' },
    { value: 'png', label: 'PNG' },
    { value: 'avif', label: 'AVIF' },
    { value: 'jxl', label: 'JXL' }
  ];

  const aspectRatios = [
    { value: '1024x768', label: 'Blog Image v2 (1024x768)' },
    { value: '1920x1080', label: 'Background Image (1920x1080)' },
    { value: '1280x720', label: 'Hero Image (1280x720)' },
    { value: '250x250', label: 'Website Banner (250x250)' },
    { value: '1:1', label: 'Square (1:1)' },
    { value: '16:9', label: 'Widescreen (16:9)' },
    { value: '4:3', label: 'Standard (4:3)' },
  ];

  const calculateDimensions = (ratio, baseWidth = originalDimensions.width) => {
    let width, height;
    
    if (ratio.includes('x')) {
      [width, height] = ratio.split('x').map(Number);
    } else {
      const [w, h] = ratio.split(':').map(Number);
      const aspectRatio = w / h;
      width = baseWidth;
      height = Math.round(width / aspectRatio);
    }

    return { width, height };
  };

  const handleSettingsChange = (type, value) => {
    if (type === 'aspectRatio') {
      const { width, height } = calculateDimensions(value);
      onSettingsChange(prev => ({
        ...prev,
        aspectRatio: value,
        width,
        height
      }));
    } else {
      const newValue = parseInt(value);
      if (isNaN(newValue) || newValue <= 0) return;

      const aspectRatio = type === 'width' 
        ? newValue / settings.height 
        : settings.width / newValue;

      const newDimensions = type === 'width'
        ? { width: newValue, height: Math.round(newValue / aspectRatio) }
        : { width: Math.round(newValue * aspectRatio), height: newValue };

      onSettingsChange(prev => ({
        ...prev,
        ...newDimensions,
        aspectRatio: `${newDimensions.width}x${newDimensions.height}`
      }));
    }
  };

  return (
    <div className="my-6">
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="p-1.5 bg-gray-100 rounded text-lg">⚙️</span>
          <h2 className="text-lg font-medium">Output Settings</h2>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">
          Original dimensions: {originalDimensions.width.toLocaleString()} × {originalDimensions.height.toLocaleString()} px
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Output Format</Label>
            <Select 
              value={settings.outputFormat}
              onValueChange={(value) => onSettingsChange(prev => ({ ...prev, outputFormat: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                {formats.map(format => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Aspect Ratio</Label>
            <Select 
              value={settings.aspectRatio}
              onValueChange={(value) => handleSettingsChange('aspectRatio', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select aspect ratio" />
              </SelectTrigger>
              <SelectContent>
                {aspectRatios.map(ratio => (
                  <SelectItem key={ratio.value} value={ratio.value}>
                    {ratio.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <Label>Output Dimensions (pixels)</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSettingsChange(prev => ({
                  ...prev,
                  width: originalDimensions.width,
                  height: originalDimensions.height,
                  aspectRatio: `${originalDimensions.width}x${originalDimensions.height}`
                }))}
                className="text-blue-600 hover:text-blue-700"
              >
                Reset to Original
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                value={settings.width}
                onChange={e => handleSettingsChange('width', e.target.value)}
                min="1"
                placeholder="Width"
              />
              <Input
                type="number"
                value={settings.height}
                onChange={e => handleSettingsChange('height', e.target.value)}
                min="1"
                placeholder="Height"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}
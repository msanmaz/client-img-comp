/* eslint-disable react/prop-types */
import { formatFileSize, generateDownloadFilename } from '../../utils/fileUtils';
import { useState } from 'react';
import { PreviewContainer } from './PreviewContainer';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DownloadCloud, RefreshCw } from 'lucide-react';

export function ImageGrid({ files, onImageUpdate, previewDimensions, onCancel, settings }) {
  const [imageNames, setImageNames] = useState({});
  const [altTexts, setAltTexts] = useState({});

  const calculateReduction = (originalSize, processedSize) => {
    if (!processedSize) return null;
    const reduction = ((originalSize - processedSize) / originalSize) * 100;
    const difference = originalSize - processedSize;
    return {
      percentage: Math.round(reduction),
      difference
    };
  };

  const handleDownload = (file) => {
    if (!file.blob || file.status !== 'complete') return;
    const downloadUrl = URL.createObjectURL(file.blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    const customName = imageNames[file.id];
    const fileName = customName 
      ? `${customName}.${settings.outputFormat}`
      : generateDownloadFilename(file.name, settings.outputFormat);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {files.map(file => (
        <Card key={file.id} className="overflow-hidden">
          <CardContent className="p-4 space-y-4">
            {/* Image Preview Wrapper */}
            <div className="relative w-full rounded-lg overflow-hidden">
              {/* Preview Container */}
              <PreviewContainer
                file={file}
                previewDimensions={previewDimensions}
                settings={settings}
              />

              {/* Processing Overlay */}
              {file.status === 'processing' && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mb-2" />
                  <div className="text-white text-xs">Processing...</div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onCancel(file.id)}
                    className="mt-3"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            {/* File Information */}
            {file.status === 'complete' && (
              <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg text-sm">
                <div>
                  <div className="font-medium text-gray-900">Original</div>
                  <div className="text-gray-600">{formatFileSize(file.file.size)}</div>
                  <div className="text-gray-500">
                    {file.width.toLocaleString()} × {file.height.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Processed</div>
                  <div className="text-gray-600">{formatFileSize(file.compressedSize || 0)}</div>
                  <div className="text-gray-500">
                    {settings.width.toLocaleString()} × {settings.height.toLocaleString()}
                  </div>
                </div>
                {file.compressedSize && (
                  <div className="col-span-2 text-green-600 text-sm font-medium">
                    {calculateReduction(file.file.size, file.compressedSize).percentage}% smaller
                    ({formatFileSize(calculateReduction(file.file.size, file.compressedSize).difference)} saved)
                  </div>
                )}
              </div>
            )}

            {/* Image Details */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor={`name-${file.id}`}>Image Name</Label>
                <Input
                  id={`name-${file.id}`}
                  value={imageNames[file.id] || ''}
                  onChange={(e) => setImageNames(prev => ({
                    ...prev,
                    [file.id]: e.target.value
                  }))}
                  placeholder="Enter image name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`alt-${file.id}`}>Alt Text</Label>
                <Input
                  id={`alt-${file.id}`}
                  value={altTexts[file.id] || ''}
                  onChange={(e) => setAltTexts(prev => ({
                    ...prev,
                    [file.id]: e.target.value
                  }))}
                  placeholder="Describe the image"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              {file.status === 'complete' ? (
                <>
                  <Button
                    onClick={() => handleDownload(file)}
                    className="w-full gap-2"
                  >
                    <DownloadCloud className="h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => onImageUpdate([file])}
                    className="w-full gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reprocess
                  </Button>
                </>
              ) : (
                <Button
                  variant={file.status === 'processing' ? 'ghost' : 'default'}
                  disabled={file.status === 'processing'}
                  className="w-full gap-2"
                  onClick={() => onImageUpdate([file])}
                >
                  {file.status === 'processing' ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : file.status === 'cancelled' ? (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Retry Processing
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Process Image
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
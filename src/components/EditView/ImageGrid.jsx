/* eslint-disable react/prop-types */
import { formatFileSize, generateDownloadFilename } from '../../utils/fileUtils';
import { useCallback, useState } from 'react';
import { PreviewContainer } from './PreviewContainer';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DownloadCloud, PencilIcon, RefreshCw } from 'lucide-react';
import { ImageEditor } from '../ImageEditor';

export function ImageGrid({ files, onImageUpdate, onCropComplete, previewDimensions, onCancel, settings }) {
  const [imageNames, setImageNames] = useState({});
  const [altTexts, setAltTexts] = useState({});
  const [editingFile, setEditingFile] = useState(null);

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

  const handleEditComplete = useCallback((editedFile) => {
    onCropComplete(editedFile);
    setEditingFile(null);
  }, [onCropComplete]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {editingFile && (
        <ImageEditor
          image={editingFile}
          onSave={handleEditComplete}
          onCancel={() => setEditingFile(null)}
        />
      )}

      {files.map(file => (
        <Card key={file.id} className="overflow-hidden">
          <CardContent className="p-0">
            {/* Image Preview Wrapper */}
            <div className="relative w-full rounded-t-lg">
              <PreviewContainer
                file={file}
                previewDimensions={previewDimensions}
                settings={settings}
              />

              {/* Processing Overlay */}
              {file.status === 'processing' && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-3 border-white border-t-transparent mb-3" />
                  <div className="text-white text-sm font-medium">Processing...</div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onCancel(file.id)}
                    className="mt-4"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <div className="p-6 space-y-6">
              {/* File Information */}
              {file.status === 'complete' && (
                <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl text-sm">
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
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`name-${file.id}`} className="text-sm font-medium">
                    Image Name
                  </Label>
                  <Input
                    id={`name-${file.id}`}
                    value={imageNames[file.id] || ''}
                    onChange={(e) => setImageNames(prev => ({
                      ...prev,
                      [file.id]: e.target.value
                    }))}
                    placeholder="Enter image name"
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`alt-${file.id}`} className="text-sm font-medium">
                    Alt Text
                  </Label>
                  <Input
                    id={`alt-${file.id}`}
                    value={altTexts[file.id] || ''}
                    onChange={(e) => setAltTexts(prev => ({
                      ...prev,
                      [file.id]: e.target.value
                    }))}
                    placeholder="Describe the image"
                    className="h-10"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-2">
                {(file.status != 'complete') && (
                  <>
                    <Button
                      disabled={file.status === 'processing'}
                      variant="outline"
                      onClick={() => setEditingFile(file)}
                      className="w-full h-11 gap-2 bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                      aria-label={`Edit image ${file.name}`}
                    >
                      <PencilIcon className="h-4 w-4" />
                      {file.isEdited ? 'Edit Again' : 'Edit Image'}
                    </Button>
                    <Button
                      onClick={() => onImageUpdate([file])}
                      className="w-full h-11 gap-2 text-white"
                      disabled={file.status === 'processing'}
                    >
                      {file.status === 'processing' ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <DownloadCloud className="h-4 w-4" />
                          Process Image
                        </>
                      )}
                    </Button>
                  </>
                )}

                {file.status === 'complete' && (
                  <>
                    <Button 
                      onClick={() => handleDownload(file)}
                      className="w-full h-11 gap-2 text-white"
                    >
                      <DownloadCloud className="h-4 w-4" />
                      Download
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => onImageUpdate([file])}
                      className="w-full h-11 gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Reprocess
                    </Button>
                  </>
                )}
              </div>

              {/* Edited Badge */}
              {file.isEdited && file.status === 'pending' && (
                <div className="text-xs text-blue-600 flex items-center gap-1.5 mt-2">
                  <PencilIcon className="h-3.5 w-3.5" />
                  Image edited
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
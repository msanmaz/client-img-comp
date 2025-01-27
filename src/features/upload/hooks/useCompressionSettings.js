import { useCallback, useState } from "react";

export function useCompressionSettings() {
    const [settings, setSettings] = useState({
      format: 'webp',  // Default format
      quality: 75      // Default quality
    });
  
    const handleFormatChange = useCallback((format) => {
      // Ensure quality is appropriate for the format
      setSettings(prev => ({ 
        ...prev, 
        format,
        // PNG doesn't use quality setting
        quality: format === 'png' ? 100 : prev.quality
      }));
    }, []);
  
    const handleQualityChange = useCallback((quality) => {
      setSettings(prev => ({ 
        ...prev, 
        quality: prev.format === 'png' ? 100 : quality 
      }));
    }, []);
  
    return {
      settings,
      handleFormatChange,
      handleQualityChange
    };
}
  
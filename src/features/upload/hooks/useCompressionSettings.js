import { useCallback, useState } from "react";

export function useCompressionSettings() {
    const [settings, setSettings] = useState({
      format: 'webp',
      quality: 75
    });
  
    const handleFormatChange = useCallback((format) => {
      setSettings(prev => ({ ...prev, format }));
    }, []);
  
    const handleQualityChange = useCallback((quality) => {
      setSettings(prev => ({ ...prev, quality }));
    }, []);
  
    return {
      settings,
      handleFormatChange,
      handleQualityChange
    };
  }
  
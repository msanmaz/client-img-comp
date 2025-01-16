export const fileService = {
    validateFile(file) {
      const MAX_SIZE = 30 * 1024 * 1024; // 30MB
      const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  
      if (!ALLOWED_TYPES.includes(file.type)) {
        return {
          valid: false,
          error: `File type ${file.type} is not supported`
        };
      }
  
      if (file.size > MAX_SIZE) {
        return {
          valid: false,
          error: `File size must be less than 30MB`
        };
      }
  
      return { valid: true };
    },
  
    async createPreview(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        
        reader.readAsDataURL(file);
      });
    },
  
    async processFile(file) {
      const validation = this.validateFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
  
      const preview = await this.createPreview(file);
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview,
        name: file.name,
        size: file.size,
        type: file.type
      };
    }
  };
  
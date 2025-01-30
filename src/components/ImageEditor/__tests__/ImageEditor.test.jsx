import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ImageEditor } from '../index';
import { useImageCrop } from '../hooks/useImageCrop';

// Mock the hook at module level
vi.mock('../hooks/useImageCrop', () => ({
  useImageCrop: vi.fn()
}));

describe('ImageEditor', () => {
  const mockImage = {
    id: '1',
    name: 'test.jpg',
    preview: 'data:image/jpeg;base64,test',
    width: 1920,
    height: 1080,
    status: 'complete'
  };

  const defaultProps = {
    image: mockImage,
    onSave: vi.fn(),
    onCancel: vi.fn()
  };

  // Default hook implementation
  const defaultHookImplementation = {
    crop: null,
    setCrop: vi.fn(),
    completedCrop: {
      width: 800,
      height: 600,
      x: 100,
      y: 100,
      unit: 'px'
    },
    aspect: undefined,
    setAspect: vi.fn(),
    handleCropComplete: vi.fn(),
    generateCroppedImage: vi.fn().mockResolvedValue({
      blob: new Blob(['test'], { type: 'image/jpeg' }),
      url: 'blob:test',
      width: 800,
      height: 600
    })
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset hook to default implementation
    useImageCrop.mockImplementation(() => defaultHookImplementation);
  });

  it('renders editor with image and controls', () => {
    render(<ImageEditor {...defaultProps} />);
    
    expect(screen.getByTestId('image-editor-modal')).toBeInTheDocument();
    expect(screen.getByText('Edit Image')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', mockImage.preview);
  });

  it('saves cropped image successfully', async () => {
    render(<ImageEditor {...defaultProps} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Save Changes'));
    });

    await waitFor(() => {
      expect(defaultProps.onSave).toHaveBeenCalledWith(expect.objectContaining({
        id: mockImage.id,
        preview: 'blob:test',
        blob: expect.any(Blob),
        width: 800,
        height: 600
      }));
    });
  });

  it('does not save when no crop is completed', async () => {
    // Override hook implementation for this test
    useImageCrop.mockImplementation(() => ({
      ...defaultHookImplementation,
      completedCrop: null
    }));

    render(<ImageEditor {...defaultProps} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Save Changes'));
    });

    expect(defaultProps.onSave).not.toHaveBeenCalled();
  });

  it('handles crop generation error gracefully', async () => {
    // Override hook implementation for this test
    useImageCrop.mockImplementation(() => ({
      ...defaultHookImplementation,
      generateCroppedImage: vi.fn().mockRejectedValue(new Error('Crop failed'))
    }));

    render(<ImageEditor {...defaultProps} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Save Changes'));
    });

    expect(defaultProps.onSave).not.toHaveBeenCalled();
  });

  it('handles aspect ratio changes', async () => {
    const setAspect = vi.fn();
    useImageCrop.mockImplementation(() => ({
      ...defaultHookImplementation,
      setAspect
    }));

    render(<ImageEditor {...defaultProps} />);
    
    await act(async () => {
      fireEvent.click(screen.getByText('Square (1:1)'));
    });

    expect(setAspect).toHaveBeenCalledWith(1);
  });

  it('calls onCancel when cancel button clicked', async () => {
    render(<ImageEditor {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });
});
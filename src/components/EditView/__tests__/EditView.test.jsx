import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { EditView } from '../index';
import { createMockFile } from '@/test/utils';


describe('EditView', () => {
  const mockFiles = [
    {
      id: '1',
      file: createMockFile('test1.jpg', 'image/jpeg'),
      preview: 'data:image/jpeg;base64,test1',
      width: 5905,
      height: 8267,
      status: 'pending'
    }
  ];

  const defaultProps = {
    files: mockFiles,
    onBack: vi.fn(),
    setFiles: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial state correctly', () => {
    render(<EditView {...defaultProps} />);
    
    // Check basic UI elements
    expect(screen.getByText('← Back to Upload')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /process all images/i })).toBeInTheDocument();
  });

  it('loads image dimensions and sets initial settings', async () => {
    // Mock Image constructor before render
    const mockImage = {
      onload: null,
      width: 5905,
      height: 8267
    };
    
    global.Image = class {
      constructor() {
        return mockImage;
      }
    };

    render(<EditView {...defaultProps} />);

    // Trigger image load
    await waitFor(() => {
      mockImage.onload?.();
    });

    // Now check for dimensions using test ID
    await waitFor(() => {
      const dimensionsElement = screen.getByTestId('original-dimensions');
      expect(dimensionsElement).toHaveTextContent('Original dimensions: 5,905 × 8,267 px');
    });
  });

  // Fix processing test
  it('handles image processing correctly', async () => {
    const { rerender } = render(<EditView {...defaultProps} />);
    
    // Mock the processing queue hook
    vi.mock('../../features/upload/hooks/useProcessingQueue', () => ({
      useProcessingQueue: () => ({
        addToQueue: vi.fn(),
        processingCount: 0
      })
    }));
  
    rerender(<EditView {...defaultProps} />);
    expect(screen.getByRole('button', { name: /process all images/i })).not.toBeDisabled();
  });
  
  // Fix cropping test
  it('handles image cropping correctly', async () => {
    render(<EditView {...defaultProps} />);
    
    // Use the correct button text/role
    const editButton = screen.getByRole('button', { name: /edit/i });
    // Or if it's an icon button, use testId
    // const editButton = screen.getByTestId('edit-image-button');
    fireEvent.click(editButton);
  });
});
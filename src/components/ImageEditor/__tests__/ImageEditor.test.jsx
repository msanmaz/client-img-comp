import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageEditor } from '../index';

describe('ImageEditor', () => {
  const mockImage = {
    id: '1',
    name: 'test.jpg',
    preview: 'data:image/jpeg;base64,test',
    status: 'complete'
  };

  const defaultProps = {
    image: mockImage,
    onSave: vi.fn(),
    onCancel: vi.fn()
  };

  it('renders editor with image', () => {
    render(<ImageEditor {...defaultProps} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('handles aspect ratio changes', () => {
    render(<ImageEditor {...defaultProps} />);
    fireEvent.click(screen.getByText('1:1'));
    // Add assertions for aspect ratio change
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<ImageEditor {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });
});
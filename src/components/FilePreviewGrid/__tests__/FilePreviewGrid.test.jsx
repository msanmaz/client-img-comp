import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FilePreviewGrid } from '../../filePreviewGrid'
import { formatFileSize } from '../../../utils/fileUtils'

describe('FilePreviewGrid', () => {
  const mockFiles = [
    {
      id: '1',
      name: 'test1.jpg',
      size: 1024,
      preview: 'data:image/jpeg;base64,test1',
      status: 'complete',
      compressedSize: 512
    },
    {
      id: '2',
      name: 'test2.jpg',
      size: 2048,
      preview: 'data:image/jpeg;base64,test2',
      status: 'processing'
    }
  ]

  const defaultProps = {
    files: mockFiles,
    onRemove: vi.fn(),
    onCancel: vi.fn(),
    processingCount: 1
  }

  it('renders file previews', () => {
    render(<FilePreviewGrid {...defaultProps} />)
    expect(screen.getByText('test1.jpg')).toBeInTheDocument()
    expect(screen.getByText('test2.jpg')).toBeInTheDocument()
  })

  it('shows compression status for completed files', () => {
    render(<FilePreviewGrid {...defaultProps} />)
    expect(screen.getByText(/50\.0% smaller/)).toBeInTheDocument()
    const sizeText = `${formatFileSize(1024)} → ${formatFileSize(512)}`
    expect(screen.getByText(sizeText)).toBeInTheDocument()
  })

  it('shows processing status for files being processed', () => {
    render(<FilePreviewGrid {...defaultProps} />)
    expect(screen.getByText('Compressing...')).toBeInTheDocument()
  })

  it('calls onRemove when remove button is clicked', () => {
    render(<FilePreviewGrid {...defaultProps} />)
    const removeButtons = screen.getAllByRole('button', { name: /remove/i })
    removeButtons[0].click()
    expect(defaultProps.onRemove).toHaveBeenCalledWith(mockFiles[0].id)
  })

  it('calls onCancel when cancel button is clicked for processing file', () => {
    render(<FilePreviewGrid {...defaultProps} />)
    const cancelButton = screen.getAllByRole('button', { name: /cancel/i })[0]
    cancelButton.click()
    expect(defaultProps.onCancel).toHaveBeenCalledWith(mockFiles[1].id)
  })

  it('displays correct file sizes', () => {
    render(<FilePreviewGrid {...defaultProps} />)
    const originalSize = formatFileSize(mockFiles[0].size)
    const compressedSize = formatFileSize(mockFiles[0].compressedSize)
    expect(screen.getByText(new RegExp(`${originalSize}.+${compressedSize}`))).toBeInTheDocument()
  })
}) 
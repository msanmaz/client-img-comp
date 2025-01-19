import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DropZone } from '../../dropZone'
import { createMockFile, createDataTransfer } from '../../../test/utils'

describe('DropZone', () => {
  const defaultProps = {
    onFileAccepted: vi.fn(),
    maxFiles: 10
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders upload area', () => {
    render(<DropZone {...defaultProps} />)
    expect(screen.getByText(/drop images here or click to select/i)).toBeInTheDocument()
  })

  it('handles file drop', async () => {
    render(<DropZone {...defaultProps} />)
    const dropzone = screen.getByText(/drop images here/i).parentElement.parentElement
    const file = createMockFile('test.jpg', 'image/jpeg', 1024)
    const dataTransfer = createDataTransfer([file])

    fireEvent.dragOver(dropzone)
    fireEvent.drop(dropzone, { dataTransfer })

    expect(defaultProps.onFileAccepted).toHaveBeenCalledWith([file])
  })

  it('validates file type', async () => {
    render(<DropZone {...defaultProps} />)
    const dropzone = screen.getByText(/drop images here/i).parentElement.parentElement
    const invalidFile = createMockFile('test.txt', 'text/plain', 1024)
    const dataTransfer = createDataTransfer([invalidFile])

    fireEvent.dragOver(dropzone)
    fireEvent.drop(dropzone, { dataTransfer })

    expect(screen.getByText(/file type text\/plain is not supported/i)).toBeInTheDocument()
  })

  it('validates file size', async () => {
    render(<DropZone {...defaultProps} />)
    const dropzone = screen.getByText(/drop images here/i).parentElement.parentElement
    const largeFile = createMockFile('large.jpg', 'image/jpeg', 31 * 1024 * 1024) // 31MB
    const dataTransfer = createDataTransfer([largeFile])

    fireEvent.dragOver(dropzone)
    fireEvent.drop(dropzone, { dataTransfer })

    await waitFor(() => {
      const errorElement = screen.getByRole('alert')
      expect(errorElement).toBeInTheDocument()
      expect(errorElement).toHaveTextContent('File size must be less than 30MB')
    }, { timeout: 1000 })
  })
}) 
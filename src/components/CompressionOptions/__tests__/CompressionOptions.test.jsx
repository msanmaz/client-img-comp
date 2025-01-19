import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CompressionOptions } from '../index'

describe('CompressionOptions', () => {
  const defaultProps = {
    format: 'webp',
    quality: 75,
    onFormatChange: vi.fn(),
    onQualityChange: vi.fn(),
  }

  it('renders with default props', () => {
    render(<CompressionOptions {...defaultProps} />)
    expect(screen.getByText('Quality')).toBeInTheDocument()
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('calls onFormatChange when format is changed', () => {
    render(<CompressionOptions {...defaultProps} />)
    fireEvent.click(screen.getByText('JPEG'))
    expect(defaultProps.onFormatChange).toHaveBeenCalledWith('jpeg')
  })

  it('calls onQualityChange when quality slider is moved', () => {
    render(<CompressionOptions {...defaultProps} />)
    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: 50 } })
    expect(defaultProps.onQualityChange).toHaveBeenCalledWith(50)
  })
}) 
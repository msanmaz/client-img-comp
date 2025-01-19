import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ImageUploadPage } from '../ImageUploadPage'

describe('ImageUploadPage', () => {
  it('renders with correct container classes', () => {
    render(<ImageUploadPage />)
    const container = screen.getByTestId('image-upload-page')
    expect(container).toHaveClass('container')
    expect(container).toHaveClass('mx-auto')
    expect(container).toHaveClass('p-6')
  })

  it('renders ImageUploadContainer component', () => {
    render(<ImageUploadPage />)
    // Add a test ID to ImageUploadContainer and test for its presence
    expect(screen.getByTestId('image-upload-container')).toBeInTheDocument()
  })
}) 
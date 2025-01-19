import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../test/utils'
import Home from '../Home'

describe('Home Component', () => {
  it('renders without crashing', () => {
    renderWithRouter(<Home />)
    expect(document.querySelector('.min-h-screen')).toBeInTheDocument()
  })

  it('renders with correct background and layout classes', () => {
    renderWithRouter(<Home />)
    const container = document.querySelector('.min-h-screen')
    expect(container).toHaveClass('bg-black')
    expect(container).toHaveClass('flex')
    expect(container).toHaveClass('items-center')
    expect(container).toHaveClass('justify-center')
  })

  it('renders ImageUploadPage component', () => {
    renderWithRouter(<Home />)
    // Since ImageUploadPage renders a container with specific classes
    expect(screen.getByTestId('image-upload-page')).toBeInTheDocument()
  })
}) 
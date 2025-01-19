import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'

export function renderWithRouter(ui, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route)

  return {
    user: userEvent.setup(),
    ...render(ui, {
      wrapper: ({ children }) => (
        <BrowserRouter>{children}</BrowserRouter>
      ),
    }),
  }
}

export const createMockFile = (name = 'test.jpg', type = 'image/jpeg', size = 1024) => {
  return new File(['mock content'], name, { type })
}

export const createDataTransfer = (files) => {
  return {
    files,
    items: files.map(file => ({
      kind: 'file',
      type: file.type,
      getAsFile: () => file
    })),
    types: ['Files']
  }
}

// Helper to mock FileReader
export const mockFileReader = () => {
  const mock = {
    readAsDataURL: vi.fn(),
    onload: null,
    result: 'data:image/jpeg;base64,mock'
  }

  window.FileReader = vi.fn(() => mock)

  window.FileReader.prototype.readAsDataURL = function(file) {
    setTimeout(() => {
      this.result = 'data:image/jpeg;base64,mock'
      this.onload && this.onload()
    }, 0)
  }

  return mock
} 
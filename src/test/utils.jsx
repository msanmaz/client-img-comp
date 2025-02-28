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
  const blob = new Blob(['mock content'], { type });
  const file = new File([blob], name, { type });
  
  // Add custom properties needed for testing
  Object.defineProperty(file, 'size', { value: size });
  Object.defineProperty(file, 'preview', {
    value: 'data:image/jpeg;base64,mockpreview',
    writable: true
  });

  return file;
}

export const createDataTransfer = (files) => {
  return {
    files,
    items: files.map(file => ({
      kind: 'file',
      type: file.type,
      getAsFile: () => file
    })),
    types: ['Files'],
    getData: () => '',
    setData: vi.fn(),
    clearData: vi.fn(),
    setDragImage: vi.fn()
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
      // Create a mock base64 string that includes file information
      this.result = `data:${file.type};base64,${btoa(`mock-content-for-${file.name}-${file.size}`)}`;
      this.onload && this.onload();
    }, 0);
  }

  return mock
}
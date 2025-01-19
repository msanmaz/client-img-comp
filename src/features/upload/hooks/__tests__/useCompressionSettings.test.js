import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCompressionSettings } from '../useCompressionSettings'

describe('useCompressionSettings', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useCompressionSettings())
    expect(result.current.settings).toEqual({
      format: 'webp',
      quality: 75
    })
  })

  it('updates format', () => {
    const { result } = renderHook(() => useCompressionSettings())
    act(() => {
      result.current.handleFormatChange('jpeg')
    })
    expect(result.current.settings.format).toBe('jpeg')
  })

  it('updates quality', () => {
    const { result } = renderHook(() => useCompressionSettings())
    act(() => {
      result.current.handleQualityChange(50)
    })
    expect(result.current.settings.quality).toBe(50)
  })
}) 
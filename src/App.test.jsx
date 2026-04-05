import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { beforeEach, test, expect, vi } from 'vitest'
import App from './App'

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({
      ok: true,
      json: async () => []
    }))
  )
})
 
test('renders app title', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
 
  expect(screen.getAllByText('AI提示词助手').length).toBeGreaterThan(0)
})

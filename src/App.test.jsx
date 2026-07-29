import React from 'react'
import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, test, expect, vi } from 'vitest'
import App from './App'

const getReactActWarnings = (...spies) => spies
  .flatMap(spy => spy.mock.calls)
  .filter(args => args.some(arg => String(arg).includes('act(...)')))

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({
      ok: true,
      json: async () => []
    }))
  )
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
 
test('renders app title without React act warnings', async () => {
  const consoleError = vi.spyOn(console, 'error')
  const consoleWarn = vi.spyOn(console, 'warn')

  render(<App />)
 
  expect(screen.getAllByText('AI提示词助手').length).toBeGreaterThan(0)
  expect(await screen.findByRole('heading', { name: '提示词库' })).toBeInTheDocument()

  expect(getReactActWarnings(consoleError, consoleWarn)).toEqual([])
})

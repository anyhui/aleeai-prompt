import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import PromptGenerator from './PromptGenerator'

const presets = {
  templates: {
    basic: {
      name: '基础模板',
      description: '本地模板',
      fields: [{ id: 'task', label: '任务', required: true }]
    }
  },
  categories: [{ id: 'general', name: '通用', icon: 'G', extraFields: [] }]
}

const outputTemplates = {
  templates: {
    basic: { template: '行业：{industry}\n任务：{task}' }
  }
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async url => new Response(
    JSON.stringify(url.includes('output_templates') ? outputTemplates : presets),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )))
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: vi.fn().mockResolvedValue(undefined) }
  })
})

afterEach(() => vi.unstubAllGlobals())

test('generates, edits, and copies a prompt entirely locally', async () => {
  render(<PromptGenerator />)

  const task = await screen.findByLabelText(/任务/)
  fireEvent.change(task, { target: { value: '编写发布说明' } })
  fireEvent.click(screen.getByRole('button', { name: '生成提示词' }))

  const output = screen.getByPlaceholderText(/点击生成按钮/)
  expect(output).toHaveValue('行业：通用\n\n任务：编写发布说明')
  fireEvent.change(output, { target: { value: '已编辑的本地提示词' } })
  fireEvent.click(screen.getByRole('button', { name: '复制提示词' }))

  await waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalledWith('已编辑的本地提示词'))
  expect(fetch).toHaveBeenCalledTimes(2)
})

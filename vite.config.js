import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
 
export default defineConfig({
  plugins: [react()],
  logLevel: 'error',
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (
          warning?.code === 'MODULE_LEVEL_DIRECTIVE' &&
          typeof warning?.message === 'string' &&
          warning.message.includes('"use client"')
        ) {
          return
        }
        warn(warning)
      }
    }
  }
})

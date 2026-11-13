import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { aiPlugin } from './ai-server'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '') // klíč jen na serveru (bez prefixu VITE_ → nejde do prohlížeče)
  return { base: './', plugins: [react(), tailwindcss(), aiPlugin(env)], server: { port: 5173 } }
})

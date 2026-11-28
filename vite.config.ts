import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// In development, /api calls are forwarded to the Goalings API (see /server).
export default defineConfig({ plugins: [react()], server: { proxy: { '/api': 'http://localhost:4000' } }, preview: { proxy: { '/api': 'http://localhost:4000' } } })

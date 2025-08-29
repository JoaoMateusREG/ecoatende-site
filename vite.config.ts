import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 6287,
    host: '0.0.0.0',
  },
  preview: {
    allowedHosts: ['site.atende.eco.br', 'www.site.atende.eco.br'],
    port: 6287,
    host: '0.0.0.0',
  },
})


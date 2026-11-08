import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig(({ command }) => {
  // Garante build de produção mesmo com NODE_ENV=development no shell
  // (gerava bundles de dev em produção: jsxDEV, PROD=false).
  if (command === 'build') process.env.NODE_ENV = 'production'

  return {
  plugins: [react(), tailwindcss()],
  server: {
    port: 5175,
    proxy: {
      '/api': 'http://localhost:5200',
    },
  },
  }
})

import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
// import eslintPlugin from 'vite-plugin-eslint';

export default defineConfig({
  plugins: [
    react(),
    // eslintPlugin()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

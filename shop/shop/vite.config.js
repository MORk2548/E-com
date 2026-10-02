import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  // host: true lets the dev server be reached from outside the container.
  // usePolling makes hot reload work with bind mounts on Windows/macOS.
  server: { host: true, port: 5173, watch: { usePolling: true } },
  preview: { host: true, port: 4173 },
  build: { rollupOptions: { output: { manualChunks: { react: ['react', 'react-dom', 'react-router-dom'], supabase: ['@supabase/supabase-js'] } } } },
})

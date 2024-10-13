import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  assetsInclude: ['**/*.docx'],
  plugins: [react()],
  server: {
    proxy: {
      '/identity': 'http://localhost:8080'
    }
  }
});
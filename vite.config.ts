import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env vars from root directory - Vite automatically loads .env.local
  const env = loadEnv(mode, process.cwd(), '');
  console.log('VITE_GEMINI_API_KEY loaded:', env.VITE_GEMINI_API_KEY ? 'FOUND' : 'NOT FOUND');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/storage': {
          target: 'https://aistudio.ranksol.net',
          changeOrigin: true
        }
      }
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});

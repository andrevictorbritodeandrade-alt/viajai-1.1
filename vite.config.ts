import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0'
    },
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.REACT_APP_GEMINI_API_KEY || env.GEMINI_API_KEY || ""),
      'process.env.NODE_ENV': JSON.stringify(mode)
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    },
    optimizeDeps: {
      include: ['@google/genai']
    }
  };
});
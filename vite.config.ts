
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 使用相對路徑，避免 GitHub Pages 子目錄導致的 404 白畫面
  base: './',
  define: {
    // 僅保留 Gemini API_KEY 透過環境變數注入（建議保留在 Secret 中以維護安全性與額度控制）
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'recharts'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
        },
      },
    },
  },
});

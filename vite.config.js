import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import history from 'connect-history-api-fallback';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    // 使用 configureServer 註冊中介軟體
    configureServer(server) {
      server.middlewares.use(history({
        rewrites: [
          { from: /.*/, to: '/index.html' },
        ],
      }));
    },
  },
})

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '17e9-162-19-19-229.ngrok-free.app',
      '.ngrok-free.app'  // Разрешаем все поддомены ngrok
    ]
  }
})

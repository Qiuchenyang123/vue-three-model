import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base: './', // 改为相对路径，以便可以在任何目录下作为 iframe 嵌入
  build: {
    outDir: '../damien-wang/3d-desk', // 直接打包输出到目标项目的目录
    emptyOutDir: true // 打包前清空目标目录
  },
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})

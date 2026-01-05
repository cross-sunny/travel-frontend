import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // 需导入path模块

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 关键：把@映射到项目根目录下的src文件夹
      '@': path.resolve(__dirname, './src')
    }
  }
})
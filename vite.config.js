import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { hash } from './src/utils/Hash.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `[name]` + hash + `.js`,
        chunkFileNames: `[name]` + hash + `.js`,
        assetFileNames: `[name]` + hash + `.[ext]`
      }
    }
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
    },
  },
  optimizeDeps: {
    entries: [],
  }
})

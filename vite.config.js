import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import mkcert from 'vite-plugin-mkcert';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  base: '/paad-grafos-v2/',
  plugins: [
    vue(),
    mkcert()
  ],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    },
  },
  build: {
    minify: false
  },
  server: { https: true },
})

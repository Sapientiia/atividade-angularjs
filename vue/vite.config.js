import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,        // escuta em 0.0.0.0: necessário para o encaminhamento de porta do Codespaces
    port: 5173,
    strictPort: true   // falha em vez de trocar de porta, para não fugir do forwardPorts
  },
  test: {
    environment: 'jsdom',
    include: ['testes/**/*.test.js']
  }
});

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./testes/setup.js'],
    include: ['testes/**/*.test.js']   // não deixa a raiz executar os testes de vue/
  }
});

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173/', // Altere para o número da porta correta
    setupNodeEvents(on, config) {
      // Configurações adicionais de eventos, se necessário
    },
  },
});

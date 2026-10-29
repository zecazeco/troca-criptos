import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // o github pages publica o site em /troca-criptos/
  base: '/troca-criptos/',
  plugins: [react()],
});

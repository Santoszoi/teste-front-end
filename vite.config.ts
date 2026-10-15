import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const sourceUrl = 'https://app.econverse.com.br/teste-front-end/junior/tecnologia/lista-produtos/produtos.json';

// Include the official catalog in static builds, without relying on CORS or a running proxy.
function bundleCatalog(): Plugin {
  return {
    name: 'bundle-econverse-catalog',
    apply: 'build',
    async closeBundle() {
      const response = await fetch(sourceUrl, { signal: AbortSignal.timeout(20000) });
      if (!response.ok) throw new Error(`Falha ao obter catálogo da Econverse (HTTP ${response.status})`);
      const catalog = await response.json();
      if (!catalog || typeof catalog !== 'object') throw new Error('Catálogo da Econverse inválido');
      const directory = resolve('dist/api');
      await mkdir(directory, { recursive: true });
      await writeFile(resolve(directory, 'produtos'), JSON.stringify(catalog), 'utf8');
    },
  };
}

export default defineConfig({
  plugins: [react(), bundleCatalog()],
  server: {
    proxy: {
      '/api/produtos': {
        target: 'https://app.econverse.com.br',
        changeOrigin: true,
        rewrite: () => '/teste-front-end/junior/tecnologia/lista-produtos/produtos.json',
      },
    },
  },
});

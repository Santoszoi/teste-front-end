# Teste Front-End — Econverse

Vitrine de produtos desenvolvida com React, TypeScript e Sass para o teste técnico de Front-End da Econverse.

## Tecnologias

- React 18 e TypeScript
- Vite
- Sass (SCSS)
- Lucide React (ícones)
- Vitest (testes unitários)

## Executar localmente

Requisitos: Node.js 20.19+ ou 22.12+ e npm.

```bash
npm install
npm run dev
```

Acesse o endereço informado pelo Vite (geralmente `http://localhost:5173`).

## Verificação

```bash
npm run typecheck
npm test
npm run build
npm run preview
```

## Funcionalidades

- Vitrine alimentada pelo JSON disponibilizado no enunciado.
- Busca por nome e descrição, filtro por categoria (exibe lista vazia quando não há itens correspondentes) e paginação.
- Modal de detalhes do produto, com imagem, preço, descrição e controle de quantidade.
- Estados de carregamento, falha com opção de tentar novamente e lista vazia.
- Layout adaptado para desktop, tablet e celular.
- Estrutura semântica, descrições de imagens, navegação por teclado e fechamento do modal por `Escape`.

## Integração

O catálogo oficial é obtido de:

`https://app.econverse.com.br/teste-front-end/junior/tecnologia/lista-produtos/produtos.json`

No desenvolvimento, o Vite encaminha `/api/produtos` ao servidor oficial para evitar restrições de CORS. Durante `npm run build`, o Vite obtém uma cópia do JSON oficial e a inclui em `dist/api/produtos`, permitindo hospedar a pasta `dist` como site estático. A máquina que executa o build precisa ter acesso à URL oficial. A versão publicada usa o catálogo capturado no momento da compilação; para atualizá-lo, faça um novo build. A camada `src/services/products.ts` valida e normaliza os dados. Nenhum produto fictício é exibido quando a requisição falha.

## Estrutura

```text
src/
  components/     Cards e modal de produtos
  services/       Requisição e normalização do catálogo
  types/          Tipos TypeScript
  App.tsx         Página e estados de interface
  styles.scss     Estilos e breakpoints responsivos
```

## Observações

O projeto é uma vitrine demonstrativa, sem checkout ou processamento de pedidos. O layout deve ser comparado com o arquivo Figma fornecido no enunciado antes da entrega definitiva.

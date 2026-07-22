# Frontend Antigravity

Aplicação React/Tailwind para uma plataforma de cinema e teatro angolana.

## Recursos implementados

- Publicação de eventos com imagem e vídeo
- Streaming condicionado por data do evento
- Comentários e avaliações de eventos
- Painel de notificações
- Autenticação JWT com uso de token local
- Offline state e retry automático de requisições
- Lazy loading, memoização e boundary de erro para melhor performance

## Instalação

1. Clone o repositório:

```bash
git clone <repo-url> frontend_antigravity
cd frontend_antigravity
```

2. Instale dependências:

```bash
npm install
```

3. Crie o ficheiro de ambiente:

```bash
cp .env.example .env
```

4. Atualize `VITE_API_URL` conforme a URL do backend.

5. Inicie a aplicação:

```bash
npm run dev
```

## Scripts

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Pré-visualiza o build
- `npm run lint` - Verifica o código com ESLint

## Variáveis de ambiente

- `VITE_API_URL` - URL base para as chamadas à API

## Notas de qualidade

- O código já utiliza lazy loading de páginas para reduzir o tempo de carregamento inicial
- Existe um `ErrorBoundary` para capturar falhas de runtime
- O app detecta offline e informa o utilizador
- A autenticação JWT é extraída de `localStorage` e enviada no cabeçalho `Authorization`

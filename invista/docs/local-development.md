# Local Development Guide

## Pré-requisitos

- Node.js 18+
- npm 9+
- Dispositivos na mesma rede Wi-Fi para acesso mobile

## Rodar o projeto

```bash
npm install
npm run dev
```

O terminal exibirá automaticamente:

```
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

Use a URL **Network** para acessar de qualquer dispositivo na mesma rede (iPad, iPhone, outro computador).

## Identificar o IP local

```bash
npm run check:network
```

Saída:
```
🌐 inVista — Dev Server Network Info
────────────────────────────────────────
  Local:    http://localhost:5173
  Network:  http://192.168.0.194:5173
────────────────────────────────────────
```

Ou manualmente:
```bash
# macOS
ipconfig getifaddr en0   # Wi-Fi
ipconfig getifaddr en1   # Ethernet
```

## Firewall macOS

O Vite está configurado com `host: true` no `vite.config.ts`. Isso faz o servidor escutar em `0.0.0.0` automaticamente.

Se macOS bloquear a conexão com uma janela popup perguntando se Node.js pode aceitar conexões, **clique em "Permitir"**.

Isso acontece **uma única vez** por instalação do Node.js. Após permitir, o acesso em rede funciona permanentemente.

Se a popup não aparecer e o acesso continuar bloqueado, rode **uma vez**:

```bash
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp $(which node)
```

> Nota: Em ambientes Docker ou devcontainer, o firewall do host não afeta o container. No médio prazo, migrar para devcontainer elimina essa dependência completamente.

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia dev server com host aberto (rede local) |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build local |
| `npm run lint` | ESLint |
| `npm run test` | Unit tests (Vitest) |
| `npm run test:a11y` | Testes de acessibilidade (Playwright + Axe) |
| `npm run check:network` | Exibe URL de acesso na rede local |

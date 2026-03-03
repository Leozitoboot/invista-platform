# Local Development Guide

## Pré-requisitos

- Node.js 18+
- npm 9+
- Dispositivos na mesma rede para acesso mobile

## Rodar o projeto

```bash
npm install
npm run dev
```

O terminal exibirá automaticamente todas as interfaces disponíveis:

```
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

## Identificar o IP (todos os cenários)

```bash
npm run check:network
```

Saída (mostra todas as interfaces ativas):
```
🌐 inVista — Dev Server Network Info
────────────────────────────────────────────
  Local:    http://localhost:5173
  Network:  http://192.168.0.194:5173   [en0]
  Network:  http://192.168.0.197:5173   [en1]
────────────────────────────────────────────
```

Use a URL correspondente à rede do dispositivo.

## Cenário 1 — Mac + dispositivo na mesma rede Wi-Fi

1. `npm run dev`
2. `npm run check:network`
3. Abrir a URL `Network [en0]` no iPad/iPhone

## Cenário 2 — Mac + dispositivo via Hotspot do iPhone

1. Ativar Hotspot no iPhone
2. Conectar o Mac ao Hotspot (Wi-Fi do Mac → rede do iPhone)
3. Conectar o iPad ao mesmo Hotspot
4. **Reiniciar o servidor** (troca de rede exige novo bind):
   ```bash
   npm run dev
   ```
5. `npm run check:network` → a nova interface aparece (tipicamente `bridge100`)
6. Abrir a URL `Network [bridge100]` no iPad

> **Por que reiniciar?** O Vite faz bind ao IP no momento em que inicia. Se o Mac trocar de rede sem reiniciar, o servidor continua escutando no IP antigo (que deixa de existir).

## Firewall macOS

O Vite está configurado com `host: true` no `vite.config.ts`, escutando em `0.0.0.0`.

Na primeira execução após instalar o Node.js, o macOS exibe um popup pedindo permissão. **Clique em "Permitir"** — isso é permanente.

Se o popup não aparecer e o acesso em rede continuar bloqueado, rode uma única vez:

```bash
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp $(which node)
```

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Dev server com host aberto (rede local) |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build local |
| `npm run lint` | ESLint |
| `npm run test` | Unit tests (Vitest) |
| `npm run test:a11y` | Testes de acessibilidade (Playwright + Axe) |
| `npm run check:network` | Exibe todas as URLs de rede disponíveis |

# 20 Questions

A polished, local two-player version of the classic guessing game. One player chooses a secret word, the other asks up to twenty yes/no-style questions and tries to guess it.

**Live demo:** https://20questions-ten.vercel.app/

## Why this version

The original project was a Vue 2 prototype coupled to a temporary authentication API. Version 2 removes the unnecessary backend dependency and focuses on a reliable, self-contained game experience that can be deployed as a static frontend.

## Features

- Two-player pass-and-play flow with privacy handoff screens
- Explicit question and word-guess actions
- Yes / No / Sometimes answers
- 20-question limit with progress tracking
- Full round history with question/guess distinction
- Local game persistence with `localStorage`
- Responsive, accessible UI built without a CSS framework
- Unit tests, end-to-end coverage, linting, type checking, and CI

## Roadmap

### Multiplayer rooms

A future v3 milestone is real-time multiplayer across separate browsers/devices. Planned scope:

- Create or join a room with a short code or invite link
- Show a waiting state until a second player joins
- Synchronize turns, questions, answers, guesses, and game state in real time
- Keep the secret word private to Player 1
- Support reconnect/resume behavior
- Move authoritative game state to a backend service
- Use WebSockets/Socket.IO for realtime events
- Use Redis or another shared store for room/session state
- Add multi-browser end-to-end coverage

The current local pass-and-play mode remains the simplest and fastest way to play on one device.

## Stack

- Vue 3
- TypeScript
- Vite
- Vitest
- Playwright
- ESLint + Prettier
- GitHub Actions
- Vercel

## Local development

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

For end-to-end tests, install the Playwright browser once:

```bash
npx playwright install chromium
npm run test:e2e
```

CI also runs a production-dependency security audit. The deployed application has no backend or runtime API dependency; game state is stored locally in the browser.

## Deployment

The production site is deployed on Vercel from `main`:

https://20questions-ten.vercel.app/

No environment variables are required.

## Architecture

Game state is isolated in `src/composables/useGame.ts`; input rules live in `src/utils/validation.ts`; reusable game presentation is split into focused components under `src/components/game`.

The app intentionally uses local state instead of a backend because multiplayer networking and authentication are not required for the pass-and-play product experience.

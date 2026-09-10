# 20 Questions

A polished, local two-player version of the classic guessing game. One player chooses a secret word, the other asks up to twenty yes/no-style questions and tries to guess it.

## Why this version

The original project was a Vue 2 prototype coupled to a temporary authentication API. Version 2 removes the unnecessary backend dependency and focuses on a reliable, self-contained game experience that can be deployed as a static frontend.

## Features

- Two-player pass-and-play flow with privacy handoff screens
- Explicit question and word-guess actions
- Yes / No / Sometimes answers
- 20-question limit with progress tracking
- Full round history
- Local game persistence with `localStorage`
- Responsive, accessible UI built without a CSS framework
- Unit tests, end-to-end coverage, linting, type checking, and CI

## Stack

- Vue 3
- TypeScript
- Vite
- Vitest
- Playwright
- ESLint + Prettier
- GitHub Actions

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

## Deployment

The app is designed for zero-config deployment on Vercel. Import this repository, keep the Vite framework preset, and deploy from `main`.

## Architecture

Game state is isolated in `src/composables/useGame.ts`; input rules live in `src/utils/validation.ts`; reusable game presentation is split into focused components under `src/components/game`.

The app intentionally uses local state instead of a backend because multiplayer networking and authentication are not required for the pass-and-play product experience.

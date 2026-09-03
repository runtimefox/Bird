# CLAUDE.md

Guidance for working in this repository.

## Project

**Bird** — a Twitter/X-style social media frontend. SPA-like dashboard with posts,
likes, comments, hashtags, follow system, real-time direct messaging, notifications,
and online/typing presence. Talks to a separate NestJS backend (`nest-x-api.pro`).

This repo is **frontend only**. The API and WebSocket server live elsewhere.

## Commands

- `bun dev` — dev server on **port 3002** (Turbopack)
- `bun run build` — production build
- `bun run start` — serve the production build
- `bun run lint` — ESLint (next core-web-vitals + typescript configs)
- `bun test` — unit tests (`bun run test:watch`, `bun run test:coverage`)

Package manager is **Bun** (`bun.lock`). Use `bun install`, not npm/yarn.

### Tests

Runner is Bun's built-in `bun test` (no vitest/jest). Specs live in `tests/`,
mirroring `src/`. Setup is wired through `bunfig.toml` `preload`:

- `tests/happydom.ts` registers the DOM globals — must stay first, React and
  Testing Library read them at import time.
- `tests/setup.ts` registers the jest-dom matchers, auto-cleans after each test,
  and mocks `next/image` / `next/link` as plain `<img>` / `<a>` (both need Next
  runtime context that doesn't exist in a unit test).

`tests/matchers.d.ts` augments `bun:test` so `expect()` knows the jest-dom matchers,
and its `/// <reference types="bun" />` is what makes `bun:test` resolve in editors —
it is a directive, not a comment, so don't strip it.

`tests/helpers/` holds the shared rig:

- `axios-mock.ts` stubs `@/api/interceptors`, so the real service code (URLs, params,
  headers) stays under test. **`mock.module()` does not apply to a statically
  imported module** — imports are linked before the helper body runs, so reach the
  module under test with `const { x } = await import('@/...')`.
- `query-wrapper.tsx` — `renderWithQuery` / `renderHookWithQuery`, each with a fresh
  `QueryClient`. Its `gcTime: 0` collects observer-less entries written by
  `setQueryData`, so a test that seeds the cache and then inspects it needs its own
  client with a real `gcTime`.
- `toast-mock.ts`, `fixtures.ts` — toast spies and `I*` builders.

When a test covers a fix, check it discriminates: revert the fix, confirm that test
fails, restore. Several tests here passed vacuously until that check was run.

## Stack

- **Next.js 16** (App Router, React 19, React Compiler enabled in `next.config.ts`)
- **TypeScript** (strict), path alias `@/*` → `src/*`
- **Tailwind CSS v4** (config via `src/app/globals.css`, no JS tailwind config)
- **shadcn/ui** (style `radix-nova`, base color neutral) + Radix primitives + `lucide-react` icons
- **TanStack Query** — all server state
- **Zustand** — small client-only UI state (modals, open chat)
- **Axios** — HTTP, **socket.io-client** — real-time
- **react-hook-form** — forms, **react-hot-toast** — toasts (Toaster mounted in root layout)
- Custom **Chirp** fonts loaded via `next/font/local` (`font-chirp-regular/medium/bold`)
- App is dark-mode only (`className="dark"` hardcoded on `<html>`)

## Environment

`.env` holds public vars (note trailing slash on the API URL):

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api/
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

## Architecture & Conventions

### Directory layout (`src/`)

- `proxy.ts` — **route middleware** (Next 16 `proxy` convention), at the root of
  `src/`, not inside `app/`. Reads the `refresh_token` cookie and redirects: `/` →
  home or `/auth`, gates `/dashboard/*` and `/posts/*`, bounces logged-in users away
  from `/auth`. Its `matcher` array must stay string literals — Next reads it at
  build time.
- `app/` — App Router routes
  - `(root)/` — authenticated shell. Layout renders `DashboardClient` and a parallel
    `@modal` slot. Routes: `dashboard/{home,profile,profile/[id],settings,notifications}`,
    `posts/[id]`, and intercepted `(.)compose/post` for modal compose.
  - `auth/` — sign in / sign up page
  - `provider.tsx` — wraps app in `QueryClientProvider`. The client lives in lazy
    `useState` so a re-render cannot throw the cache away, and takes its defaults
    from `config/query.config.ts`.
- `services/` — **API layer**: one class per domain, single exported singleton
  instance (e.g. `export const postService = new Post()`). Each holds a private
  `URL` base and async methods returning the raw axios response. Types in/out from `types/`.
- `api/` — `interceptors.ts` exposes two axios instances:
  - `axiosClassic` — no auth header (auth endpoints)
  - `axiosAuth` — attaches `Bearer` access token; on 401 / `jwt expired`, calls
    `authService.getNewTokens()` once (`_isRetry` guard) and replays the request
  - `error.ts` — `errorCatch()` normalizes API error messages (handles array messages)
- `services/auth-token.ts` — `authTokenService` singleton: access token stored in a
  **cookie** via `js-cookie` (`access_token`, sameSite lax, 1-day). Refresh token is an
  httpOnly cookie set by the backend.
- `hooks/` — `use*` hooks wrapping TanStack Query/Mutation around services. This is
  where invalidation, toasts, and form wiring live (see `useCreatePost`, `useGetProfile`).
  `useChat` owns the socket.io lifecycle for a conversation and writes live messages
  into the `['messages', id]` cache entry rather than a second list in state.
- `store/` — Zustand stores for ephemeral UI state only (`chat.store`, `commentModal.store`)
- `types/` — shared interfaces, named `I*` and filed as `*.type.ts`
- `types/assets.d.ts` — ambient `declare module '*.css'`. Next 16 ships no CSS
  declaration; without this, editors report TS2882 on `app/layout.tsx`.
- `config/` — route, section and query constants. **Use `DASHBOARD` from
  `menu.config.ts`** for dashboard paths instead of hardcoding strings.
  `query.config.ts` holds `QUERY_DEFAULTS` (60s `staleTime`, one retry, no refetch
  on window focus).
- `components/` — `ui/` is shadcn primitives; `dashboard/` is feature-grouped
  (`posts/`, `chat/`, `comments/`, `sidebar/`, `header/`, `settings/`). At the root
  sit the cross-cutting pieces: `ErrorState` (failed query, with retry) and the auth
  forms.
- `utils/` — pure helpers (e.g. `chat.utils.ts` date/message formatting)
- `lib/utils.ts` — `cn()` (clsx + tailwind-merge)

### Page pattern

Route `page.tsx` files are thin; the real UI lives in a co-located client component
(e.g. `home/page.tsx` → `Home.tsx`, `settings/page.tsx` → `Settings.tsx`). Server
components stay default; add `'use client'` only where hooks/interactivity are needed.

### Code style

- Prettier: single quotes, trailing commas (all), 2-space tabs, printWidth 100
- Components: typed `FC<IProps>` with a local `interface I*Props`
- Imports: use `@/` alias; `import type { … }` for type-only imports
  (`verbatimModuleSyntax` is on, so this is required for types)
- Naming: services as singletons, hooks as `useX`, types as `IX`

### Data flow (typical feature)

1. Define/extend the type in `types/*.type.ts`
2. Add a method to the relevant `services/*.service.ts` class
3. Wrap it in a `hooks/use*` hook with TanStack Query; invalidate related
   `queryKey`s on mutation success and toast the result. Invalidate by prefix —
   `['posts']` covers both `['posts', <tab>]` and `['posts', 'user', <id>]`
4. Consume the hook in a feature component under `components/dashboard/`

### Real-time

`useChat(conversationId, otherUserId)` connects to `NEXT_PUBLIC_SOCKET_URL`, joins the
conversation room, and handles `newMessage` / `typing` / `userOnline` / `userOffline`.
It merges fetched history (TanStack Query) with live socket messages. Emits
`sendMessage` and `typing`. The socket is torn down on unmount.

## Antipatterns — do NOT do this

Keep new code consistent with the conventions above. Avoid the following:

### Data & API
- ❌ Don't call `axios`/`fetch` directly inside components or hooks. Go through a
  `services/*` method. Don't import `axiosAuth`/`axiosClassic` outside `services/`.
- ❌ Don't put API URLs, endpoints, or `process.env.NEXT_PUBLIC_*` strings in
  components. Endpoints belong in services; route paths in `config/`.
- ❌ Don't read/write the access token manually — always use `authTokenService`.
- ❌ Don't use `useState` + `useEffect` to fetch server data. Use TanStack Query.
- ❌ Don't swallow errors silently. Mutations surface failures with `errorCatch()` +
  a toast; queries whose emptiness is misleading render `<ErrorState>` with a retry.
  An empty list is not an error state.
- ❌ Don't forget to invalidate related `queryKey`s after a mutation — stale lists
  are a recurring bug source here.

### State
- ❌ Don't put server data in Zustand. Stores are for ephemeral UI state only
  (open modal, selected chat). Server data lives in TanStack Query's cache.
- ❌ Don't duplicate the same server state in both a store and a query.
- ❌ Don't lift state into a global store when local `useState` or props suffice.

### React / Next
- ❌ Don't add `'use client'` to a file that doesn't need hooks/interactivity, and
  don't mark whole route trees client. Keep `page.tsx` thin and server by default.
- ❌ Don't fetch inside `page.tsx` when the pattern is a co-located client component.
- ❌ Don't use raw `<img>` / `<a>` for internal nav — use `next/image` and `next/link`.
- ❌ Don't rely on the React Compiler to memoize for you — **add memoization
  manually**: `useMemo` for expensive computations, `useCallback` for stable
  callbacks, `React.memo` for pure presentational components.
- ❌ Don't hardcode dashboard route strings — use `DASHBOARD` from `menu.config.ts`.

### Types & style
- ❌ Don't use `any` (eslint will flag it). Type service inputs/outputs via `types/`.
- ❌ Don't use a value import for a type — use `import type { … }`
  (`verbatimModuleSyntax` is on; a plain import of a type breaks the build).
- ❌ Don't inline magic strings/numbers that belong in `config/` or a constant.
- ❌ Don't deviate from Prettier (single quotes, 2-space, trailing commas, width 100).

### Components
- ❌ Don't duplicate UI — reuse `components/ui/` primitives and feature components
  (e.g. `PostCard`, `PostImage`) instead of re-implementing markup.
- ❌ Don't build forms by hand — use `react-hook-form` like the existing hooks.
- ❌ Don't write giant multi-responsibility components; split into the
  feature-grouped folders under `components/dashboard/`.

## Images

`next.config.ts` only allows remote images from `localhost:3000` and
`res.cloudinary.com` (avatars/post media). Add new hosts to `remotePatterns`.

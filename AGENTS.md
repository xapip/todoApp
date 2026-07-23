# AGENTS.md — todo-telegram-app

## Project overview

Next.js 16 (App Router) Telegram Mini App with Supabase backend.

- `src/app/` — App Router pages and API routes (`/api/authUser`)
- `src/components/` — React components, split into `ui/shadcn/` (shadcn/ui), `TaskLists/`, `Tasks/`
- `src/context/` — Zustand stores: `tasksStore`, `taskListsStore`, `userStore`, `calendarStore`
- `src/lib/supabase/` — `client.ts` (browser), `server.ts` (server), `BaseModel.ts` (CRUD abstraction)
- `src/lib/telegram/` — TMA init data parsing + dev mock

## Essential commands

| Command             | Purpose                                                      |
| ------------------- | ------------------------------------------------------------ |
| `npm run dev`       | Dev server with Turbopack                                    |
| `npm run build`     | Production build                                             |
| `npm run lint`      | ESLint via `next lint`                                       |
| `npm run gen:types` | Generate Supabase TS types (requires `$PROJECT_REF` env var) |

Pre-commit hook runs `lint-staged` → `prettier --write` then `eslint --fix` on staged `*.{js,jsx,ts,tsx,json,css,scss,md}`.

## Path aliases (tsconfig)

- `@src/*` → `./src/*`
- `@lib/*` → `./src/lib/*`
- `@components/*` → `./src/components/*`
- `@context/*` → `./src/context/*`
- `@public/*` → `./public/*`
- `@db-types` → `./generated/types/database.types.ts`

shadcn/ui aliases (components.json): `ui` → `@components/ui/shadcn`, `utils` → `@lib/utils`, `hooks` → `@hooks`.

## Env requirements

| Variable                                       | Where used                                                             |
| ---------------------------------------------- | ---------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`                     | `.env` — Supabase project URL                                          |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`         | `.env` — anon key                                                      |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | `client.ts` — used instead of PUBLISHABLE_KEY                          |
| `SERVER_ROLE_KEY`                              | `server.ts` — service role key                                         |
| `TG_AUTH_SECRET`                               | `api/authUser/route.ts` — secret for deterministic password derivation |
| `TELEGRAM_BOT_TOKEN`                           | `getTmaData.ts` — validates TMA init data (production only)            |
| `PROJECT_REF`                                  | `gen:types` script — Supabase project reference                        |

## Development quirks

- **Telegram Mini App mock**: `TelegramMock()` auto-runs in `TelegramSDKInitProvider` during `development`. Provides a fake TG environment in browser. No real Telegram needed for dev.
- **Eruda debug console**: `eruda.init()` called in `page.tsx` — opens a mobile debug panel in dev.
- **App bootstrap chain**: `layout.tsx` → `TelegramSDKInitProvider` (mounts TG SDK) → `AppInitProvider` (authenticates via `/api/authUser`) → page.
- **No `middleware.ts` at root level**. The utility at `src/lib/supabase/middleware.ts` is **not** a Next.js middleware — it is an exported helper function.
- **No test framework** detected (no `jest`, `vitest`, `playwright` in deps).
- **Tailwind v4** with `@tailwindcss/postcss` plugin (no `tailwind.config.*` file).
- **`prettier-plugin-tailwindcss`** for automatic Tailwind class sorting. `semi: false`, `singleQuote: false`.

## Database types codegen

```bash
# requires PROJECT_REF env var
npm run gen:types
```

Output goes to `generated/types/database.types.ts` (aliased as `@db-types`).

## Architecture notes

- `BaseModel<T>` is a generic CRUD class over Supabase. Typed via generated `Database` types with `AutoReplaceRelation` helper for JOIN-style selects.
- Realtime subscriptions are set up per-store via Supabase `postgres_changes` channel. Each store has a `subscribeToChanges()` method returning an unsubscribe function.
- Auth flow: Telegram init data → `POST /api/authUser` → Supabase auth (email=pseudo email, password=SHA256 hash). Users table upserted after auth.
- Custom UI primitives live in `src/components/ui/` (`DraggableCalendar`, `DatePickerInput`, `deleteButton`), separate from shadcn.
- Russian locale actively used (`date-fns/locale/ru`).

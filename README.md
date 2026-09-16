# Minimal

An AI storefront agent: one admin (`/minimal`), two storefronts (`/noord`, `/volta`),
and a script-tag embed that mounts the agent into either storefront.

## Development

```bash
bun install
bun run placeholders   # generate the catalog placeholder images (once)
bun run dev:embed      # watch-build public/embed.js and public/embed.css
bun run dev            # in a second terminal
```

Open [http://localhost:3000](http://localhost:3000). The embed bundle is gitignored,
so `dev:embed` (or a one-off `node scripts/build-embed.mjs`) has to run at least
once before the storefronts can load `/embed.js`.

The chat route talks to the [Vercel AI Gateway](https://vercel.com/ai-gateway).
Put a key in `.env.local` before sending a message:

```env
AI_GATEWAY_API_KEY=...
```

## Layout

| Path | What it is |
| --- | --- |
| `src/app/minimal` | Admin: draft editor, snippet, publish, live iframe preview |
| `src/app/noord`, `src/app/volta` | Storefronts: home, category, product |
| `src/app/api/agents/[id]/chat` | Streaming chat route |
| `src/lib/catalog` | Flat TypeScript catalog per brand, validated at import |
| `src/lib/config` | Zod config schema, per-brand defaults, `published:{id}` storage |
| `embed/` | Standalone embed bundle (never imported by the storefronts) |

Draft config lives in memory (Zustand, no `persist`); published config lives in
`localStorage` under `published:{id}`. There is no database and no config API.

## Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the dev server |
| `bun run dev:embed` | Rebuild the embed bundle on change |
| `bun run build` | Build the embed, then the Next.js app |
| `bun start` | Serve the production build |
| `bun run lint` | Run ESLint |
| `bun run typecheck` | Run `tsc --noEmit` |
| `bun run placeholders` | Generate missing catalog placeholder images |

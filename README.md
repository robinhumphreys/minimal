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
| `src/components/volta`, `src/lib/volta`, `src/styles/volta.css` | The Volta storefront: components, view models, `volta-*` design tokens |
| `src/components/volta/ui` | Volta's own shadcn primitives, spending `volta-*` tokens only |
| `src/lib/catalog` | Flat TypeScript catalog per brand, validated at import |
| `src/lib/config` | Zod config schema, per-brand defaults, `published:{id}` storage |
| `embed/` | Standalone embed bundle (never imported by the storefronts) |

Each brand owns its own tokens, primitives and components. Nothing under
`src/components/volta` reads a shadcn semantic token, and nothing outside it
reads a `volta-*` one — restyling one storefront cannot move the other.

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

`node scripts/volta-imagery.mjs` re-crops the Volta editorial photography into
`public/volta/editorial`. The output is committed; the script only needs running
when the source shots or the crops change.

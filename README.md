# Minimal

An AI storefront agent a merchant sets up once and installs with one script
tag. Two demo storefronts, Noord Suits and Volta, prove the same embed looks
right under two brands.

## Stack

- Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, shadcn
- Vercel AI SDK v7 over the [AI Gateway](https://vercel.com/ai-gateway); Zod for every schema
- Zustand for the admin's draft config; `localStorage` for the published one
- esbuild + Tailwind CLI build the embed into `public/embed.js` and `public/embed.css`
- No database, no auth. Catalogs are flat TypeScript files.

## Run

```bash
bun install
bun run placeholders   # once: catalog placeholder images
bun run dev            # builds the embed, then starts Next on :3000
bun run dev:embed      # optional second terminal: rebuild the embed on change
```

Chat needs a gateway key in `.env.local`:

```env
AI_GATEWAY_API_KEY=vck_...
```

## Flows

**Merchant.** `/admin/{noord|volta}/agent/onboarding` runs five steps: intro,
match the site's colours and fonts, choose surfaces, customise each surface
in a live preview (by hand or by chatting to an agent that edits the config),
then install. Install publishes the draft to `localStorage` under
`published:{id}` and shows the snippets to paste.

**Storefront.** Each storefront's layout carries one line of agent:
`<script src="/embed.js" data-agent="noord">`. That is the same tag a merchant
gets. The embed reads the published config, or the brand default, and mounts
itself; a `storage` event re-renders it when another tab publishes.

**Shopper.** Three surfaces, all one React tree in `embed/`:

- Site chat: launcher plus window. Streams from `/api/agents/{id}/chat`;
  the model calls `showProducts` with slugs and the server fills in the cards
  from the catalog, so it cannot invent a price. `viewCart` is answered by the
  host page. The transcript lives in `sessionStorage` so it survives clicking
  a product card.
- Search assist: mounts under the site's search box. `/api/agents/{id}/search`
  answers twice, keyword first and the model's reading second.
- Product help: a `<minimal-agent-guide data-topic>` mount; opens a guided
  choice that asks one tappable question at a time.

**Preview.** The admin renders the storefront in an iframe with
`?minimal-agent=off` and posts the draft config over `postMessage`; the embed
renders the draft in place of the published one.

## Layout

| Path                                   | What                                                               |
| -------------------------------------- | ------------------------------------------------------------------ |
| `embed/`                               | The embed bundle. Own shadcn copies under `ui/`, prefixed `ma:`    |
| `src/app/admin/[org]/agent/onboarding` | The five-step flow and its components                              |
| `src/app/api/agents/[id]`              | `chat` and `search` routes for the shopper                         |
| `src/app/api/admin/site-chat`          | The config-editing agent behind the customise step                 |
| `src/lib/agent`                        | Tools, prompt, cart and page context, message types                |
| `src/lib/config`                       | Zod config schema, per-brand defaults, storage                     |
| `src/lib/catalog`                      | Flat catalogs per brand, validated at import                       |
| `src/app/{noord,volta}`                | Storefront routes: home, category, product, search                 |
| `src/components/{noord,volta}`         | Each storefront's components and its own shadcn primitives         |
| `src/lib/{noord,volta}`                | View models, bag, overlays per storefront                          |
| `src/styles/{noord,volta}.css`         | Each brand's tokens. Nothing crosses between brands or into shadcn |

Every config knob is a choice (`square | soft | round`), never a raw CSS
value, so any setting can be made to look right on any brand. The embed's
greys are mixed from the merchant's surface colour, which is how one build
lands on Noord's white and Volta's charcoal alike.

## Scripts

| Command                | What                                        |
| ---------------------- | ------------------------------------------- |
| `bun run dev`          | Build the embed once, start Next            |
| `bun run dev:embed`    | Rebuild the embed on change                 |
| `bun run build`        | Build the embed, then the app               |
| `bun run lint`         | ESLint                                      |
| `bun run typecheck`    | `next typegen` then `tsc --noEmit`          |
| `bun run format`       | Prettier                                    |
| `bun run placeholders` | Generate missing catalog placeholder images |

One-off scripts under `scripts/`, output committed: `volta-imagery.mjs`
re-crops Volta's editorial photography, `volta-reviews.ts` regenerates Volta's
reviews via the gateway, `prefix-classes.mjs` adds the `ma:` prefix to a
shadcn primitive copied into `embed/ui`.

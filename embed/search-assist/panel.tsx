import * as React from "react"
import { ArrowUpIcon } from "lucide-react"
import { cn } from "../cn"

import type { SearchRequest, SearchResult } from "@/lib/agent/types"
import type { AgentConfig, Behaviour } from "@/lib/config/schema"

import { ProductCard } from "../site-chat/products"
import { Working } from "../site-chat/thinking"
import { themeStyle } from "../theme"

/** Below this the site's own suggestions do a better job. */
const MIN_QUERY = 2
/** Set on <html>; the stylesheet hides elements carrying `data-native-search` under it. */
const ACTIVE_ATTR = "data-minimal-search"
/** Hold the reading state at least this long, or a fast answer reads as a lookup. */
const MIN_READING_MS = 900
const STAGES = ["Reading your search", "Looking through the shop"]
const STAGE_MS = 900

type Turn = {
  id: number
  ask: string
  result: SearchResult | null
  reading: boolean
}

/** One search request, however it is answered. */
export type SearchFn = (
  request: SearchRequest & { behaviour: Behaviour },
  signal: AbortSignal,
) => Promise<SearchResult>

function routeSearch(id: AgentConfig["id"]): SearchFn {
  return async (request, signal) => {
    const response = await fetch(`/api/agents/${id}/search`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(request),
      signal,
    })
    if (!response.ok) throw new Error(`search ${response.status}`)
    return (await response.json()) as SearchResult
  }
}

export function SearchPanel({
  config,
  query,
  search: searchProp,
}: {
  config: AgentConfig
  query: string
  /** Stands in for the route in previews that must not spend a token. */
  search?: SearchFn
}) {
  const trimmed = query.trim()
  // Turns are tagged with the query they belong to, so a new query resets
  // the thread without a separate effect to clear it.
  const [thread, setThread] = React.useState<{ query: string; turns: Turn[] }>({
    query: trimmed,
    turns: [],
  })
  const turns = thread.query === trimmed ? thread.turns : EMPTY
  const [draft, setDraft] = React.useState("")
  const nextId = React.useRef(0)
  const endRef = React.useRef<HTMLDivElement>(null)
  const composerRef = React.useRef<HTMLFormElement>(null)
  const composerHeight = useHeight(composerRef)
  const keyboard = useKeyboardInset()

  const behaviour = config.behaviour
  const searchFn = React.useMemo(
    () => searchProp ?? routeSearch(config.id),
    [searchProp, config.id],
  )

  const run = React.useCallback(
    async (turnId: number, refinements: string[], signal: AbortSignal) => {
      const patch = (recipe: (turn: Turn) => Turn) =>
        setThread((current) =>
          current.query !== trimmed
            ? current
            : {
                ...current,
                turns: current.turns.map((turn) =>
                  turn.id === turnId ? recipe(turn) : turn,
                ),
              },
        )

      const started = Date.now()
      try {
        const result = await searchFn(
          { query: trimmed, refinements, behaviour },
          signal,
        )
        await new Promise((resolve) =>
          window.setTimeout(
            resolve,
            Math.max(0, MIN_READING_MS - (Date.now() - started)),
          ),
        )
        if (signal.aborted) return
        patch((turn) => ({ ...turn, result, reading: false }))
      } catch (error) {
        if (signal.aborted) return
        console.warn("[minimal-agent] search failed", error)
        patch((turn) => ({
          ...turn,
          result: {
            query: trimmed,
            reading: [],
            products: [],
            line: "I could not read that search just now. Try again in a moment.",
            followUps: [],
          },
          reading: false,
        }))
      }
    },
    [searchFn, trimmed, behaviour],
  )

  React.useEffect(() => {
    if (trimmed.length < MIN_QUERY) return
    const controller = new AbortController()
    const id = nextId.current++
    setThread({
      query: trimmed,
      turns: [{ id, ask: trimmed, result: null, reading: true }],
    })
    void run(id, [], controller.signal)
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trimmed])

  const active = trimmed.length >= MIN_QUERY
  React.useLayoutEffect(() => {
    if (!active) return
    document.documentElement.setAttribute(ACTIVE_ATTR, "")
    return () => document.documentElement.removeAttribute(ACTIVE_ATTR)
  }, [active])

  const refinementsRef = React.useRef<AbortController | null>(null)
  const refine = (text: string) => {
    const ask = text.trim()
    if (!ask || turns.some((turn) => turn.reading)) return
    refinementsRef.current?.abort()
    const controller = new AbortController()
    refinementsRef.current = controller
    const id = nextId.current++
    // The first turn's ask (the query itself) is sent separately, so skip it.
    const refinements = [...turns.slice(1).map((turn) => turn.ask), ask]
    setThread({
      query: trimmed,
      turns: [...turns, { id, ask, result: null, reading: true }],
    })
    void run(id, refinements, controller.signal)
  }

  const turnCount = turns.length
  React.useEffect(() => {
    if (turnCount > 1) {
      endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" })
    }
  }, [turnCount])

  if (trimmed.length < MIN_QUERY) return null

  const busy = turns.some((turn) => turn.reading)

  return (
    <div
      data-slot="search-assist"
      className="minimal-agent-root ma:@container ma:flex ma:flex-col ma:gap-4 ma:pt-4 ma:font-sans ma:text-foreground"
      style={
        {
          ...themeStyle(config.theme),
          "--composer-height": `${composerHeight}px`,
        } as React.CSSProperties
      }
    >
      {turns.map((turn, index) => (
        <TurnView
          key={turn.id}
          turn={turn}
          config={config}
          first={index === 0}
          last={index === turns.length - 1}
          onRefine={refine}
        />
      ))}

      {/* Holds the composer's place in the flow; it's fixed on a phone. */}
      <div
        ref={endRef}
        aria-hidden="true"
        className="ma:h-(--composer-height) ma:shrink-0 ma:@md:h-0"
      />

      {/* Pinned to the visible screen on a phone, so it sits on the keyboard, not under it. */}
      <form
        ref={composerRef}
        className="ma:sticky ma:bottom-0 ma:flex ma:items-center ma:gap-2 ma:rounded-[calc(var(--radius)+0.25rem)] ma:bg-muted ma:pr-1.5 ma:pl-3 ma:@max-md:fixed ma:@max-md:inset-x-0 ma:@max-md:z-10 ma:@max-md:rounded-none ma:@max-md:border-t ma:@max-md:border-border ma:@max-md:bg-background ma:@max-md:px-4 ma:@max-md:pt-3 ma:@max-md:pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        style={{ bottom: keyboard }}
        onSubmit={(event) => {
          event.preventDefault()
          refine(draft)
          setDraft("")
        }}
      >
        <div className="ma:flex ma:min-w-0 ma:flex-1 ma:items-center ma:gap-2 ma:@max-md:rounded-[calc(var(--radius)+0.25rem)] ma:@max-md:bg-muted ma:@max-md:pr-1.5 ma:@max-md:pl-3">
          <input
            autoFocus
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={behaviour.placeholders.search}
            aria-label="Refine the search"
            className="ma:h-10 ma:min-w-0 ma:flex-1 ma:bg-transparent ma:text-base ma:outline-none ma:placeholder:text-muted-foreground ma:md:text-sm"
          />
          <button
            type="submit"
            disabled={draft.trim().length === 0 || busy}
            aria-label="Send"
            className="ma:flex ma:size-7 ma:shrink-0 ma:items-center ma:justify-center ma:rounded-full ma:bg-primary ma:text-primary-foreground ma:disabled:opacity-40"
          >
            <ArrowUpIcon className="ma:size-4" />
          </button>
        </div>
      </form>
    </div>
  )
}

const EMPTY: Turn[] = []

function useHeight(ref: React.RefObject<HTMLElement | null>) {
  const [height, setHeight] = React.useState(0)

  React.useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const measure = () => setHeight(element.offsetHeight)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])

  return height
}

/**
 * On a phone the keyboard doesn't shrink the layout viewport `position:
 * fixed` uses, so this computes the offset needed to sit on it instead.
 */
function useKeyboardInset() {
  const [inset, setInset] = React.useState(0)

  React.useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return
    const measure = () =>
      setInset(
        Math.max(
          0,
          Math.round(
            window.innerHeight - (viewport.offsetTop + viewport.height),
          ),
        ),
      )
    measure()
    viewport.addEventListener("resize", measure)
    viewport.addEventListener("scroll", measure)
    return () => {
      viewport.removeEventListener("resize", measure)
      viewport.removeEventListener("scroll", measure)
    }
  }, [])

  return inset
}

const SHOWN = 4

/** Nothing is drawn until the reading is done, so the answer arrives before its products. */
function TurnView({
  turn,
  config,
  first,
  last,
  onRefine,
}: {
  turn: Turn
  config: AgentConfig
  first: boolean
  last: boolean
  onRefine: (text: string) => void
}) {
  const [showAll, setShowAll] = React.useState(false)
  const { result, reading } = turn
  const products = result?.products ?? []
  const shown = showAll ? products : products.slice(0, SHOWN)

  return (
    <div className="ma:flex ma:flex-col ma:gap-3">
      {/* Slides in from above, where the search box was, on the first turn only. */}
      <p
        className={cn(
          "ma:w-fit ma:max-w-[80%] ma:self-end ma:rounded-xl ma:bg-primary ma:px-3 ma:py-2 ma:text-sm ma:leading-relaxed ma:text-primary-foreground",
          first &&
            "ma:animate-in ma:fade-in ma:slide-in-from-top-2 ma:duration-300",
        )}
      >
        {turn.ask}
      </p>

      {reading || !result ? (
        reading ? (
          <Reading style={config.theme.thinking} />
        ) : null
      ) : (
        <>
          <p className="ma:w-fit ma:max-w-[85%] ma:rounded-xl ma:bg-muted ma:px-3 ma:py-2 ma:text-sm ma:leading-relaxed">
            {result.line}
          </p>

          {first && result.reading.length > 0 ? (
            <div className="ma:flex ma:flex-wrap ma:gap-2">
              {result.reading.map((phrase) => (
                <Chip key={phrase} onClick={() => onRefine(phrase)}>
                  {phrase}
                </Chip>
              ))}
            </div>
          ) : null}

          {shown.length > 0 ? (
            <div className="ma:grid ma:grid-cols-2 ma:gap-2 ma:@lg:grid-cols-4">
              {shown.map((product) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  cards={config.surface.cards}
                  layout="column"
                />
              ))}
            </div>
          ) : null}

          {products.length > SHOWN && !showAll ? (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="ma:w-fit ma:text-xs ma:font-medium ma:text-muted-foreground ma:underline-offset-4 ma:hover:text-foreground ma:hover:underline"
            >
              Show all {products.length}
            </button>
          ) : null}

          {last && result.followUps.length > 0 ? (
            <div className="ma:flex ma:flex-wrap ma:gap-2">
              {result.followUps.map((followUp) => (
                <Chip key={followUp} onClick={() => onRefine(followUp)}>
                  {followUp}
                </Chip>
              ))}
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}

function Reading({ style }: { style: AgentConfig["theme"]["thinking"] }) {
  const [stage, setStage] = React.useState(0)

  React.useEffect(() => {
    const timers = STAGES.slice(1).map((_, index) =>
      window.setTimeout(() => setStage(index + 1), STAGE_MS * (index + 1)),
    )
    return () => timers.forEach(window.clearTimeout)
  }, [])

  return (
    <div className="ma:flex ma:h-9 ma:w-fit ma:items-center ma:rounded-xl ma:bg-muted ma:px-3 ma:text-sm ma:text-muted-foreground">
      {/* Stage text always shows, even for the "text" style, which has none of its own. */}
      <Working style={style === "text" ? "dots" : style} label="" />
      <span className="ma:ml-2">{STAGES[stage]}…</span>
    </div>
  )
}

function Chip({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "ma:flex ma:h-8 ma:cursor-pointer ma:items-center ma:gap-1.5 ma:rounded-full ma:border ma:border-border ma:bg-card ma:px-3 ma:text-xs ma:font-medium ma:whitespace-nowrap ma:text-foreground ma:outline-none ma:hover:bg-muted ma:focus-visible:ring-3 ma:focus-visible:ring-ring/50",
        className,
      )}
      {...props}
    />
  )
}

import * as React from "react"
import { ArrowUpIcon } from "lucide-react"
import { cn } from "cn"

import type { SearchRequest, SearchResult } from "@/lib/agent/types"
import type { AgentConfig } from "@/lib/config/schema"

import { ProductCard } from "../site-chat/products"
import { themeStyle } from "../theme"

/** How long the shopper has to stop typing before a search goes out. */
const DEBOUNCE_MS = 300
/** Below this the site's own suggestions do a better job. */
const MIN_QUERY = 2
/**
 * The least time the agent is shown reading. Keyword retrieval is instant,
 * and an answer that lands before the question has settled reads as a lookup,
 * not a reading; the grid still appears the moment it is known.
 */
const MIN_READING_MS = 900
/** What the agent appears to be doing while it works, in order. */
const STAGES = ["Reading your search", "Looking through the shop"]
const STAGE_MS = 900

type Turn = {
  id: number
  /** What the shopper added, for every turn after the first. */
  ask?: string
  result: SearchResult | null
  reading: boolean
}

/**
 * The site's search box, read by the agent.
 *
 * The box stays the site's: this panel is portaled under it and only ever
 * sees the query. Underneath, the search is a conversation — the agent's
 * answer to what was typed, then the shopper's taps and refinements as turns
 * of their own — so narrowing down never means starting over in the box.
 *
 * Each turn asks twice: keyword retrieval for the grid the moment the shopper
 * pauses, then the model for its reading, line and follow-ups. If the model
 * is unreachable the keyword answer carries its own line and facet chips, so
 * the conversation still has a voice.
 */
export function SearchPanel({
  config,
  query,
}: {
  config: AgentConfig
  query: string
}) {
  const trimmed = query.trim()
  // Turns belong to the search they were made for, so a new search starts
  // over without an effect having to clear anything.
  const [thread, setThread] = React.useState<{ query: string; turns: Turn[] }>({
    query: trimmed,
    turns: [],
  })
  const turns = thread.query === trimmed ? thread.turns : EMPTY
  const [draft, setDraft] = React.useState("")
  const nextId = React.useRef(0)
  const endRef = React.useRef<HTMLDivElement>(null)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const fill = useFillToBottom(rootRef)

  const behaviour = config.behaviour

  /** Runs one turn: instant grid, then the agent's reading over it. */
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

      const search = async (mode: SearchRequest["mode"]) => {
        const response = await fetch(`/api/agents/${config.id}/search`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            query: trimmed,
            refinements,
            mode,
            behaviour,
          } satisfies SearchRequest & { behaviour: typeof behaviour }),
          signal,
        })
        if (!response.ok) throw new Error(`search ${response.status}`)
        return (await response.json()) as SearchResult
      }

      const started = Date.now()
      try {
        const quick = await search("keyword")
        patch((turn) => ({ ...turn, result: quick }))
        let read = quick
        try {
          read = await search("agent")
        } catch (error) {
          if (signal.aborted) return
          console.warn("[minimal-agent] agent search failed", error)
        }
        // Whichever answer stands, it stands after the reading has had time
        // to be seen.
        await new Promise((resolve) =>
          window.setTimeout(
            resolve,
            Math.max(0, MIN_READING_MS - (Date.now() - started)),
          ),
        )
        if (signal.aborted) return
        patch((turn) => ({
          ...turn,
          result: read.mode === "agent" ? read : turn.result,
          reading: false,
        }))
      } catch (error) {
        if (signal.aborted) return
        console.warn("[minimal-agent] search failed", error)
        patch((turn) => ({ ...turn, reading: false }))
      }
    },
    [config.id, trimmed, behaviour],
  )

  // The first turn: typed, paused, answered.
  React.useEffect(() => {
    if (trimmed.length < MIN_QUERY) return
    const controller = new AbortController()
    const id = nextId.current++
    const timer = window.setTimeout(() => {
      setThread({
        query: trimmed,
        turns: [{ id, result: null, reading: true }],
      })
      void run(id, [], controller.signal)
    }, DEBOUNCE_MS)
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
    // `run` changes with the query, which is the trigger already.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trimmed])

  // Every later turn: a tap or a sentence, appended to the same thread.
  const refinementsRef = React.useRef<AbortController | null>(null)
  const refine = (text: string) => {
    const ask = text.trim()
    if (!ask || turns.some((turn) => turn.reading)) return
    refinementsRef.current?.abort()
    const controller = new AbortController()
    refinementsRef.current = controller
    const id = nextId.current++
    const refinements = [
      ...turns.flatMap((turn) => (turn.ask ? [turn.ask] : [])),
      ask,
    ]
    setThread({
      query: trimmed,
      turns: [...turns, { id, ask, result: null, reading: true }],
    })
    void run(id, refinements, controller.signal)
  }

  // Each new turn lands in view, even inside the host's own scrolling sheet.
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
      ref={rootRef}
      data-slot="search-assist"
      className="minimal-agent-root @container flex flex-col gap-4 pt-4 font-sans text-foreground"
      style={{ ...themeStyle(config.theme), minHeight: fill }}
    >
      {turns.map((turn, index) => (
        <TurnView
          key={turn.id}
          turn={turn}
          first={index === 0}
          last={index === turns.length - 1}
          onRefine={refine}
        />
      ))}

      <div ref={endRef} />

      {/* Refining in the shopper's own words, without leaving the search.
          On a phone the composer is pinned to the foot of the screen — it is
          the one thing the shopper should never have to scroll to — and the
          panel is stretched to reach it, so it sits there before there is
          anything to scroll as well as after. */}
      <form
        className="sticky bottom-0 mt-auto flex items-center gap-2 rounded-[calc(var(--radius)+0.25rem)] bg-muted pr-1.5 pl-3 @max-md:-mx-4 @max-md:rounded-none @max-md:border-t @max-md:border-border @max-md:bg-background @max-md:px-4 @max-md:py-3"
        onSubmit={(event) => {
          event.preventDefault()
          refine(draft)
          setDraft("")
        }}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 @max-md:rounded-[calc(var(--radius)+0.25rem)] @max-md:bg-muted @max-md:pr-1.5 @max-md:pl-3">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Tell the assistant more…"
            aria-label="Refine the search"
            className="h-10 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground md:text-sm"
          />
          <button
            type="submit"
            disabled={draft.trim().length === 0 || busy}
            aria-label="Send"
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
          >
            <ArrowUpIcon className="size-4" />
          </button>
        </div>
      </form>
    </div>
  )
}

const EMPTY: Turn[] = []

/** Under this many pixels across, the panel is on a phone. Matches `@max-md`. */
const PHONE_MAX_PX = 448

/**
 * How tall the panel has to be to reach the foot of whatever scrolls it.
 *
 * The host's search sheet is the scroller and the panel starts partway down
 * it, under the site's own input; the distance between the two is the host's
 * business and differs per site, so it is measured rather than assumed. Only
 * on a phone — on a wider screen the composer sits after the thread.
 */
function useFillToBottom(ref: React.RefObject<HTMLDivElement | null>) {
  const [height, setHeight] = React.useState<number | undefined>(undefined)

  React.useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const scroller = scrollParent(root)
    if (!scroller) return

    const measure = () => {
      if (root.clientWidth >= PHONE_MAX_PX) {
        setHeight(undefined)
        return
      }
      const top =
        root.getBoundingClientRect().top -
        scroller.getBoundingClientRect().top +
        scroller.scrollTop
      setHeight(Math.max(0, scroller.clientHeight - top))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(scroller)
    observer.observe(root)
    return () => observer.disconnect()
  }, [ref])

  return height
}

function scrollParent(element: HTMLElement): HTMLElement | null {
  let node = element.parentElement
  while (node) {
    const { overflowY } = getComputedStyle(node)
    if (overflowY === "auto" || overflowY === "scroll") return node
    node = node.parentElement
  }
  return null
}

/** How many cards a turn shows before the shopper asks for the rest. */
const SHOWN = 4

/**
 * One exchange: what the shopper added, and everything the agent answered.
 *
 * The agent speaks first and the products follow as its attachment, the way
 * a chat reads — not a grid with a caption under it. Nothing is drawn until
 * the reading is done, so what the shopper sees arrive is an answer, not a
 * lookup that a sentence caught up with.
 */
function TurnView({
  turn,
  first,
  last,
  onRefine,
}: {
  turn: Turn
  first: boolean
  last: boolean
  onRefine: (text: string) => void
}) {
  const [showAll, setShowAll] = React.useState(false)
  const { result, reading } = turn
  const agent = result?.mode === "agent" ? result : null
  const products = result?.products ?? []
  const shown = showAll ? products : products.slice(0, SHOWN)

  return (
    <div className="flex flex-col gap-3">
      {turn.ask ? (
        <p className="w-fit max-w-[80%] self-end rounded-xl bg-primary px-3 py-2 text-sm leading-relaxed text-primary-foreground">
          {turn.ask}
        </p>
      ) : null}

      {reading || !result ? (
        reading ? (
          <Reading />
        ) : null
      ) : (
        <>
          <p className="w-fit max-w-[85%] rounded-xl bg-muted px-3 py-2 text-sm leading-relaxed">
            {result.line}
          </p>

          {/* What the agent took the search to mean, once, above the first
              grid. */}
          {first && agent && agent.reading.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {agent.reading.map((phrase) => (
                <Chip key={phrase} onClick={() => onRefine(phrase)}>
                  {phrase}
                </Chip>
              ))}
            </div>
          ) : null}

          {shown.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 @lg:grid-cols-4">
              {shown.map((product) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  layout="column"
                />
              ))}
            </div>
          ) : null}

          {products.length > SHOWN && !showAll ? (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="w-fit text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Show all {products.length}
            </button>
          ) : null}

          {last && result.followUps.length > 0 ? (
            <div className="flex flex-wrap gap-2">
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

/** What the agent appears to be doing, one stage giving way to the next. */
function Reading() {
  const [stage, setStage] = React.useState(0)

  React.useEffect(() => {
    const timers = STAGES.slice(1).map((_, index) =>
      window.setTimeout(() => setStage(index + 1), STAGE_MS * (index + 1)),
    )
    return () => timers.forEach(window.clearTimeout)
  }, [])

  return (
    <p
      role="status"
      className="flex h-9 w-fit items-center gap-2 rounded-xl bg-muted px-3 text-sm text-muted-foreground"
    >
      <span className="flex items-center gap-1">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="size-1.5 animate-bounce rounded-full bg-current/60"
            style={{ animationDelay: `${dot * 120}ms` }}
          />
        ))}
      </span>
      {STAGES[stage]}…
    </p>
  )
}

function Chip({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-medium whitespace-nowrap text-foreground outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
      {...props}
    />
  )
}

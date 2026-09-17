"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRightIcon, ChevronLeftIcon, XIcon } from "lucide-react"

import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetTitle,
} from "@/components/noord/ui/sheet"
import { useOverlays } from "@/lib/noord/overlays"
import { useSearchUrl } from "@/lib/search-url"
import type { SearchEntry } from "@/lib/noord/types"

/** Terms chosen so every one of them returns something from the catalog. */
const POPULAR = [
  "Havana suit",
  "Wool overcoat",
  "White shirt",
  "Navy cardigan",
  "Black loafers",
]

const MAX_RESULTS = 8
/** Below this a search is not worth submitting. Matches the embed. */
const MIN_QUERY = 2

/**
 * Full-screen search: a heading, one input, and a list of names.
 *
 * Suggestions are text only — no thumbnail, no price, no category. A shopper
 * mid-keystroke is scanning for a word, and a column of 64px photographs slows
 * that scan down rather than speeding it up. Matching runs over a pre-lowercased
 * haystack built on the server, so the catalog filters synchronously on every
 * keystroke without a debounce.
 *
 * Submitting hands the search to the agent: the query goes onto the mount
 * below, the agent answers under it, and this sheet's own input and list —
 * everything marked `data-native-search` — step aside for the answer, so the
 * words the shopper typed become the first bubble and the agent's composer is
 * the one input on screen. Back or close resets it.
 *
 * The sheet has a URL, `/noord/search?q=…`; see `useSearchUrl`.
 */
export function SearchOverlay({ index }: { index: SearchEntry[] }) {
  const open = useOverlays((state) => state.open) === "search"
  const from = useOverlays((state) => state.from)
  const show = useOverlays((state) => state.show)
  const toggle = useOverlays((state) => state.toggle)
  const back = useOverlays((state) => state.back)
  const close = useOverlays((state) => state.close)

  const [query, setQuery] = React.useState("")
  const [submitted, setSubmitted] = React.useState("")

  // Each opening starts from a clean slate rather than the last search, so
  // every way out of the sheet clears it first.
  const reset = () => {
    setQuery("")
    setSubmitted("")
  }

  const url = useSearchUrl({
    brand: "noord",
    open,
    show: () => show("search"),
    close: () => {
      reset()
      close()
    },
    onLanding: (landed) => {
      setQuery(landed)
      setSubmitted(landed.length < MIN_QUERY ? "" : landed)
    },
  })
  const trimmed = query.trim().toLowerCase()
  const terms = React.useMemo(
    () => (trimmed.length < MIN_QUERY ? [] : trimmed.split(/\s+/)),
    [trimmed],
  )

  const results = React.useMemo(() => {
    if (terms.length === 0) return []
    return index
      .filter((entry) => terms.every((term) => entry.haystack.includes(term)))
      .slice(0, MAX_RESULTS)
  }, [index, terms])

  const searching = terms.length > 0

  const submit = (text: string) => {
    const next = text.trim()
    if (next.length < MIN_QUERY) return
    setQuery(next)
    setSubmitted(next)
    url.setQuery(next)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) reset()
        toggle("search", next)
      }}
    >
      <SheetContent side="full" showCloseButton={false}>
        <SheetTitle className="sr-only">Search</SheetTitle>

        <div className="noord-sheet-gutter flex h-noord-header shrink-0 items-center justify-between">
          <button
            type="button"
            onClick={() => {
              reset()
              back()
            }}
            aria-label={from === "nav" ? "Back to menu" : "Close search"}
            className="-ml-2 flex size-10 items-center justify-center text-noord-ink transition-colors hover:text-noord-ink-muted"
          >
            <ChevronLeftIcon className="size-5" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => {
              reset()
              close()
            }}
            aria-label="Close search"
            className="-mr-2 flex size-10 items-center justify-center text-noord-ink transition-colors hover:text-noord-ink-muted"
          >
            <XIcon className="size-5" strokeWidth={1.5} />
          </button>
        </div>

        <SheetBody>
          {/* A column that fills the scroller, so the agent's composer can
              sit at its foot; see the embed's `minimal-agent-search` rule. */}
          <div className="noord-sheet-gutter mx-auto flex min-h-full w-full max-w-2xl flex-col">
            <h2 className="pt-2 pb-5 text-noord-section">Search</h2>

            <form
              data-native-search
              role="search"
              className="relative"
              onSubmit={(event) => {
                event.preventDefault()
                submit(query)
              }}
            >
              <input
                // Autofocus is right here: the overlay exists only to be typed in.
                autoFocus
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search for suits, coats, etc."
                aria-label="Search products"
                enterKeyHint="search"
                className="h-12 w-full border border-noord-line bg-transparent pr-11 pl-4 font-noord text-noord-lead text-noord-ink transition-colors outline-none placeholder:text-noord-ink-faint focus:border-noord-ink [&::-webkit-search-cancel-button]:hidden"
              />
              {query.length > 0 && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-noord-ink-muted transition-colors hover:text-noord-ink"
                >
                  <XIcon className="size-4" strokeWidth={1.5} />
                </button>
              )}
            </form>

            {/* The agent's reading of the search, when the embed is on the
                page. Empty until a search is submitted, and the list below
                carries on. */}
            <minimal-agent-search
              data-query={submitted}
              style={
                {
                  "--minimal-search-gutter": "var(--noord-sheet-gutter)",
                } as React.CSSProperties
              }
            />

            <div data-native-search className="flex flex-col pb-16">
              {/* The way in: submitting hands the words to the agent, and the
                  return key does not say so. First under the box, whatever
                  the list below says, because "no products" is not the end
                  of a search for “wedding”. */}
              {searching && (
                <button
                  type="button"
                  data-search-assist-only
                  onClick={() => submit(query)}
                  className="mt-4 flex w-full items-center justify-between gap-4 border-b border-noord-line py-3 text-left text-noord-lead text-noord-ink transition-colors hover:text-noord-ink-muted"
                >
                  <span>Ask about “{query.trim()}”</span>
                  <ArrowRightIcon
                    className="size-5 shrink-0"
                    strokeWidth={1.5}
                  />
                </button>
              )}

              <h3 className="pt-6 pb-1 text-noord-body text-noord-ink-faint">
                {!searching
                  ? "Popular searches"
                  : results.length > 0
                    ? "Products"
                    : "No exact matches"}
              </h3>

              {!searching && (
                <>
                  <ul className="flex flex-col">
                    {POPULAR.map((term) => (
                      <li key={term}>
                        <button
                          type="button"
                          onClick={() => submit(term)}
                          className="block w-full py-2.5 text-left text-noord-lead text-noord-ink transition-colors hover:text-noord-ink-muted"
                        >
                          {term}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p
                    data-search-assist-only
                    className="pt-6 text-noord-body text-noord-ink-faint"
                  >
                    Or describe what you’re looking for, in your own words.
                  </p>
                </>
              )}

              {searching &&
                (results.length === 0 ? (
                  <p className="py-2.5 text-noord-lead text-noord-ink-muted">
                    Try a fabric, a colour or a category.
                  </p>
                ) : (
                  <ul className="flex flex-col">
                    {results.map((entry) => (
                      <li key={entry.slug}>
                        {/* No close here: the route change closes the
                            sheet, so the page underneath does not flash. */}
                        <Link
                          href={entry.href}
                          className="block py-2.5 text-noord-lead text-noord-ink transition-colors hover:text-noord-ink-muted"
                        >
                          <Highlight text={entry.name} terms={terms} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ))}
            </div>
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  )
}

/** Bolds the matched words, so the reason a row is in the list is visible. */
function Highlight({ text, terms }: { text: string; terms: string[] }) {
  if (terms.length === 0) return <>{text}</>

  const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "ig")
  const lowered = terms.map((term) => term.toLowerCase())

  return (
    <>
      {text.split(pattern).map((part, index) =>
        lowered.includes(part.toLowerCase()) ? (
          <strong key={index} className="font-semibold">
            {part}
          </strong>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        ),
      )}
    </>
  )
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

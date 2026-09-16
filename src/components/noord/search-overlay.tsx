"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronLeftIcon, XIcon } from "lucide-react"

import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetTitle,
} from "@/components/noord/ui/sheet"
import { useOverlays } from "@/lib/noord/overlays"
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
 * the one input on screen. "New search" brings the box back.
 */
export function SearchOverlay({ index }: { index: SearchEntry[] }) {
  const open = useOverlays((state) => state.open) === "search"
  const from = useOverlays((state) => state.from)
  const toggle = useOverlays((state) => state.toggle)
  const back = useOverlays((state) => state.back)
  const close = useOverlays((state) => state.close)

  const [query, setQuery] = React.useState("")
  const [submitted, setSubmitted] = React.useState("")
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
  }

  const reset = () => {
    setQuery("")
    setSubmitted("")
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        // Each opening starts from a clean slate rather than the last search.
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
          <div className="flex items-center gap-4">
            {submitted && (
              <button
                type="button"
                onClick={reset}
                className="text-noord-body text-noord-ink-muted transition-colors hover:text-noord-ink"
              >
                New search
              </button>
            )}
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
        </div>

        <SheetBody>
          <div className="noord-sheet-gutter mx-auto w-full max-w-2xl pb-16">
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
            <minimal-agent-search data-query={submitted} />

            <div data-native-search className="contents">
              <h3 className="pt-6 pb-1 text-noord-body text-noord-ink-faint">
                {!searching
                  ? "Popular searches"
                  : results.length > 0
                    ? "Products"
                    : "No products found"}
              </h3>

              {!searching && (
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
              )}

              {searching &&
                (results.length === 0 ? (
                  <p className="py-2.5 text-noord-lead text-noord-ink-muted">
                    Nothing matches “{query.trim()}”. Try a fabric, a colour or
                    a category.
                  </p>
                ) : (
                  <ul className="flex flex-col">
                    {results.map((entry) => (
                      <li key={entry.slug}>
                        <Link
                          href={entry.href}
                          onClick={() => {
                            reset()
                            close()
                          }}
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

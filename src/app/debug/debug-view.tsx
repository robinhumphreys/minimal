"use client"

import * as React from "react"

import { SearchIcon } from "lucide-react"
import { cn } from "cn"

import { SearchPanel, type SearchFn } from "@embed/search-assist"
import { SiteChatLayer, type ChatDriver } from "@embed/site-chat"
import type { AgentUIMessage, SearchResult } from "@/lib/agent/types"
import { readableOn } from "@/lib/config/contrast"
import type { AgentConfig } from "@/lib/config/schema"
import {
  DotField,
  groundFor,
} from "@/app/admin/[org]/agent/onboarding/_components/dot-field"

import type { Fixtures } from "./fixtures"

type Brand = { config: AgentConfig; fixtures: Fixtures }

export function DebugView({ brands }: { brands: Brand[] }) {
  return (
    <main className="flex flex-col gap-16 p-8">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl">Surfaces</h1>
        <p className="text-sm text-muted-foreground">
          Both surfaces, both brands, every state, on fixtures. Nothing here
          calls a model.
        </p>
      </header>

      {brands.map((brand) => (
        <BrandSection key={brand.config.id} brand={brand} />
      ))}
    </main>
  )
}

function BrandSection({ brand }: { brand: Brand }) {
  const { config, fixtures } = brand
  // The search panel sits straight on the ground, so it takes the ground as
  // its surface; the chat window carries its own.
  const grounded: AgentConfig = {
    ...config,
    theme: {
      ...config.theme,
      surface: groundFor(config.theme.surface, readableOn(config.theme.surface))
        .back,
    },
  }

  const answered = driver(fixtures.chat, "ready")
  const thinking = driver(fixtures.chat.slice(0, 3), "submitted")
  const failed: ChatDriver = {
    ...driver(fixtures.chat.slice(0, 1), "error"),
    error: new Error(
      "Unauthenticated request to AI Gateway. Set AI_GATEWAY_API_KEY.",
    ),
  }

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-lg">{config.name}</h2>

      <Row title="Site chat">
        <Box label="Desktop" config={config} size="desktop">
          <SiteChatLayer
            mode="absolute"
            config={config}
            chat={answered}
            open
            onOpenChange={() => {}}
          />
        </Box>
        <Box label="Mobile" config={config} size="mobile">
          <SiteChatLayer
            mode="absolute"
            config={config}
            chat={answered}
            open
            onOpenChange={() => {}}
          />
        </Box>
        <Box label="Thinking" config={config} size="mobile">
          <SiteChatLayer
            mode="absolute"
            config={config}
            chat={thinking}
            open
            onOpenChange={() => {}}
          />
        </Box>
        <Box label="Error" config={config} size="mobile">
          <SiteChatLayer
            mode="absolute"
            config={config}
            chat={failed}
            open
            onOpenChange={() => {}}
          />
        </Box>
      </Row>

      <Row title="Search assist">
        <Box label="Desktop" config={config} size="desktop">
          <Sheet config={config} query={fixtures.search.query} column="wide">
            <SearchPanel
              config={grounded}
              query={fixtures.search.query}
              search={canned(fixtures.keyword, fixtures.search)}
            />
          </Sheet>
        </Box>
        <Box label="Mobile" config={config} size="mobile">
          <Sheet config={config} query={fixtures.search.query} column="phone">
            <SearchPanel
              config={grounded}
              query={fixtures.search.query}
              search={canned(fixtures.keyword, fixtures.search)}
            />
          </Sheet>
        </Box>
        <Box label="Reading" config={config} size="mobile">
          <Sheet config={config} query={fixtures.search.query} column="phone">
            <SearchPanel
              config={grounded}
              query={fixtures.search.query}
              search={never}
            />
          </Sheet>
        </Box>
        <Box label="Keyword only" config={config} size="mobile">
          <Sheet config={config} query={fixtures.search.query} column="phone">
            <SearchPanel
              config={grounded}
              query={fixtures.search.query}
              search={canned(fixtures.keyword, fixtures.keyword)}
            />
          </Sheet>
        </Box>
      </Row>
    </section>
  )
}

/** A chat that has already happened. */
function driver(
  messages: AgentUIMessage[],
  status: ChatDriver["status"],
): ChatDriver {
  return {
    messages,
    status,
    send: () => {},
    stop: () => {},
    retry: () => {},
  }
}

/** Answers like the route would, a beat later, so the reading state shows. */
function canned(keyword: SearchResult, agent: SearchResult): SearchFn {
  return (request) =>
    new Promise((resolve) =>
      window.setTimeout(
        () =>
          resolve({
            ...(request.mode === "keyword" ? keyword : agent),
            query: request.query,
          }),
        request.mode === "keyword" ? 200 : 1400,
      ),
    )
}

/** Never answers: the reading state, held. */
const never: SearchFn = () => new Promise(() => {})

function Row({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm text-muted-foreground">{title}</h3>
      <div className="flex flex-wrap items-start gap-6">{children}</div>
    </div>
  )
}

/**
 * One stage: the brand's surface as a dot field, at a desktop's width or a
 * phone's. The same ground the onboarding previews stand on.
 */
function Box({
  label,
  config,
  size,
  children,
}: {
  label: string
  config: AgentConfig
  size: "desktop" | "mobile"
  children: React.ReactNode
}) {
  const ground = groundFor(
    config.theme.surface,
    readableOn(config.theme.surface),
  )

  return (
    <figure className="flex flex-col gap-2">
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border-2 border-foreground/10",
          size === "desktop" ? "h-[40rem] w-[46rem]" : "h-[40rem] w-[375px]",
        )}
      >
        <DotField
          className="absolute inset-0"
          back={ground.back}
          fill={ground.fill}
        />
        {children}
      </div>
      <figcaption className="text-xs text-muted-foreground">{label}</figcaption>
    </figure>
  )
}

/** The host's search sheet, stood in for: its box, then whatever is under it. */
function Sheet({
  config,
  query,
  column,
  children,
}: {
  config: AgentConfig
  query: string
  column: "wide" | "phone"
  children: React.ReactNode
}) {
  const ink = readableOn(config.theme.surface)

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-y-auto overscroll-contain",
        column === "wide" ? "px-6 pt-6" : "px-4 pt-4",
      )}
      style={{ color: ink }}
    >
      <div
        className={cn(
          "flex min-h-full flex-col",
          column === "wide" ? "mx-auto w-full max-w-2xl" : "w-full",
        )}
      >
        <div className="flex h-11 shrink-0 items-center gap-2 rounded-lg border border-current/20 px-3 text-sm">
          <SearchIcon className="size-4 shrink-0 opacity-60" />
          <span className="truncate">{query}</span>
        </div>
        {children}
      </div>
    </div>
  )
}

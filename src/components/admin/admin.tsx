"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BRAND_IDS, type BrandId } from "@/lib/catalog/types"
import type { AgentConfig, Entry, Position } from "@/lib/config/schema"
import { useAdminStore } from "@/lib/store/admin"

import { snippetFor } from "./snippet"

const THEME_FIELDS = [
  "accent",
  "surface",
  "radius",
  "fontBody",
  "fontDisplay",
  "density",
] as const

const ENTRIES: Entry[] = ["launcher", "bar", "recommendations"]
const POSITIONS: Position[] = ["bottom-right", "bottom-center", "bottom-left"]

export function Admin() {
  const active = useAdminStore((state) => state.active)
  const draft = useAdminStore((state) => state.drafts[state.active])
  const revision = useAdminStore((state) => state.revision)
  const hydrated = useAdminStore((state) => state.hydrated)
  const setActive = useAdminStore((state) => state.setActive)
  const editDraft = useAdminStore((state) => state.editDraft)
  const publish = useAdminStore((state) => state.publish)

  React.useEffect(() => {
    useAdminStore.getState().hydrate()
  }, [])

  const edit = React.useCallback(
    (recipe: (current: AgentConfig) => AgentConfig) =>
      editDraft(active, recipe),
    [active, editDraft],
  )

  return (
    <div className="flex flex-col gap-6 p-8 lg:flex-row">
      <div className="flex w-full max-w-xl flex-col gap-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl">Minimal</h1>
          <select
            className="h-8 rounded-lg border border-input px-2 text-sm"
            value={active}
            onChange={(event) => setActive(event.target.value as BrandId)}
          >
            {BRAND_IDS.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
          <Button onClick={() => publish(active)}>Publish</Button>
        </div>

        <Section title="Agent">
          <Field label="name">
            <Input
              value={draft.name}
              onChange={(event) =>
                edit((current) => ({ ...current, name: event.target.value }))
              }
            />
          </Field>
        </Section>

        <Section title="Theme">
          {THEME_FIELDS.map((field) => (
            <Field key={field} label={field}>
              <Input
                value={draft.theme[field]}
                onChange={(event) =>
                  edit((current) => ({
                    ...current,
                    theme: { ...current.theme, [field]: event.target.value },
                  }))
                }
              />
            </Field>
          ))}
        </Section>

        <Section title="Behaviour">
          <Field label="systemPrompt">
            <Textarea
              rows={4}
              value={draft.behaviour.systemPrompt}
              onChange={(event) =>
                edit((current) => ({
                  ...current,
                  behaviour: {
                    ...current.behaviour,
                    systemPrompt: event.target.value,
                  },
                }))
              }
            />
          </Field>
          <Field label="greeting">
            <Input
              value={draft.behaviour.greeting}
              onChange={(event) =>
                edit((current) => ({
                  ...current,
                  behaviour: {
                    ...current.behaviour,
                    greeting: event.target.value,
                  },
                }))
              }
            />
          </Field>
          <Field label="starterPrompts (one per line)">
            <Textarea
              rows={3}
              value={draft.behaviour.starterPrompts.join("\n")}
              onChange={(event) =>
                edit((current) => ({
                  ...current,
                  behaviour: {
                    ...current.behaviour,
                    starterPrompts: event.target.value
                      .split("\n")
                      .filter((line) => line.trim().length > 0),
                  },
                }))
              }
            />
          </Field>
          <Field label="model">
            <Input
              value={draft.behaviour.model}
              onChange={(event) =>
                edit((current) => ({
                  ...current,
                  behaviour: {
                    ...current.behaviour,
                    model: event.target.value,
                  },
                }))
              }
            />
          </Field>
        </Section>

        <Section title="Surface">
          <Field label="entry">
            <select
              className="h-8 w-full rounded-lg border border-input px-2 text-sm"
              value={draft.surface.entry}
              onChange={(event) =>
                edit((current) => ({
                  ...current,
                  surface: {
                    ...current.surface,
                    entry: event.target.value as Entry,
                  },
                }))
              }
            >
              {ENTRIES.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </Field>

          {draft.surface.entry === "launcher" ? (
            <Field label="position">
              <select
                className="h-8 w-full rounded-lg border border-input px-2 text-sm"
                value={draft.surface.position ?? "bottom-right"}
                onChange={(event) =>
                  edit((current) => ({
                    ...current,
                    surface: {
                      ...current.surface,
                      position: event.target.value as Position,
                    },
                  }))
                }
              >
                {POSITIONS.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </Field>
          ) : null}
        </Section>

        <Section title="Snippet">
          <Textarea readOnly rows={3} value={snippetFor(draft)} />
        </Section>
      </div>

      {/* Keyed on the brand so switching accounts resets the load handshake. */}
      <Preview
        key={active}
        id={active}
        config={draft}
        revision={revision}
        ready={hydrated}
      />
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg">{title}</h2>
      {children}
    </section>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}

function Preview({
  id,
  config,
  revision,
  ready,
}: {
  id: BrandId
  config: AgentConfig
  revision: number
  ready: boolean
}) {
  const frame = React.useRef<HTMLIFrameElement>(null)
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    if (!loaded || !ready) return
    frame.current?.contentWindow?.postMessage(
      { type: "minimal:preview", config },
      window.location.origin,
    )
  }, [config, loaded, ready, revision])

  return (
    <iframe
      ref={frame}
      title={`${id} preview`}
      src={`/${id}`}
      className="h-[48rem] w-full border"
      onLoad={() => setLoaded(true)}
    />
  )
}

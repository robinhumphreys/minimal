"use client"

import * as React from "react"

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

import {
  AVATARS,
  DENSITIES,
  FONTS,
  GUIDE_SIDES,
  HEADERS,
  ICON_STYLES,
  LAUNCHER_ICONS,
  PLACEMENTS,
  RATIOS,
  ROUNDNESS,
  SHAPES,
  SIZES,
  SPELLINGS,
  THINKING,
  VOICES,
  type SiteChatSettings,
} from "./site-chat"

/**
 * Each surface has options of its own; the chat beside them edits the same
 * settings by name. Every form is the shadcn Field primitives: label,
 * description, control, grouped under a legend.
 */

type OptionsProps = {
  settings: SiteChatSettings
  onChange: (next: SiteChatSettings) => void
  /** Whether the surface's own on/off switch is offered here. */
  switchable?: boolean
}

function useSet({ settings, onChange }: OptionsProps) {
  return <K extends keyof SiteChatSettings>(
    key: K,
    value: SiteChatSettings[K],
  ) => onChange({ ...settings, [key]: value })
}

export function SiteChatOptions(props: OptionsProps) {
  const { settings, switchable } = props
  const set = useSet(props)

  return (
    <Form>
      {switchable ? (
        <OnOff
          label="Site chat"
          on={settings.siteChat}
          onChange={(on) => set("siteChat", on)}
        />
      ) : null}

      <FieldSet>
        <FieldLegend className="font-heading text-base font-semibold tracking-tight">
          Conversation
        </FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="greeting">Opening message</FieldLabel>
            <Textarea
              id="greeting"
              rows={3}
              className="ring-inset"
              value={settings.greeting}
              onChange={(event) => set("greeting", event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="starters">Suggested questions</FieldLabel>
            <FieldDescription>
              Shown as taps under the opening message. One per line.
            </FieldDescription>
            <Textarea
              id="starters"
              rows={3}
              className="ring-inset"
              value={settings.starters.join("\n")}
              onChange={(event) => set("starters", lines(event.target.value))}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="chat-placeholder">Empty composer</FieldLabel>
            <FieldDescription>
              What the box says before they type.
            </FieldDescription>
            <Input
              id="chat-placeholder"
              className="ring-inset"
              value={settings.chatPlaceholder}
              onChange={(event) => set("chatPlaceholder", event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Tone of voice</FieldLabel>
            <Choices
              options={VOICES}
              value={settings.voice}
              onSelect={(value) => set("voice", value)}
            />
          </Field>
          <Field>
            <FieldLabel>Spelling</FieldLabel>
            <Choices
              options={SPELLINGS}
              value={settings.spelling}
              onSelect={(value) => set("spelling", value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="language">Language</FieldLabel>
            <FieldDescription>
              The agent answers in the shopper&rsquo;s language; this is the
              fallback.
            </FieldDescription>
            <Input
              id="language"
              className="ring-inset"
              value={settings.language}
              onChange={(event) => set("language", event.target.value)}
            />
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend className="font-heading text-base font-semibold tracking-tight">
          Identity
        </FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="assistant-name">Name</FieldLabel>
            <Input
              id="assistant-name"
              className="ring-inset"
              value={settings.assistantName}
              placeholder="Your brand's name"
              onChange={(event) => set("assistantName", event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="subtitle">Subtitle</FieldLabel>
            <Input
              id="subtitle"
              className="ring-inset"
              value={settings.subtitle}
              placeholder="None"
              onChange={(event) => set("subtitle", event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Avatar</FieldLabel>
            <Choices
              options={AVATARS}
              value={settings.avatar}
              onSelect={(value) => set("avatar", value)}
            />
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend className="font-heading text-base font-semibold tracking-tight">
          Chat button
        </FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>Placement</FieldLabel>
            <Choices
              options={PLACEMENTS}
              value={settings.placement}
              onSelect={(value) => set("placement", value)}
            />
          </Field>
          <Field>
            <FieldLabel>Shape</FieldLabel>
            <Choices
              options={SHAPES}
              value={settings.shape}
              onSelect={(value) => set("shape", value)}
            />
          </Field>
          <Field>
            <FieldLabel>Size</FieldLabel>
            <Choices
              options={SIZES}
              value={settings.size}
              onSelect={(value) => set("size", value)}
            />
          </Field>
          <Field>
            <FieldLabel>Icon</FieldLabel>
            <Choices
              options={LAUNCHER_ICONS}
              value={settings.icon}
              onSelect={(value) => set("icon", value)}
            />
          </Field>
          <Field>
            <FieldLabel>Icon style</FieldLabel>
            <Choices
              options={ICON_STYLES}
              value={settings.iconStyle}
              onSelect={(value) => set("iconStyle", value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="label">Label</FieldLabel>
            <Input
              id="label"
              className="ring-inset"
              value={settings.label}
              placeholder="Icon only"
              onChange={(event) => set("label", event.target.value)}
            />
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend className="font-heading text-base font-semibold tracking-tight">
          Chat window
        </FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="accent">Accent</FieldLabel>
            {/* One field, not a swatch parked beside one. The native colour
                input draws its own bevelled box that nothing in this admin
                matches, so it is laid over a plain disc at zero opacity and
                only the disc is ever seen. */}
            <InputGroup className="ring-inset">
              <InputGroupAddon align="inline-start">
                <span
                  style={{ backgroundColor: settings.accent }}
                  className="relative size-4 shrink-0 rounded-full ring-1 ring-black/10 ring-inset"
                >
                  <input
                    type="color"
                    aria-label="Accent colour"
                    value={settings.accent}
                    onChange={(event) => set("accent", event.target.value)}
                    className="absolute inset-0 size-full cursor-pointer opacity-0"
                  />
                </span>
              </InputGroupAddon>
              <InputGroupInput
                id="accent"
                value={settings.accent}
                onChange={(event) => set("accent", event.target.value)}
              />
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel>Header</FieldLabel>
            <Choices
              options={HEADERS}
              value={settings.header}
              onSelect={(value) => set("header", value)}
            />
          </Field>
          <Field>
            <FieldLabel>Corners</FieldLabel>
            <Choices
              options={ROUNDNESS}
              value={settings.roundness}
              onSelect={(value) => set("roundness", value)}
            />
          </Field>
          <Field>
            <FieldLabel>Font</FieldLabel>
            <Choices
              options={FONTS}
              value={settings.font}
              onSelect={(value) => set("font", value)}
            />
          </Field>
          <Field>
            <FieldLabel>Spacing</FieldLabel>
            <Choices
              options={DENSITIES}
              value={settings.density}
              onSelect={(value) => set("density", value)}
            />
          </Field>
          <Field>
            <FieldLabel>While it works</FieldLabel>
            <Choices
              options={THINKING}
              value={settings.thinking}
              onSelect={(value) => set("thinking", value)}
            />
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend className="font-heading text-base font-semibold tracking-tight">
          Product cards
        </FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>Image shape</FieldLabel>
            <Choices
              options={RATIOS}
              value={settings.ratio}
              onSelect={(value) => set("ratio", value)}
            />
          </Field>
          <Field>
            <FieldLabel>On cards</FieldLabel>
            <div className="flex flex-col gap-2">
              <Toggle
                label="Price"
                on={settings.price}
                onToggle={() => set("price", !settings.price)}
              />
              <Toggle
                label="Rating"
                on={settings.rating}
                onToggle={() => set("rating", !settings.rating)}
              />
            </div>
          </Field>
          <Field>
            <FieldLabel>Picks per answer</FieldLabel>
            <Choices
              options={[
                { value: "2", label: "Two" },
                { value: "3", label: "Three" },
                { value: "4", label: "Four" },
              ]}
              value={String(settings.picks)}
              onSelect={(value) => set("picks", Number(value))}
            />
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend className="font-heading text-base font-semibold tracking-tight">
          Behaviour
        </FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>Nudge</FieldLabel>
            <FieldDescription>
              Pops the opening message up beside the closed button.
            </FieldDescription>
            <Choices
              options={[
                { value: "0", label: "Never" },
                { value: "5", label: "After 5s" },
                { value: "15", label: "After 15s" },
                { value: "30", label: "After 30s" },
              ]}
              value={String(settings.nudge)}
              onSelect={(value) => set("nudge", Number(value))}
            />
          </Field>
          <Field>
            <FieldLabel>Product pages</FieldLabel>
            <Toggle
              label="Open the window by itself"
              on={settings.openOnProductPages}
              onToggle={() =>
                set("openOnProductPages", !settings.openOnProductPages)
              }
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="hidden-paths">Stay off these paths</FieldLabel>
            <FieldDescription>
              Path prefixes, one per line, e.g. /checkout.
            </FieldDescription>
            <Textarea
              id="hidden-paths"
              rows={2}
              className="ring-inset"
              value={settings.hiddenPaths.join("\n")}
              onChange={(event) =>
                set("hiddenPaths", lines(event.target.value))
              }
            />
          </Field>
        </FieldGroup>
      </FieldSet>
    </Form>
  )
}

export function SearchAssistOptions(props: OptionsProps) {
  const { settings, switchable } = props
  const set = useSet(props)

  return (
    <Form>
      {switchable ? (
        <OnOff
          label="Search assist"
          on={settings.searchAssist}
          onChange={(on) => set("searchAssist", on)}
        />
      ) : null}
      <FieldSet>
        <FieldLegend className="font-heading text-base font-semibold tracking-tight">
          Search box
        </FieldLegend>
        <FieldDescription>
          The shop&rsquo;s own search box stays where it is. What appears under
          it is the agent&rsquo;s reading of the search: what it took the words
          to mean, the products, one line, and a way to refine. It speaks in the
          same voice, and shows the same cards, as the site chat.
        </FieldDescription>
      </FieldSet>
    </Form>
  )
}

export function ProductHelpOptions(props: OptionsProps) {
  const { settings, switchable } = props
  const set = useSet(props)

  return (
    <Form>
      {switchable ? (
        <OnOff
          label="Product help"
          on={settings.productHelp}
          onChange={(on) => set("productHelp", on)}
        />
      ) : null}
      <FieldSet>
        <FieldLegend className="font-heading text-base font-semibold tracking-tight">
          Product help
        </FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="guide-label">Button text</FieldLabel>
            <FieldDescription>On the trigger the site places.</FieldDescription>
            <Input
              id="guide-label"
              className="ring-inset"
              value={settings.guideLabel}
              onChange={(event) => set("guideLabel", event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="guide-greeting">First line</FieldLabel>
            <FieldDescription>Before the first question.</FieldDescription>
            <Textarea
              id="guide-greeting"
              rows={2}
              className="ring-inset"
              value={settings.guideGreeting}
              onChange={(event) => set("guideGreeting", event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Panel side</FieldLabel>
            <FieldDescription>
              On a wide screen. Phones get a sheet from the bottom.
            </FieldDescription>
            <Choices
              options={GUIDE_SIDES}
              value={settings.guideSide}
              onSelect={(value) => set("guideSide", value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="guide-placeholder">Answer box</FieldLabel>
            <FieldDescription>For typing instead of tapping.</FieldDescription>
            <Input
              id="guide-placeholder"
              className="ring-inset"
              value={settings.guidePlaceholder}
              onChange={(event) => set("guidePlaceholder", event.target.value)}
            />
          </Field>
        </FieldGroup>
      </FieldSet>
    </Form>
  )
}

function Form({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto pr-1">
      {children}
    </div>
  )
}

/** The surface's own switch, at the top of its options on the management screen. */
function OnOff({
  label,
  on,
  onChange,
}: {
  label: string
  on: boolean
  onChange: (on: boolean) => void
}) {
  return (
    <Field orientation="horizontal" className="rounded-lg border p-3">
      <FieldLabel className="flex-1">{label}</FieldLabel>
      <Choices
        options={[
          { value: "on", label: "On" },
          { value: "off", label: "Off" },
        ]}
        value={on ? "on" : "off"}
        onSelect={(value) => onChange(value === "on")}
      />
    </Field>
  )
}

function lines(value: string): string[] {
  return value.split("\n").filter((line) => line.trim().length > 0)
}

/** A checkbox with its label: a setting that is on or off. */
function Toggle({
  label,
  on,
  onToggle,
}: {
  label: string
  on: boolean
  onToggle: () => void
}) {
  const id = React.useId()
  return (
    <div className="flex items-center gap-3">
      <Checkbox id={id} checked={on} onCheckedChange={onToggle} />
      <Label htmlFor={id} className="font-normal">
        {label}
      </Label>
    </div>
  )
}

/** A radio group: one of a few, each on its own line. */
function Choices<T extends string>({
  options,
  value,
  onSelect,
}: {
  options: { value: T; label: string }[]
  value: T
  onSelect: (value: T) => void
}) {
  const id = React.useId()
  return (
    <RadioGroup
      value={value}
      onValueChange={(next) => onSelect(next as T)}
      className="w-fit gap-2"
    >
      {options.map((option) => (
        <div key={option.value} className="flex items-center gap-3">
          <RadioGroupItem value={option.value} id={`${id}-${option.value}`} />
          <Label htmlFor={`${id}-${option.value}`} className="font-normal">
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}

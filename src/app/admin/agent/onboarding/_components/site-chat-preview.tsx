"use client"

import * as React from "react"

import {
  ChatCircleIcon,
  QuestionIcon,
  SparkleIcon,
} from "@phosphor-icons/react/ssr"
import { ArrowUpIcon, XIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "cn"

import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Message, MessageContent, MessageGroup } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"

import { DotField } from "./dot-field"
import { readableOn } from "@/lib/config/contrast"

import type { LauncherIcon, SiteChatSettings } from "./site-chat"

/**
 * Phosphor rather than Lucide because it ships both weights of the same glyph,
 * which is what makes solid and outline a setting rather than two icon sets.
 */
const ICONS: Record<
  LauncherIcon,
  React.ComponentType<{ className?: string; weight?: "fill" | "regular" }>
> = {
  chat: ChatCircleIcon,
  sparkles: SparkleIcon,
  help: QuestionIcon,
}

/** Where the widget sits on the merchant's page, and which way it opens. */
const ANCHORS: Record<SiteChatSettings["placement"], string> = {
  "bottom-right": "right-6 bottom-6 items-end",
  "bottom-center": "left-1/2 bottom-6 -translate-x-1/2 items-center",
  "bottom-left": "left-6 bottom-6 items-start",
}

/**
 * The left half: the widget as a shopper would meet it, on a stand-in for the
 * merchant's page. Live rather than a picture — the launcher opens, so the
 * merchant can check the thing they are about to embed actually behaves.
 */
export function SiteChatPreview({ settings }: { settings: SiteChatSettings }) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="relative h-full overflow-hidden rounded-lg">
      <DotField className="absolute inset-0" />

      <div
        className={cn(
          "absolute z-10 flex flex-col gap-3",
          ANCHORS[settings.placement],
        )}
      >
        <AnimatePresence>
          {open ? (
            <ChatWindow settings={settings} onClose={() => setOpen(false)} />
          ) : null}
        </AnimatePresence>

        <Launcher
          settings={settings}
          open={open}
          onClick={() => setOpen((value) => !value)}
        />
      </div>
    </div>
  )
}

/** The floating button itself, in the merchant's own accent. */
function Launcher({
  settings,
  open,
  onClick,
}: {
  settings: SiteChatSettings
  open: boolean
  onClick: () => void
}) {
  const Icon = ICONS[settings.icon]

  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-label={open ? "Close chat" : settings.label || "Open chat"}
      style={{
        backgroundColor: settings.accent,
        color: readableOn(settings.accent),
      }}
      className={cn(
        "flex items-center gap-2 text-sm font-medium shadow-lg transition-transform hover:scale-105",
        settings.label
          ? "h-12 rounded-full px-5"
          : "size-14 justify-center rounded-full",
      )}
    >
      {open ? (
        <XIcon className="size-5" />
      ) : (
        <Icon
          className="size-6"
          weight={settings.iconStyle === "solid" ? "fill" : "regular"}
        />
      )}
      {settings.label ? <span>{settings.label}</span> : null}
    </button>
  )
}

/**
 * The panel the launcher opens, at the size it would really be.
 *
 * A `Card` rather than a hand-rolled box: the header/content/footer split, the
 * spacing scale and the footer's own surface all come from the design system,
 * which is the difference between a chat window and a div with a border on it.
 * Only the header's colour is the merchant's.
 */
function ChatWindow({
  settings,
  onClose,
}: {
  settings: SiteChatSettings
  onClose: () => void
}) {
  return (
    <MessageScrollerProvider>
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="max-h-[calc(100%-5rem)] w-[21rem] max-w-full"
      >
        <Card
          size="sm"
          // Corners follow the merchant's own radius token, the same as every
          // other rounded thing the agent draws on their site.
          style={{ borderRadius: `calc(${settings.radius} + 0.5rem)` }}
          className="h-[26rem] gap-0 py-0 shadow-2xl"
        >
          {/* Laid out as a flex row rather than `CardHeader`'s own grid: that
              grid re-columns itself when a `CardAction` is present, which puts
              the avatar in a stretched first column and strands the name from
              it. A row of three is what this header actually is. */}
          <CardHeader
            style={{
              backgroundColor: settings.accent,
              color: readableOn(settings.accent),
            }}
            className="flex items-center gap-3 py-3"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-current/20 text-xs font-medium">
              A
            </div>
            <div className="flex min-w-0 flex-col">
              <CardTitle className="text-sm">Assistant</CardTitle>
              <CardDescription className="text-xs text-current/70">
                Usually replies straight away
              </CardDescription>
            </div>
            <CardAction className="ml-auto self-center">
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={onClose}
                aria-label="Close chat"
                className="text-current hover:bg-current/15"
              >
                <XIcon />
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden p-0">
            <MessageScroller>
              <MessageScrollerViewport>
                <MessageScrollerContent className="gap-4 p-(--card-spacing)">
                  <MessageScrollerItem>
                    <MessageGroup>
                      <Message>
                        <MessageContent>
                          <Bubble variant="muted">
                            <BubbleContent>{settings.greeting}</BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageGroup>
                  </MessageScrollerItem>

                  {settings.starters.length > 0 ? (
                    <MessageScrollerItem>
                      {/* Aligned to the shopper's side: these are things they
                          would say, not things the agent has said. */}
                      <Message align="end">
                        <MessageContent>
                          <BubbleGroup>
                            {settings.starters.map((starter) => (
                              <Bubble
                                key={starter}
                                align="end"
                                variant="outline"
                              >
                                <BubbleContent
                                  render={<button type="button" />}
                                >
                                  {starter}
                                </BubbleContent>
                              </Bubble>
                            ))}
                          </BubbleGroup>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  ) : null}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </CardContent>

          <CardFooter className="flex-col gap-2">
            <InputGroup className="rounded-2xl border-transparent bg-muted ring-inset">
              <InputGroupTextarea
                placeholder="Ask anything…"
                rows={1}
                // Its own block above the control row, the way the native
                // composer is laid out.
                className="max-h-28 min-h-14 px-3 py-2.5"
              />
              <InputGroupAddon align="block-end" className="px-2 pb-2">
                <InputGroupButton
                  variant="default"
                  size="icon-sm"
                  style={{
                    backgroundColor: settings.accent,
                    color: readableOn(settings.accent),
                  }}
                  className="ml-auto"
                >
                  <ArrowUpIcon />
                  <span className="sr-only">Send</span>
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </CardFooter>
        </Card>
      </motion.div>
    </MessageScrollerProvider>
  )
}

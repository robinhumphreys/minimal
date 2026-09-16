"use client"

import Image from "next/image"
import Link from "next/link"
import { CheckIcon, MinusIcon, PlusIcon, TrashIcon } from "lucide-react"

import {
  bagCount,
  bagSavings,
  bagSubtotal,
  useBag,
  type BagLine,
} from "@/lib/volta/bag"
import { formatPrice } from "@/lib/volta/format"
import { useOverlays } from "@/lib/volta/overlays"
import {
  DELIVERY_FEE,
  PROMISES,
  freeDeliveryProgress,
  toFreeDelivery,
} from "@/lib/volta/promotions"

import { Button } from "@/components/volta/ui/button"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/volta/ui/sheet"

/**
 * The shopping bag.
 *
 * A panel from `sm` up rather than a route: the shopper is mid-browse, and
 * sending them to a page to check the bag costs them their place. The free
 * delivery meter at the top is the whole reason the threshold lives in
 * `promotions.ts` — it has to be readable on the client.
 */
export function BagOverlay() {
  const open = useOverlays((state) => state.open) === "bag"
  const toggle = useOverlays((state) => state.toggle)
  const close = useOverlays((state) => state.close)

  const lines = useBag((state) => state.lines)
  const hydrated = useBag((state) => state.hydrated)

  // Before rehydration the store is empty, which would flash "your bag is
  // empty" over a bag that is not.
  const shown = hydrated ? lines : []
  const count = bagCount(shown)
  const subtotal = bagSubtotal(shown)
  const savings = bagSavings(shown)
  const remaining = toFreeDelivery(subtotal)
  const delivery = remaining === 0 ? 0 : DELIVERY_FEE

  return (
    <Sheet open={open} onOpenChange={(next) => toggle("bag", next)}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>
            Bag{" "}
            <span className="text-volta-ash tabular-nums">({count})</span>
          </SheetTitle>
        </SheetHeader>

        {count > 0 && (
          <DeliveryMeter subtotal={subtotal} remaining={remaining} />
        )}

        <SheetBody>
          {!hydrated || count === 0 ? (
            <EmptyBag onBrowse={close} />
          ) : (
            <ul className="volta-gutter flex flex-col">
              {shown.map((line) => (
                <BagRow key={`${line.slug}:${line.flavour}`} line={line} />
              ))}
            </ul>
          )}
        </SheetBody>

        {count > 0 && (
          <SheetFooter
            // The embed fixes its agent bar to the bottom of the viewport, over
            // the sheet. The extra padding keeps checkout clear of it.
            className="flex flex-col gap-3 pb-volta-agent-bar"
          >
            <dl className="flex flex-col gap-1.5 text-volta-body">
              <Row label="Subtotal" value={formatPrice(subtotal)} />
              {savings > 0 && (
                <Row
                  label="You save"
                  value={`−${formatPrice(savings)}`}
                  tone="heat"
                />
              )}
              <Row
                label="Delivery"
                value={delivery === 0 ? "Free" : formatPrice(delivery)}
                tone={delivery === 0 ? "volt" : undefined}
              />
              <div className="mt-1 flex items-baseline justify-between border-t border-volta-line pt-3">
                <dt className="volta-wide text-volta-label text-volta-chalk">
                  Total
                </dt>
                <dd className="volta-wide text-xl text-volta-chalk tabular-nums">
                  {formatPrice(subtotal + delivery)}
                </dd>
              </div>
            </dl>

            <Button variant="volt" size="block">
              Checkout
            </Button>

            <p className="text-center text-volta-micro tracking-volta-wide text-volta-smoke uppercase">
              Taxes included · 30-day returns
            </p>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}

/** The progress meter: the single highest-converting thing in a bag panel. */
function DeliveryMeter({
  subtotal,
  remaining,
}: {
  subtotal: number
  remaining: number
}) {
  const progress = freeDeliveryProgress(subtotal)
  const unlocked = remaining === 0

  return (
    <div className="volta-gutter shrink-0 border-b border-volta-line bg-volta-carbon py-3">
      <p className="volta-wide flex items-center gap-1.5 text-volta-micro">
        {unlocked ? (
          <>
            <CheckIcon className="size-3.5 shrink-0 text-volta-volt" />
            <span className="text-volta-volt">Delivery is on us</span>
          </>
        ) : (
          <span className="text-volta-chalk">
            {formatPrice(remaining)} to free delivery
          </span>
        )}
      </p>
      <div
        className="mt-2 h-1 w-full overflow-hidden rounded-volta-pill bg-volta-steel"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progress to free delivery"
      >
        <div
          className="h-full rounded-volta-pill bg-volta-volt transition-[width] duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

function BagRow({ line }: { line: BagLine }) {
  const setQuantity = useBag((state) => state.setQuantity)
  const remove = useBag((state) => state.remove)
  const close = useOverlays((state) => state.close)

  return (
    <li className="flex gap-4 border-b border-volta-line py-4">
      <Link
        href={line.href}
        onClick={close}
        className="relative size-24 shrink-0 overflow-hidden rounded-volta bg-white"
      >
        <Image
          src={line.image}
          alt={line.name}
          fill
          sizes="96px"
          className="object-contain p-2"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link
          href={line.href}
          onClick={close}
          className="volta-wide text-volta-body text-volta-chalk hover:text-volta-volt"
        >
          {line.name}
        </Link>
        <p className="text-volta-micro tracking-volta-wide text-volta-ash uppercase">
          {[line.flavour, line.size].filter(Boolean).join(" · ")}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <div className="flex items-center rounded-volta border border-volta-line">
            <StepButton
              label={`Decrease quantity of ${line.name}`}
              onClick={() =>
                setQuantity(line.slug, line.flavour, line.quantity - 1)
              }
            >
              {line.quantity === 1 ? (
                <TrashIcon className="size-3.5" />
              ) : (
                <MinusIcon className="size-3.5" />
              )}
            </StepButton>
            <span className="w-8 text-center text-volta-body text-volta-chalk tabular-nums">
              {line.quantity}
            </span>
            <StepButton
              label={`Increase quantity of ${line.name}`}
              onClick={() =>
                setQuantity(line.slug, line.flavour, line.quantity + 1)
              }
            >
              <PlusIcon className="size-3.5" />
            </StepButton>
          </div>

          <div className="flex flex-col items-end">
            {line.compareAt && (
              <s className="text-volta-micro text-volta-smoke tabular-nums">
                {formatPrice(line.compareAt * line.quantity)}
              </s>
            )}
            <span className="volta-wide text-volta-body text-volta-chalk tabular-nums">
              {formatPrice(line.price * line.quantity)}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => remove(line.slug, line.flavour)}
        aria-label={`Remove ${line.name}`}
        className="-mt-1 -mr-1 size-8 shrink-0 self-start text-volta-smoke transition-colors hover:text-volta-heat"
      >
        <TrashIcon className="mx-auto size-4" />
      </button>
    </li>
  )
}

function StepButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-9 items-center justify-center text-volta-chalk transition-colors hover:text-volta-volt focus-visible:ring-2 focus-visible:ring-volta-volt focus-visible:outline-none"
    >
      {children}
    </button>
  )
}

function EmptyBag({ onBrowse }: { onBrowse: () => void }) {
  return (
    <div className="volta-gutter flex flex-col gap-8 py-12">
      <div className="volta-hatch flex aspect-3/2 items-center justify-center rounded-volta border border-volta-line">
        <p className="volta-display text-center text-3xl leading-none text-volta-line-strong">
          Nothing
          <br />
          in here
        </p>
      </div>

      <Button
        variant="volt"
        size="block"
        render={<Link href="/volta" onClick={onBrowse} />}
      >
        Start shopping
      </Button>

      <ul className="flex flex-col gap-4 border-t border-volta-line pt-6">
        {PROMISES.map((promise) => (
          <li key={promise.title} className="flex gap-3">
            <CheckIcon className="mt-0.5 size-4 shrink-0 text-volta-volt" />
            <div className="flex flex-col gap-0.5">
              <span className="volta-wide text-volta-micro text-volta-chalk">
                {promise.title}
              </span>
              <span className="text-volta-body text-volta-ash">
                {promise.body}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Row({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: "volt" | "heat"
}) {
  return (
    <div className="flex items-baseline justify-between">
      <dt className="text-volta-ash">{label}</dt>
      <dd
        className={
          tone === "volt"
            ? "text-volta-volt tabular-nums"
            : tone === "heat"
              ? "text-volta-heat tabular-nums"
              : "text-volta-chalk tabular-nums"
        }
      >
        {value}
      </dd>
    </div>
  )
}

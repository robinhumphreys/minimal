"use client"

import Image from "next/image"
import Link from "next/link"
import { MinusIcon, PlusIcon, XIcon } from "lucide-react"

import { Button } from "@/components/noord/ui/button"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/noord/ui/sheet"
import { bagCount, bagSubtotal, useBag, type BagLine } from "@/lib/noord/bag"
import { formatPrice } from "@/lib/noord/format"
import { useOverlays } from "@/lib/noord/overlays"
import { sizeLabel } from "@/lib/noord/sizing"

/** Free shipping threshold, in cents. */
const FREE_SHIPPING_FROM = 15000

/** The shopping bag: full-screen on a phone, a right-hand panel from `sm` up. */
export function BagOverlay() {
  const open = useOverlays((state) => state.open) === "bag"
  const toggle = useOverlays((state) => state.toggle)
  const close = useOverlays((state) => state.close)

  const lines = useBag((state) => state.lines)
  const hydrated = useBag((state) => state.hydrated)
  const setQuantity = useBag((state) => state.setQuantity)
  const remove = useBag((state) => state.remove)

  const visible = hydrated ? lines : []
  const count = bagCount(visible)
  const subtotal = bagSubtotal(visible)
  const shortfall = FREE_SHIPPING_FROM - subtotal

  return (
    <Sheet open={open} onOpenChange={(next) => toggle("bag", next)}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Shopping bag</SheetTitle>
        </SheetHeader>

        <SheetBody>
          {count === 0 ? (
            // Centred rather than parked at the top: an outlined button in the
            // corner of an otherwise empty panel reads as a dead end. The CTA
            // takes the same full-width solid treatment as Checkout, so the
            // empty bag has the same weight as a full one.
            <div className="noord-sheet-gutter flex h-full flex-col items-start justify-center gap-4 pb-16">
              <p className="text-noord-title">Your bag is empty.</p>
              <p className="text-noord-body text-noord-ink-muted">
                Pieces you add will stay here between visits.
              </p>
              <Button
                render={<Link href="/noord" onClick={close} />}
                size="block"
                className="mt-3"
              >
                Continue shopping
              </Button>
            </div>
          ) : (
            <ul className="noord-sheet-gutter divide-y divide-noord-line">
              {visible.map((line) => (
                <BagRow
                  key={`${line.slug}:${line.size}`}
                  line={line}
                  onNavigate={close}
                  onQuantity={(quantity) =>
                    setQuantity(line.slug, line.size, quantity)
                  }
                  onRemove={() => remove(line.slug, line.size)}
                />
              ))}
            </ul>
          )}
        </SheetBody>

        {count > 0 && (
          <SheetFooter className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between">
              <span className="text-noord-label uppercase">Subtotal</span>
              <span className="text-noord-title tabular-nums">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="text-noord-micro tracking-normal text-noord-ink-muted normal-case">
              {shortfall > 0
                ? `${formatPrice(shortfall)} from free shipping.`
                : "Free shipping and free returns included."}
            </p>
            <Button size="block">Checkout</Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}

function BagRow({
  line,
  onNavigate,
  onQuantity,
  onRemove,
}: {
  line: BagLine
  onNavigate: () => void
  onQuantity: (quantity: number) => void
  onRemove: () => void
}) {
  return (
    <li className="flex gap-4 py-5">
      <Link
        href={line.href}
        onClick={onNavigate}
        className="relative aspect-[3/4] w-20 shrink-0 overflow-hidden bg-noord-wash"
      >
        <Image
          src={line.image}
          alt=""
          fill
          sizes="5rem"
          className="object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={line.href}
            onClick={onNavigate}
            className="text-noord-body text-noord-ink hover:underline"
          >
            {line.name}
          </Link>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${line.name}`}
            className="-mt-1 -mr-1 shrink-0 p-1 text-noord-ink-faint transition-colors hover:text-noord-ink"
          >
            <XIcon className="size-4" strokeWidth={1.5} />
          </button>
        </div>

        <span className="text-noord-micro text-noord-ink-muted uppercase">
          {sizeLabel(line.size)}
        </span>

        <div className="mt-1 flex items-center justify-between gap-3">
          <div className="flex items-center border border-noord-line">
            <StepButton
              label="Decrease quantity"
              onClick={() => onQuantity(line.quantity - 1)}
            >
              <MinusIcon className="size-3.5" strokeWidth={1.5} />
            </StepButton>
            <span className="w-8 text-center text-noord-body tabular-nums">
              {line.quantity}
            </span>
            <StepButton
              label="Increase quantity"
              onClick={() => onQuantity(line.quantity + 1)}
            >
              <PlusIcon className="size-3.5" strokeWidth={1.5} />
            </StepButton>
          </div>

          <span className="text-noord-body tabular-nums">
            {line.compareAt && (
              <s className="mr-2 text-noord-ink-faint">
                {formatPrice(line.compareAt * line.quantity)}
              </s>
            )}
            {formatPrice(line.price * line.quantity)}
          </span>
        </div>
      </div>
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
      className="flex size-9 items-center justify-center text-noord-ink transition-colors hover:bg-noord-wash"
    >
      {children}
    </button>
  )
}

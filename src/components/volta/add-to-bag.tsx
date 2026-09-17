"use client"

import * as React from "react"
import { CheckIcon, MinusIcon, PlusIcon } from "@phosphor-icons/react/ssr"

import { useBag, type BagLine } from "@/lib/volta/bag"
import { flavourOptions } from "@/lib/volta/flavours"
import { useOverlays } from "@/lib/volta/overlays"

import { Button } from "@/components/volta/ui/button"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/volta/ui/toggle-group"

const MAX_QUANTITY = 10

/**
 * Adding opens the bag rather than showing a toast: the bag is the
 * confirmation, and it surfaces the free-delivery meter right away.
 */
export function AddToBag({
  line,
  form,
  flavour: catalogFlavour,
}: {
  /** The product, minus the two things this component chooses. */
  line: Omit<BagLine, "flavour" | "quantity">
  /** `attributes.form`, which decides what flavours are on offer. */
  form?: string
  /** `attributes.flavour`, the real one, always first and selected. */
  flavour?: string
}) {
  const add = useBag((state) => state.add)
  const show = useOverlays((state) => state.show)

  const options = React.useMemo(
    () => flavourOptions(form, catalogFlavour),
    [form, catalogFlavour],
  )

  const [flavour, setFlavour] = React.useState(options[0])
  const [quantity, setQuantity] = React.useState(1)

  return (
    <div className="flex flex-col gap-5">
      {options.length > 1 && (
        <div className="flex flex-col gap-2.5">
          {/* No readout beside the heading: the selected chip is already lit. */}
          <h2 className="volta-wide text-volta-micro text-volta-smoke">
            Flavour
          </h2>
          <ToggleGroup
            value={[flavour]}
            onValueChange={(next) => {
              // An empty array means the shopper untoggled the current
              // choice, not a state a flavour picker should have.
              if (next.length > 0) setFlavour(String(next[0]))
            }}
            multiple={false}
          >
            {options.map((option) => (
              <ToggleGroupItem key={option} value={option}>
                {option}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      )}

      <div className="flex gap-3">
        <div className="flex shrink-0 items-center rounded-volta border-2 border-volta-line">
          <StepButton
            label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <MinusIcon className="size-4" />
          </StepButton>
          <span className="w-10 text-center text-volta-title text-volta-chalk tabular-nums">
            {quantity}
          </span>
          <StepButton
            label="Increase quantity"
            disabled={quantity >= MAX_QUANTITY}
            onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
          >
            <PlusIcon className="size-4" />
          </StepButton>
        </div>

        <Button
          variant="volt"
          size="block"
          // `block` is full-width by default; here it shares the row instead.
          className="w-auto flex-1"
          onClick={() => {
            add({ ...line, flavour, quantity })
            setQuantity(1)
            show("bag")
          }}
        >
          Add to cart
        </Button>
      </div>

      <p className="flex items-center gap-2 text-volta-micro text-volta-ash">
        <CheckIcon className="size-3.5 shrink-0 text-volta-volt" />
        In stock — shipped today
      </p>
    </div>
  )
}

function StepButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex size-12 items-center justify-center text-volta-chalk transition-colors hover:text-volta-volt focus-visible:ring-2 focus-visible:ring-volta-volt focus-visible:outline-none disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  )
}

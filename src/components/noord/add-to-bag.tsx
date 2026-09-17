"use client"

import * as React from "react"
import { cn } from "cn"

import { Button } from "@/components/noord/ui/button"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/noord/ui/toggle-group"
import { useBag, type BagLine } from "@/lib/noord/bag"
import { useOverlays } from "@/lib/noord/overlays"

/** `line` is assembled server-side since the client can't read the catalog. */
export function AddToBag({
  line,
  sizes,
  soldOut,
}: {
  line: Omit<BagLine, "size" | "quantity">
  sizes: string[]
  soldOut: string[]
}) {
  const add = useBag((state) => state.add)
  const showBag = useOverlays((state) => state.show)

  const [size, setSize] = React.useState<string | null>(
    // A single-size product has nothing to choose.
    sizes.length === 1 ? sizes[0] : null,
  )
  const [missingSize, setMissingSize] = React.useState(false)

  function onAdd() {
    if (!size) {
      setMissingSize(true)
      return
    }
    add({ ...line, size, quantity: 1 })
    showBag("bag")
  }

  return (
    <div className="flex flex-col gap-4">
      {sizes.length > 1 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-4">
            <span
              className={cn(
                "text-noord-micro uppercase",
                missingSize ? "text-noord-sale" : "text-noord-ink-faint",
              )}
            >
              {missingSize ? "Select a size" : "Size"}
            </span>
            <button
              type="button"
              className="noord-underline text-noord-micro text-noord-ink-muted uppercase"
            >
              Size guide
            </button>
          </div>

          <ToggleGroup
            value={size ? [size] : []}
            onValueChange={(next) => {
              const [picked] = next as string[]
              setSize(picked ?? null)
              setMissingSize(false)
            }}
          >
            {sizes.map((option) => {
              const unavailable = soldOut.includes(option)
              return (
                <ToggleGroupItem
                  key={option}
                  value={option}
                  disabled={unavailable}
                  className={cn(
                    unavailable && "text-noord-ink-faint line-through",
                  )}
                >
                  {option}
                </ToggleGroupItem>
              )
            })}
          </ToggleGroup>
        </div>
      )}

      <Button size="block" onClick={onAdd}>
        Add to bag
      </Button>
    </div>
  )
}

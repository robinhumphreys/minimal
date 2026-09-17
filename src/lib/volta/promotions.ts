// Client-safe on purpose: the stripe and the bag both need this, so it
// cannot live behind the server-only catalog module.

/** Spend at or above this and delivery is free. Cents, EUR. */
export const FREE_DELIVERY_THRESHOLD = 4000

/** Flat delivery charge below the threshold. Cents, EUR. */
export const DELIVERY_FEE = 495

/** Cut-off for same-day dispatch, in the shop's local time. */
export const CUTOFF = "22:00"

/**
 * Four, deliberately: the desktop header and the footer both lay these out
 * as an even grid, so an odd count leaves a hole in both.
 */
export type ViolatorId = "delivery" | "dispatch" | "returns" | "testing"

export const VIOLATORS: { id: ViolatorId; label: string }[] = [
  {
    id: "delivery",
    label: `Free delivery over €${FREE_DELIVERY_THRESHOLD / 100}`,
  },
  { id: "dispatch", label: "Shipped same day" },
  { id: "returns", label: "30-day returns" },
  { id: "testing", label: "Batch-tested" },
]

/** The three promises repeated under the fold and in the bag. */
export const PROMISES: { title: string; body: string }[] = [
  {
    title: "Shipped today",
    body: `Order before ${CUTOFF} on a weekday and it leaves the same day.`,
  },
  {
    title: "Batch-tested",
    body: "Every batch is third-party screened before it reaches a shelf.",
  },
  {
    title: "Taste it or return it",
    body: "Open the tub. If you do not like it, send it back within 30 days.",
  },
]

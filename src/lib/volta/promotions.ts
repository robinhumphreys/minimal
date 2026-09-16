/**
 * The promotional furniture: violator stripe, delivery thresholds, service
 * promises.
 *
 * Client-safe on purpose — the stripe scrolls above the header on every route
 * and the bag reads the threshold to price delivery, so this cannot live
 * behind the server-only catalog module.
 */

/** Spend at or above this and delivery is free. Cents, EUR. */
export const FREE_DELIVERY_THRESHOLD = 4000

/** Flat delivery charge below the threshold. Cents, EUR. */
export const DELIVERY_FEE = 495

/** Cut-off for same-day dispatch, in the shop's local time. */
export const CUTOFF = "22:00"

/**
 * The scrolling stripe above the header. Two or three words each: the band is
 * 2rem tall and moves, so a phrase that needs reading twice never gets read.
 * The long form of each promise lives in `PROMISES` and on the product page.
 *
 * Four, deliberately: the stripe lays them out evenly across the desktop header
 * and the footer repeats them as a four-column grid, so an odd count leaves a
 * hole in both. Anything added here has to displace one of these.
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

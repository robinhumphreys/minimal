/**
 * The cart lives in the browser and the agent runs on the server, so
 * `viewCart` is a client-side tool answered from a page-set global.
 */

export type CartLine = {
  slug: string
  name: string
  /** The chosen size or flavour, e.g. "M" or "Vanilla · 1000 g". */
  variant?: string
  quantity: number
  /** Formatted unit price, e.g. "€449.00". */
  price: string
  /** Formatted, price times quantity. */
  lineTotal: string
  /** Storefront product page, relative to the site root. */
  url: string
}

export type CartView = {
  /** False where there is no cart to read: the admin's preview, or a page that has not registered one. */
  available: boolean
  lines: CartLine[]
  /** Items, counting quantity. */
  count: number
  /** Formatted. Absent when the cart is unavailable. */
  subtotal?: string
}

export const UNAVAILABLE_CART: CartView = {
  available: false,
  lines: [],
  count: 0,
}

/** What a storefront registers so the embed can read its cart. */
export type MinimalAgentHost = {
  cart?: () => Omit<CartView, "available">
}

declare global {
  interface Window {
    MinimalAgentHost?: MinimalAgentHost
  }
}

/** Called by the storefront's shell once its cart store is on the client; returns the unregister for effect cleanup. */
export function provideCart(read: () => Omit<CartView, "available">) {
  const host = (window.MinimalAgentHost ??= {})
  host.cart = read
  return () => {
    if (host.cart === read) delete host.cart
  }
}

/** Read by the embed when the model calls `viewCart`. */
export function readHostCart(): CartView {
  if (typeof window === "undefined") return UNAVAILABLE_CART
  const read = window.MinimalAgentHost?.cart
  if (!read) return UNAVAILABLE_CART
  try {
    return { available: true, ...read() }
  } catch {
    return UNAVAILABLE_CART
  }
}

/**
 * The client-side half of the `viewCart` tool, shared by every `useChat`:
 * an unanswered call would leave the conversation hanging forever.
 */
export function answerViewCart(
  toolCall: { toolName: string; toolCallId: string; dynamic?: boolean },
  addToolOutput: (result: {
    tool: "viewCart"
    toolCallId: string
    output: CartView
    options?: { body?: object }
  }) => void,
  body?: object,
): void {
  if (toolCall.dynamic || toolCall.toolName !== "viewCart") return
  // Not awaited, per the SDK: the output is added and the chat resubmits
  // on its own once the last assistant message is complete.
  addToolOutput({
    tool: "viewCart",
    toolCallId: toolCall.toolCallId,
    output: readHostCart(),
    options: body ? { body } : undefined,
  })
}

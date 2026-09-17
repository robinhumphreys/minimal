import type { Metadata } from "next"
import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"

/**
 * The two ways in: build an agent in the admin, or look at one already
 * running on a storefront. Listed plainly — the brands own their type and
 * colour on their own pages, not here.
 */
const LINKS = [
  {
    href: "/admin/noord/agent/onboarding",
    label: "Onboarding: Noord Suits",
  },
  {
    href: "/admin/volta/agent/onboarding",
    label: "Onboarding: Volta",
  },
  { href: "/noord", label: "Noord Suits storefront" },
  { href: "/volta", label: "Volta storefront" },
]

// Named over the layout's app-wide default, which the storefronts still use.
export const metadata: Metadata = {
  title: "Agentic storefront demos",
}

export default function Page() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-10 px-6 py-16">
      <h1 className="font-heading text-3xl leading-tight tracking-tight text-balance sm:text-4xl">
        Agentic storefront demos
      </h1>

      <ul className="flex flex-col gap-2">
        {LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm transition-colors hover:border-foreground/25 hover:bg-muted"
            >
              {link.label}
              {/* Decorative: the link text already says where it goes. */}
              <ArrowRightIcon
                aria-hidden="true"
                className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

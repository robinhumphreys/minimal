import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { FOOTER_COLUMNS, LEGAL_LINKS } from "@/lib/volta/footer-links"
import { PROMISES } from "@/lib/volta/promotions"

import { Button } from "@/components/volta/ui/button"
import { Input } from "@/components/volta/ui/input"
import { Wordmark } from "./wordmark"

/**
 * The footer, in three bands: the promises, the sign-up, then the links.
 *
 * On a phone the link columns stack; they are short enough that collapsing
 * them into accordions would hide six items behind a tap each.
 */
export function Footer() {
  return (
    <footer className="border-t border-volta-line bg-volta-carbon">
      <div className="volta-gutter mx-auto max-w-7xl">
        <ul className="grid gap-6 border-b border-volta-line py-10 sm:grid-cols-3">
          {PROMISES.map((promise, index) => (
            <li key={promise.title} className="flex gap-4">
              <span className="volta-display shrink-0 text-2xl leading-none text-volta-volt tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="volta-wide text-volta-label text-volta-chalk">
                  {promise.title}
                </h3>
                <p className="text-volta-body text-volta-ash">{promise.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-8 border-b border-volta-line py-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="flex max-w-md flex-col gap-3">
            <h2 className="volta-display text-volta-heading text-volta-chalk">
              Train with us
            </h2>
            <p className="text-volta-body text-volta-ash">
              Programmes, restocks and early access to drops. One email a week,
              no filler.
            </p>
          </div>

          <form
            className="flex w-full max-w-md items-end gap-3"
            // The demo has no list to sign up to; the field is the point.
            action="/volta"
          >
            <div className="flex-1">
              <label
                htmlFor="volta-newsletter"
                className="volta-wide block pb-1 text-volta-micro text-volta-smoke"
              >
                Email
              </label>
              <Input
                id="volta-newsletter"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <Button variant="volt" type="submit" className="shrink-0">
              Join
              <ArrowRightIcon />
            </Button>
          </form>
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-3">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="flex flex-col gap-4">
              <h3 className="volta-wide text-volta-micro text-volta-smoke">
                {column.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="volta-underline text-volta-body text-volta-ash transition-colors hover:text-volta-chalk"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6 border-t border-volta-line py-8 sm:flex-row sm:items-center sm:justify-between">
          <Wordmark className="text-base" />
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-volta-micro tracking-volta-wide text-volta-smoke uppercase transition-colors hover:text-volta-ash"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-volta-micro tracking-volta-wide text-volta-smoke uppercase">
            © {new Date().getFullYear()} Volta
          </p>
        </div>
      </div>
    </footer>
  )
}

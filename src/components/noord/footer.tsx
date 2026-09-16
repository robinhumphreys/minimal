import Link from "next/link"
import { ArrowRightIcon, GlobeIcon } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/noord/ui/accordion"
import { Input } from "@/components/noord/ui/input"
import {
  FOOTER_COLUMNS,
  FOOTER_LEGAL,
  FOOTER_PAYMENTS,
  FOOTER_SOCIAL,
  FOOTER_STORES,
  type FooterColumn,
} from "@/lib/noord/footer-links"

import { Wordmark } from "./wordmark"

/**
 * Four bands, in the order a retailer uses them: service promises, the link
 * columns, the newsletter, then the legal strip.
 *
 * The link columns collapse into an accordion below `md`, where four open
 * columns would be a wall of text on a phone.
 */
export function Footer() {
  return (
    <footer className="border-t border-noord-line bg-noord-paper">
      <ServiceBand />

      <div className="noord-gutter mx-auto w-full max-w-7xl">
        <div className="grid gap-10 border-b border-noord-line py-12 md:grid-cols-4 md:gap-8">
          {/* Phone: collapsed columns. */}
          <div className="md:hidden">
            <Accordion>
              {FOOTER_COLUMNS.map((column) => (
                <AccordionItem key={column.title} value={column.title}>
                  <AccordionTrigger>{column.title}</AccordionTrigger>
                  <AccordionContent>
                    <ColumnLinks column={column} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Tablet and up: open columns. */}
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="hidden md:block">
              <h2 className="mb-4 text-noord-micro text-noord-ink-faint uppercase">
                {column.title}
              </h2>
              <ColumnLinks column={column} />
            </div>
          ))}
        </div>

        <div className="grid gap-10 border-b border-noord-line py-12 md:grid-cols-2 md:gap-16">
          <Newsletter />

          <div className="flex flex-col gap-8 md:items-end">
            <div className="flex flex-col gap-3 md:items-end">
              <h2 className="text-noord-micro text-noord-ink-faint uppercase">
                Follow
              </h2>
              <ul className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end">
                {FOOTER_SOCIAL.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="noord-underline text-noord-body text-noord-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3 md:items-end">
              <h2 className="text-noord-micro text-noord-ink-faint uppercase">
                Stores
              </h2>
              <p className="text-noord-body text-noord-ink-muted">
                {FOOTER_STORES.join(" · ")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 py-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <button
              type="button"
              className="flex items-center gap-2 self-start border border-noord-line px-3 py-2 text-noord-micro text-noord-ink uppercase transition-colors hover:border-noord-ink"
            >
              <GlobeIcon className="size-4" strokeWidth={1.5} />
              Netherlands · EUR €
            </button>

            <ul className="flex flex-wrap gap-2">
              {FOOTER_PAYMENTS.map((method) => (
                <li
                  key={method}
                  className="border border-noord-line px-2.5 py-1.5 text-[0.625rem] tracking-[0.08em] text-noord-ink-muted uppercase"
                >
                  {method}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4 border-t border-noord-line pt-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Wordmark className="text-[0.6875rem]" />
              <span className="text-noord-micro text-noord-ink-faint uppercase">
                © {new Date().getFullYear()}
              </span>
            </div>

            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {FOOTER_LEGAL.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="noord-underline text-noord-micro text-noord-ink-muted uppercase"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

const PROMISES = [
  { title: "Free alterations", copy: "Finished in store, on every garment." },
  { title: "Free shipping", copy: "On orders over €150, across Europe." },
  { title: "Thirty-day returns", copy: "By post or in any of our stores." },
  { title: "Personal styling", copy: "One hour, by appointment, no charge." },
]

function ServiceBand() {
  return (
    <div className="border-b border-noord-line bg-noord-wash">
      <dl className="noord-gutter mx-auto grid w-full max-w-7xl gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {PROMISES.map((promise) => (
          <div key={promise.title} className="flex flex-col gap-1.5">
            <dt className="text-noord-micro text-noord-ink uppercase">
              {promise.title}
            </dt>
            <dd className="text-noord-body text-noord-ink-muted">
              {promise.copy}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function ColumnLinks({ column }: { column: FooterColumn }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {column.links.map((link) => (
        <li key={column.title + link.label}>
          <Link
            href={link.href}
            className="noord-underline text-noord-body text-noord-ink"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

function Newsletter() {
  return (
    <div className="flex max-w-md flex-col gap-4">
      <h2 className="text-noord-micro text-noord-ink-faint uppercase">
        Newsletter
      </h2>
      <p className="text-noord-lead text-noord-ink">
        New arrivals, fabric drops and appointment openings. Once a fortnight,
        never more.
      </p>
      <form className="flex items-end gap-3">
        <Input
          type="email"
          placeholder="Email address"
          aria-label="Email address"
          className="h-11 flex-1 text-noord-body"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          className="flex size-11 shrink-0 items-center justify-center border border-noord-ink bg-noord-ink text-noord-paper transition-colors hover:bg-noord-paper hover:text-noord-ink"
        >
          <ArrowRightIcon className="size-4" strokeWidth={1.5} />
        </button>
      </form>
      <p className="text-noord-micro tracking-normal text-noord-ink-faint normal-case">
        By subscribing you agree to our privacy policy. Unsubscribe any time.
      </p>
    </div>
  )
}

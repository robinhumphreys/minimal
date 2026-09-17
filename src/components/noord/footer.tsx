import Link from "next/link"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/noord/ui/accordion"
import {
  FOOTER_COLUMNS,
  FOOTER_LEGAL,
  type FooterColumn,
} from "@/lib/noord/footer-links"

import { Wordmark } from "./wordmark"

/**
 * The link columns collapse into an accordion below `md`, where four open
 * columns would be a wall of text on a phone.
 */
export function Footer() {
  return (
    <footer className="border-t border-noord-line bg-noord-paper">
      <ServiceBand />

      <div className="noord-gutter">
        <div className="grid gap-10 border-b border-noord-line py-12 md:grid-cols-4 md:gap-8">
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

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="hidden md:block">
              <h2 className="mb-4 text-noord-micro text-noord-ink-faint uppercase">
                {column.title}
              </h2>
              <ColumnLinks column={column} />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
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
      <dl className="noord-gutter grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
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

import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/noord/ui/button"

/**
 * The full-bleed invitation that closes every page, above the footer.
 *
 * A storefront's last word should be a reason to come in rather than a link
 * list, and the same one on every page stops reading after the second page.
 * So there are four, chosen from the path: a given page always shows the same
 * one, and a shopper moving through the site meets all of them.
 */
const INVITATIONS = [
  {
    image: "/noord/editorial/shopfront.jpg",
    position: "object-[50%_40%]",
    eyebrow: "Amsterdam · Antwerp · Copenhagen",
    title: "Come in and be measured",
    cta: "Book an appointment",
    href: "/noord",
  },
  {
    image: "/noord/editorial/store-interior.jpg",
    position: "object-[50%_45%]",
    eyebrow: "Made to measure",
    title: "Cut from your own pattern",
    cta: "Start a commission",
    href: "/noord",
  },
  {
    image: "/noord/editorial/detail-cuff.jpg",
    position: "object-[50%_50%]",
    eyebrow: "The alterations room",
    title: "Nothing leaves until it fits",
    cta: "See what we adjust",
    href: "/noord",
  },
  {
    image: "/noord/editorial/street-brown.jpg",
    position: "object-[50%_35%]",
    eyebrow: "The cloth book",
    title: "Woven in Biella, finished by hand",
    cta: "See the cloths",
    href: "/noord",
  },
]

export function Invitation({ seed }: { seed: string }) {
  // Summed char codes, the same cheap hash the size runs use. Stable between
  // the server and the client, which `Math.random()` would not be.
  const hash = [...seed].reduce((total, char) => total + char.charCodeAt(0), 0)
  const invitation = INVITATIONS[hash % INVITATIONS.length]

  return (
    <section className="relative">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-noord-wash sm:aspect-[16/9] lg:aspect-[3/1]">
        <Image
          src={invitation.image}
          alt=""
          fill
          sizes="100vw"
          className={`object-cover ${invitation.position}`}
        />
        {/* Biased to the left, where the type sits: a flat scrim over the
            whole shot dims the photography to buy contrast it only needs in
            one corner. */}
        <div className="absolute inset-0 bg-gradient-to-r from-noord-ink/80 via-noord-ink/45 to-noord-ink/25" />
      </div>

      <div className="noord-gutter absolute inset-0 flex flex-col items-start justify-center gap-4">
        <span className="text-noord-micro text-noord-paper/80 uppercase">
          {invitation.eyebrow}
        </span>
        <h2 className="max-w-xl text-noord-section text-balance text-noord-paper">
          {invitation.title}
        </h2>
        <Button
          render={<Link href={invitation.href} />}
          className="border-noord-paper bg-noord-paper text-noord-ink hover:border-noord-paper hover:bg-transparent hover:text-noord-paper"
        >
          {invitation.cta}
        </Button>
      </div>
    </section>
  )
}

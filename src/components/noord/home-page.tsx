import Image from "next/image"
import Link from "next/link"

import { ProductRail } from "@/components/noord/product-rail"
import { Button } from "@/components/noord/ui/button"
import { categoryHref, pickFeatured, toCard } from "@/lib/noord/catalog-view"
import { getCatalog, getProductsInCategory } from "@/lib/catalog"

/** Editorial shots, kept together so a swap is one edit. See CREDITS.md. */
const IMAGERY = {
  hero: "/noord/editorial/hero-portrait.jpg",
  fits: "/noord/editorial/fit-hands.jpg",
  rail: "/noord/editorial/rail-glass.jpg",
  store: "/noord/editorial/store-interior.jpg",
  appointment: "/noord/editorial/shopfront.jpg",
}

/** The Noord Suits homepage. */
export function HomePage() {
  const catalog = getCatalog("noord")
  const arrivals = pickFeatured(8, 3)
  const tailoring = getProductsInCategory("noord", "suits").slice(0, 4).map(toCard)

  const tiles = catalog.categories
    .map((category) => ({
      category,
      products: getProductsInCategory("noord", category.slug),
    }))
    .filter(({ products }) => products.length > 0)
    .slice(0, 6)

  return (
    <>
      <Hero />

      <ProductRail
        title="New this week"
        href={categoryHref("suits")}
        products={arrivals}
      />

      <section className="noord-gutter py-12 md:py-16">
        <h2 className="mb-6 text-noord-section">Shop by category</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
          {tiles.map(({ category, products }) => (
            <Link
              key={category.slug}
              href={categoryHref(category.slug)}
              className="group flex flex-col gap-3"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-noord-wash">
                <Image
                  src={products[0].images[0]}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 30vw, 46vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <span className="text-noord-title">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <HouseFits />
      <EditorialPair />

      <ProductRail
        title="Tailoring"
        href={categoryHref("suits")}
        products={tailoring}
      />

      <Appointment />
    </>
  )
}

function Hero() {
  return (
    <section className="relative">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-noord-wash sm:aspect-[16/9] lg:aspect-[2/1]">
        <Image
          src={IMAGERY.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_42%]"
        />
        {/* The shot is already dark, but the gradient guarantees the type
            clears AA contrast wherever the crop lands. */}
        <div className="absolute inset-0 bg-gradient-to-t from-noord-ink/70 via-noord-ink/20 to-transparent" />
      </div>

      <div className="noord-gutter absolute inset-x-0 bottom-0 pb-8 md:pb-14">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-4">
          <span className="text-noord-micro text-noord-paper/80 uppercase">
            Autumn / Winter
          </span>
          <h1 className="max-w-2xl text-noord-display text-noord-paper text-balance">
            Tailoring for the northern half of the year
          </h1>
          <div className="flex flex-wrap gap-3 pt-1">
            <Button
              render={<Link href={categoryHref("suits")} />}
              className="border-noord-paper bg-noord-paper text-noord-ink hover:border-noord-paper hover:bg-transparent hover:text-noord-paper"
            >
              Shop suits
            </Button>
            <Button
              render={<Link href={categoryHref("outerwear")} />}
              variant="outline"
              className="border-noord-paper text-noord-paper hover:bg-noord-paper hover:text-noord-ink"
            >
              Shop outerwear
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function HouseFits() {
  return (
    <section className="noord-gutter py-12 md:py-16">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-6 md:grid-cols-2 md:gap-12">
        <div className="relative aspect-[4/5] overflow-hidden bg-noord-wash md:aspect-[3/4]">
          <Image
            src={IMAGERY.fits}
            alt=""
            fill
            sizes="(min-width: 768px) 46vw, 92vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col items-start gap-5">
          <span className="text-noord-micro text-noord-ink-faint uppercase">
            The house fits
          </span>
          <h2 className="text-noord-section text-balance">
            Three cuts, measured against each other
          </h2>
          <p className="max-w-md text-noord-lead text-noord-ink-muted">
            Havana is soft-shouldered and unstructured. Milano is cleaner
            through the chest. Roma is the relaxed one. Every jacket is altered
            in store before it leaves.
          </p>
          <Button render={<Link href={categoryHref("jackets")} />} variant="outline">
            Read the guide
          </Button>
        </div>
      </div>
    </section>
  )
}

const PAIR = [
  {
    image: IMAGERY.rail,
    eyebrow: "The fabric library",
    title: "Woven in Biella, cut in Amsterdam",
    copy: "Four mills, one cloth book, and a rail you are welcome to work through slowly.",
    href: "/noord/suits",
    cta: "See the cloths",
  },
  {
    image: IMAGERY.store,
    eyebrow: "In store",
    title: "An hour with a stylist",
    copy: "Bring the invitation, the weather forecast, or nothing at all. Appointments are free.",
    href: "/noord",
    cta: "Book a fitting",
  },
]

function EditorialPair() {
  return (
    <section className="noord-gutter py-12 md:py-16">
      <div className="mx-auto grid w-full max-w-7xl gap-10 md:grid-cols-2 md:gap-6">
        {PAIR.map((block) => (
          <article key={block.title} className="group flex flex-col gap-5">
            <Link
              href={block.href}
              className="relative aspect-[4/3] overflow-hidden bg-noord-wash"
            >
              <Image
                src={block.image}
                alt=""
                fill
                sizes="(min-width: 768px) 46vw, 92vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </Link>
            <div className="flex flex-col items-start gap-3">
              <span className="text-noord-micro text-noord-ink-faint uppercase">
                {block.eyebrow}
              </span>
              <h2 className="text-noord-title text-balance">{block.title}</h2>
              <p className="max-w-sm text-noord-body text-noord-ink-muted">
                {block.copy}
              </p>
              <Link
                href={block.href}
                className="noord-underline text-noord-micro text-noord-ink uppercase"
              >
                {block.cta}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Appointment() {
  return (
    <section className="relative">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-noord-wash sm:aspect-[16/9] lg:aspect-[3/1]">
        <Image
          src={IMAGERY.appointment}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[50%_40%]"
        />
        <div className="absolute inset-0 bg-noord-ink/45" />
      </div>

      <div className="noord-gutter absolute inset-0 flex items-center">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-4">
          <span className="text-noord-micro text-noord-paper/80 uppercase">
            Amsterdam · Antwerp · Copenhagen
          </span>
          <h2 className="max-w-xl text-noord-section text-noord-paper text-balance">
            Come in and be measured
          </h2>
          <Button
            render={<Link href="/noord" />}
            className="border-noord-paper bg-noord-paper text-noord-ink hover:border-noord-paper hover:bg-transparent hover:text-noord-paper"
          >
            Book an appointment
          </Button>
        </div>
      </div>
    </section>
  )
}

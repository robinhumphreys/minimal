import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon } from "@phosphor-icons/react/ssr"

import { getCatalog } from "@/lib/catalog"
import {
  GOALS,
  bestSellers,
  categoryHref,
  goalHref,
  productsForGoal,
  testimonials,
  topRated,
} from "@/lib/volta/catalog-view"
import { categoryImage } from "@/lib/volta/editorial"

import { Button } from "@/components/volta/ui/button"
import { ProductRail } from "./product-rail"
import { Shelf } from "./shelf"
import { Testimonials } from "./testimonials"

export function HomePage() {
  const catalog = getCatalog("volta")

  return (
    <div className="flex flex-col gap-16 pb-16 md:gap-20">
      <Hero />
      <GoalStrip />

      <Shelf>
        <ProductRail
          eyebrow="Most reviewed"
          title="Best sellers"
          href={categoryHref("protein")}
          products={bestSellers(8)}
          preload
        />
      </Shelf>

      <CategoryGrid categories={catalog.categories} />

      <FeatureBand />

      <Testimonials reviews={testimonials(3)} />

      {/* Two rails, one shelf: the page closes on a single slab of product. */}
      <Shelf>
        <ProductRail
          eyebrow="Rated 4.7 and up"
          title="Top rated"
          href={categoryHref("vitamins")}
          products={topRated(8)}
        />
        <ProductRail
          eyebrow="For long sessions"
          title="Go longer"
          href={goalHref("endurance")}
          hrefLabel="All endurance"
          products={productsForGoal("endurance", 8)}
        />
      </Shelf>
    </div>
  )
}

/**
 * The hero. Two crops of the same shot, because the wide one loses the lifter
 * entirely on a phone and no amount of `object-position` gets him back.
 *
 * A raw `<picture>` rather than `next/image`: art direction — a different
 * *file* per breakpoint, not a different size of one file — is the one thing
 * `next/image` cannot express. Rendering both and hiding one with CSS would
 * download both. The two crops are already sized and compressed by
 * `scripts/volta-imagery.mjs`, so the optimiser has little left to do here.
 */
function Hero() {
  return (
    <section className="relative flex min-h-[78svh] items-end overflow-hidden md:min-h-[86svh]">
      <picture>
        <source
          media="(min-width: 48rem)"
          srcSet="/volta/editorial/hero-wide.jpg"
        />
        <img
          src="/volta/editorial/hero-tall.jpg"
          alt=""
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover object-center"
        />
      </picture>
      {/*
        The scrim follows the type, not the frame. On a phone the headline sits
        at the bottom, so the wash rises from there; from `md` up the headline
        is on the left and the lifter is centre-right, so a bottom wash would
        black him out — the gradient turns to run left-to-right instead.
      */}
      <div className="absolute inset-0 bg-gradient-to-t from-volta-void via-volta-void/55 to-transparent md:bg-gradient-to-r md:from-volta-void md:via-volta-void/60 md:to-transparent" />

      <div className="volta-gutter relative mx-auto flex w-full max-w-7xl flex-col gap-6 pb-14 md:pb-20">
        {/*
          Three lines of eight or nine characters, so the block stays square at
          every width. A hyphenated "out-trains" broke across two lines on a
          phone and left a dangling hyphen.
        */}
        <h1 className="volta-display text-volta-display text-volta-chalk">
          You can&rsquo;t
          <br />
          <span className="text-volta-volt">outtrain</span>
          <br />
          bad fuel
        </h1>

        <p className="max-w-md text-volta-lead text-volta-ash">
          Batch-tested protein, pre-workout and hydration. Made for people who
          keep showing up.
        </p>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="volt"
            size="default"
            render={<Link href={categoryHref("protein")} />}
          >
            Shop protein
            <ArrowRightIcon />
          </Button>
          <Button
            variant="outline"
            size="default"
            render={<Link href={goalHref("pre-workout")} />}
          >
            Find your fuel
          </Button>
        </div>
      </div>
    </section>
  )
}

/** "Shop by goal" — how a nutrition shopper actually thinks about the catalog. */
function GoalStrip() {
  return (
    <section className="volta-gutter mx-auto w-full max-w-7xl">
      <h2 className="volta-wide pb-4 text-volta-micro text-volta-smoke">
        Shop by goal
      </h2>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {GOALS.map((goal) => (
          <li key={goal.tag}>
            <Link
              href={goalHref(goal.tag)}
              className="volta-wide flex h-full items-center rounded-volta border-2 border-volta-line px-3 py-4 text-volta-label text-volta-chalk transition-colors hover:border-volta-volt hover:text-volta-volt"
            >
              {goal.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

function CategoryGrid({
  categories,
}: {
  categories: { slug: string; name: string; description: string }[]
}) {
  return (
    <section className="volta-gutter mx-auto w-full max-w-7xl">
      <div className="flex flex-col gap-1.5 pb-6">
        <span className="volta-wide text-volta-micro text-volta-volt">
          Everything we make
        </span>
        <h2 className="volta-display text-volta-heading text-volta-chalk">
          The range
        </h2>
      </div>

      <ul className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              href={categoryHref(category.slug)}
              className="group/tile relative flex aspect-square items-end overflow-hidden rounded-volta"
            >
              <Image
                src={categoryImage(category.slug)}
                alt=""
                fill
                sizes="(min-width: 768px) 30vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover/tile:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-volta-void via-volta-void/30 to-transparent" />
              <div className="relative flex w-full items-center justify-between gap-2 p-4">
                <span className="volta-display text-volta-title text-volta-chalk group-hover/tile:text-volta-volt">
                  {category.name}
                </span>
                <ArrowRightIcon className="size-4 shrink-0 text-volta-volt transition-transform group-hover/tile:translate-x-0.5" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** A full-bleed statement band, breaking up the run of product rails. */
function FeatureBand() {
  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src="/volta/editorial/deadlift-legs.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-volta-void/75" />
      <div className="volta-gutter relative mx-auto flex max-w-7xl flex-col gap-6 py-20 md:py-28">
        <h2 className="volta-display max-w-[14ch] text-volta-display text-volta-chalk">
          Tested. Then <span className="text-volta-volt">tested again</span>
        </h2>
        <p className="max-w-lg text-volta-lead text-volta-ash">
          Every batch is screened by an independent lab before it ships — for
          purity, for dose, and for what the label says is in it. The results go
          on the tub.
        </p>
        <Button
          variant="volt"
          className="w-fit"
          render={<Link href="/volta" />}
        >
          See the results
          <ArrowRightIcon />
        </Button>
      </div>
    </section>
  )
}

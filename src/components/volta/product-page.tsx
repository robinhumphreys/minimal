import Image from "next/image"
import { notFound } from "next/navigation"
import {
  TruckIcon,
  ArrowCounterClockwiseIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react/ssr"

import { getCategory, getProduct } from "@/lib/catalog"
import {
  categoryHref,
  crossSell,
  productHref,
  productReviews,
  ratingBreakdown,
  relatedProducts,
} from "@/lib/volta/catalog-view"
import { formatCount, formatRating } from "@/lib/volta/format"
import { CUTOFF, FREE_DELIVERY_THRESHOLD } from "@/lib/volta/promotions"

import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/volta/ui/tabs"
import { AddToBag } from "./add-to-bag"
import { Breadcrumbs } from "./breadcrumbs"
import { Price } from "./price"
import { ProductRail } from "./product-rail"
import { Shelf } from "./shelf"
import { ProductReviews } from "./product-reviews"
import { Stars } from "./rating"

const MAX_REVIEWS = 6

export async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProduct("volta", slug)
  if (!product) notFound()

  const category = getCategory("volta", product.category)
  const reviews = productReviews(slug, MAX_REVIEWS)
  const breakdown =
    product.rating !== undefined && product.reviewCount !== undefined
      ? ratingBreakdown(product.rating, product.reviewCount)
      : []

  return (
    <div className="flex flex-col gap-16 pb-16">
      <div className="volta-gutter mx-auto w-full max-w-7xl pt-4">
        <Breadcrumbs
          className="pb-5"
          trail={[
            { label: "Volta", href: "/volta" },
            ...(category
              ? [{ label: category.name, href: categoryHref(category.slug) }]
              : []),
            { label: product.name },
          ]}
        />

        {/*
          Detail column first, image second: on desktop the name, rating, price
          and buy button sit on the left, where the eye lands. `flex-col-reverse`
          puts the image back on top of the stack on a phone, where a tub you
          have not seen yet is worth more than a heading you are about to read.
        */}
        <div className="flex flex-col-reverse gap-8 lg:flex-row lg:gap-12">
          <div className="flex flex-col gap-6 lg:flex-1 lg:pt-2">
            <div className="flex flex-col gap-3">
              <h1 className="volta-display text-volta-heading text-volta-chalk">
                {product.name}
              </h1>

              {product.rating !== undefined &&
                product.reviewCount !== undefined && (
                  <a
                    href="#reviews"
                    className="flex w-fit items-center gap-2 hover:underline"
                  >
                    <Stars rating={product.rating} size="lg" />
                    <span className="text-volta-body text-volta-chalk tabular-nums">
                      {formatRating(product.rating)}
                    </span>
                    <span className="text-volta-body text-volta-ash tabular-nums">
                      ({formatCount(product.reviewCount)})
                    </span>
                  </a>
                )}

              <Price price={product.price} size="lg" />

              <p className="text-volta-micro text-volta-ash">
                {[
                  product.attributes.size,
                  // The catalog stores a bare number; on its own "30" reads as
                  // part of the size.
                  product.attributes.servings &&
                    `${product.attributes.servings} servings`,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>

            <p className="text-volta-lead text-volta-ash">
              {product.description}
            </p>

            <AddToBag
              form={product.attributes.form}
              flavour={product.attributes.flavour}
              line={{
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.images[0],
                href: productHref(product.slug),
                size: product.attributes.size,
              }}
            />

            <ul className="flex flex-col gap-3 border-y border-volta-line py-5">
              <Promise icon={<TruckIcon className="size-4" />}>
                Free delivery over €{FREE_DELIVERY_THRESHOLD / 100} · ordered
                before {CUTOFF}, shipped today
              </Promise>
              <Promise icon={<ArrowCounterClockwiseIcon className="size-4" />}>
                30 days to send it back, opened or not
              </Promise>
              <Promise icon={<ShieldCheckIcon className="size-4" />}>
                Third-party batch tested
              </Promise>
            </ul>

            <Tabs defaultValue="specification">
              <TabsList>
                <TabsTab value="specification">Specification</TabsTab>
                <TabsTab value="how-to-use">How to use</TabsTab>
                <TabsTab value="delivery">Delivery &amp; returns</TabsTab>
              </TabsList>

              <TabsPanel value="specification">
                <dl className="flex flex-col">
                  {Object.entries(product.attributes).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between gap-6 border-b border-volta-line py-2.5 last:border-b-0"
                    >
                      <dt className="text-volta-micro text-volta-smoke">
                        {sentenceCase(key)}
                      </dt>
                      <dd className="text-right text-volta-body text-volta-chalk">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </TabsPanel>

              <TabsPanel value="how-to-use">
                <p>{usageFor(product.attributes.form, product.category)}</p>
              </TabsPanel>

              <TabsPanel value="delivery" className="flex flex-col gap-2">
                <p>
                  Orders placed before {CUTOFF} on a weekday leave the same day.
                  Delivery is free over €{FREE_DELIVERY_THRESHOLD / 100}, €4.95
                  below it.
                </p>
                <p>
                  Not for you? Send it back within 30 days, opened or not, and
                  we refund the order in full.
                </p>
              </TabsPanel>
            </Tabs>
          </div>

          {/*
            One image, no carousel. Volta shoots every product the same way —
            tub front-on, nothing to rotate through — so a gallery would be an
            affordance with nothing behind it.
          */}
          <div className="lg:w-[55%]">
            <div className="relative aspect-square rounded-volta bg-white">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                preload
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-contain p-6 md:p-10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="volta-gutter mx-auto w-full max-w-7xl">
        <ProductReviews
          rating={product.rating}
          reviewCount={product.reviewCount}
          breakdown={breakdown}
          reviews={reviews}
        />
      </div>

      <Shelf>
        <ProductRail
          eyebrow={category ? `More ${category.name.toLowerCase()}` : "More"}
          title="Goes with this"
          products={relatedProducts(product, 8)}
        />

        <ProductRail
          eyebrow="Across the range"
          title="Stack it up"
          products={crossSell(product, 6)}
        />
      </Shelf>
    </div>
  )
}

function Promise({
  icon,
  children,
}: {
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0 text-volta-volt">{icon}</span>
      <span className="text-volta-body text-volta-ash">{children}</span>
    </li>
  )
}

/** The catalog stores attribute keys lower case; the spec list shows them. */
function sentenceCase(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1)
}

/**
 * Usage copy by form.
 *
 * The catalog does not carry dosing instructions — it is a product list, not a
 * label — so the PDP derives a sensible line from the form rather than leaving
 * the panel empty.
 */
function usageFor(form: string | undefined, category: string): string {
  switch (form) {
    case "Powder":
      return category === "pre-workout"
        ? "One scoop in 300 ml of cold water, 20–30 minutes before training. Start on half a scoop until you know how you respond to it."
        : "One to two scoops in 250–350 ml of water or milk. Shake for ten seconds and drink within the hour."
    case "Capsules":
    case "Softgels":
      return "Take with a meal and a full glass of water. Splitting the daily amount across two meals is easier on the stomach than taking it all at once."
    case "Tablets":
    case "Chewable Tablets":
      return "One a day with food. Consistency matters more than timing — take it at whatever point in the day you will not forget."
    case "Effervescent Tablets":
      return "Drop one tablet into 500–750 ml of water and let it dissolve fully before drinking. One during a session, one after."
    case "Sachets":
      return "Stir one sachet into 500 ml of water until clear. Drink steadily rather than in one go."
    case "Ready-to-Drink":
      return "Chill and drink as it is. Best within an hour of training, or as a protein top-up between meals."
    case "Bar":
    case "Wafer":
    case "Chocolate":
      return "Eat it. Works as a pre-session top-up, a post-session refuel, or the thing that stops you buying a pastry at three o'clock."
    default:
      return "Follow the dosing on the pack. If you are unsure how it fits with anything else you take, ask a professional first."
  }
}

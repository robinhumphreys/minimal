import Link from "next/link"
import { notFound } from "next/navigation"

import { AddToBag } from "@/components/noord/add-to-bag"
import { ProductGallery } from "@/components/noord/product-gallery"
import { ProductRail } from "@/components/noord/product-rail"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/noord/ui/accordion"
import { getCategory, getProduct } from "@/lib/catalog"
import {
  categoryHref,
  productHref,
  relatedProducts,
} from "@/lib/noord/catalog-view"
import { formatPrice } from "@/lib/noord/format"
import { sizesFor, soldOutSizes } from "@/lib/noord/sizing"

/** Attributes that belong in the "Fabric & care" panel rather than the spec list. */
const FABRIC_KEYS = ["fabric", "composition", "mill", "lining"]

export function ProductPage({ slug }: { slug: string }) {
  const product = getProduct("noord", slug)
  if (!product) notFound()

  const category = getCategory("noord", product.category)
  const sizes = sizesFor(product.category, product.attributes)
  const soldOut = soldOutSizes(product.slug, sizes)
  const related = relatedProducts(product, 4)
  const onSale = product.compareAt !== undefined

  const fabric = Object.entries(product.attributes).filter(([key]) =>
    FABRIC_KEYS.includes(key),
  )
  const details = Object.entries(product.attributes).filter(
    ([key]) => !FABRIC_KEYS.includes(key),
  )

  return (
    <div>
      {/* No column gap: the detail column's own padding must match the
          gallery's inset, otherwise a grid gap plus page gutter doubles it. */}
      <div className="lg:grid lg:grid-cols-[1.2fr_1fr] lg:items-start lg:gap-0">
        <ProductGallery images={product.images} alt={product.name} />

        <div className="noord-gutter flex flex-col gap-6 pt-6 lg:sticky lg:top-[calc(var(--spacing-noord-header)+2rem)] lg:px-12 lg:pt-12 xl:px-16 xl:pt-16">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2">
            <Link
              href="/noord"
              className="noord-underline text-noord-micro text-noord-ink-faint uppercase"
            >
              Home
            </Link>
            {category && (
              <>
                <span aria-hidden className="text-noord-ink-faint">
                  /
                </span>
                <Link
                  href={categoryHref(category.slug)}
                  className="noord-underline text-noord-micro text-noord-ink-faint uppercase"
                >
                  {category.name}
                </Link>
              </>
            )}
          </nav>

          <div className="flex flex-col gap-2">
            <h1 className="text-noord-section text-balance">{product.name}</h1>
            <p className="flex items-baseline gap-3 pt-1 text-noord-title tabular-nums">
              <span className={onSale ? "text-noord-sale" : undefined}>
                {formatPrice(product.price)}
              </span>
              {product.compareAt !== undefined && (
                <s className="text-noord-body text-noord-ink-faint">
                  {formatPrice(product.compareAt)}
                </s>
              )}
            </p>
          </div>

          <AddToBag
            line={{
              slug: product.slug,
              name: product.name,
              price: product.price,
              compareAt: product.compareAt,
              image: product.images[0],
              href: productHref(product.slug),
            }}
            sizes={sizes}
            soldOut={soldOut}
          />

          <Accordion multiple defaultValue={["description"]}>
            <AccordionItem value="description">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent>
                <p>{product.description}</p>
                {details.length > 0 && (
                  <dl className="mt-4 flex flex-col gap-1.5">
                    {details.map(([key, value]) => (
                      <div key={key} className="flex justify-between gap-4">
                        <dt className="text-noord-ink-faint capitalize">
                          {key}
                        </dt>
                        <dd className="text-right text-noord-ink">{value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </AccordionContent>
            </AccordionItem>

            {fabric.length > 0 && (
              <AccordionItem value="fabric">
                <AccordionTrigger>Fabric & care</AccordionTrigger>
                <AccordionContent>
                  <dl className="flex flex-col gap-1.5">
                    {fabric.map(([key, value]) => (
                      <div key={key} className="flex justify-between gap-4">
                        <dt className="text-noord-ink-faint capitalize">
                          {key}
                        </dt>
                        <dd className="text-right text-noord-ink">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-4">
                    Dry clean only. Rest between wears and brush along the
                    grain.
                  </p>
                </AccordionContent>
              </AccordionItem>
            )}

            <AccordionItem value="delivery">
              <AccordionTrigger>Delivery & returns</AccordionTrigger>
              <AccordionContent>
                <p>
                  Free shipping on orders over €150, delivered within two to
                  four working days. Returns are free for thirty days, in store
                  or by post.
                </p>
                <p className="mt-3">
                  Alterations are included with every suit, jacket and pair of
                  trousers.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <ProductRail
        title="You may also like"
        href={category ? categoryHref(category.slug) : undefined}
        products={related}
      />
    </div>
  )
}

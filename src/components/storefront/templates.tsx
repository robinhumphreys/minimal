import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import {
  formatPrice,
  getCatalog,
  getCategory,
  getProduct,
  getProductsInCategory,
  type BrandId,
} from "@/lib/catalog"

import { ProductCard } from "./product-card"

export function HomeTemplate({ id }: { id: BrandId }) {
  const catalog = getCatalog(id)

  return (
    <div className="flex flex-col gap-8 p-8">
      <h1 className="text-2xl">{catalog.id}</h1>

      <nav className="flex flex-col gap-1">
        <h2 className="text-lg">Categories</h2>
        <ul className="flex flex-col gap-1">
          {catalog.categories.map((category) => (
            <li key={category.slug}>
              <Link href={`/${id}/${category.slug}`} className="underline">
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg">Products</h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {catalog.products.slice(0, 8).map((product) => (
            <ProductCard key={product.slug} id={id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}

export async function CategoryTemplate({
  id,
  params,
}: {
  id: BrandId
  params: Promise<{ category: string }>
}) {
  const { category: slug } = await params
  const category = getCategory(id, slug)
  if (!category) notFound()

  const products = getProductsInCategory(id, slug)

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-2">
        <Link href={`/${id}`} className="text-sm underline">
          {id}
        </Link>
        <h1 className="text-2xl">{category.name}</h1>
        <p>{category.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.slug} id={id} product={product} />
        ))}
      </div>
    </div>
  )
}

export async function ProductTemplate({
  id,
  params,
}: {
  id: BrandId
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProduct(id, slug)
  if (!product) notFound()

  const category = getCategory(id, product.category)
  const [primary, ...rest] = product.images

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-2">
        <Link href={`/${id}`} className="text-sm underline">
          {id}
        </Link>
        {category ? (
          <Link href={`/${id}/${category.slug}`} className="text-sm underline">
            {category.name}
          </Link>
        ) : null}
      </div>

      <div className="flex flex-col gap-4">
        <Image
          src={primary}
          alt={product.name}
          width={600}
          height={600}
          className="max-w-full"
        />
        {rest.length > 0 ? (
          <div className="flex gap-2">
            {rest.map((image) => (
              <Image
                key={image}
                src={image}
                alt={product.name}
                width={120}
                height={120}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-2xl">{product.name}</h1>
        <p>
          {product.compareAt ? (
            <>
              <s className="text-muted-foreground">
                {formatPrice(product.compareAt)}
              </s>{" "}
            </>
          ) : null}
          {formatPrice(product.price)}
        </p>

        <dl className="flex flex-col gap-1">
          {Object.entries(product.attributes).map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <dt className="text-muted-foreground">{key}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <p>{product.description}</p>
      </div>
    </div>
  )
}

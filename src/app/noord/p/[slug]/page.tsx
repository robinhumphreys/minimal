import type { Metadata } from "next"

import { ProductPage } from "@/components/noord/product-page"
import { getCatalog, getProduct } from "@/lib/catalog"

export function generateStaticParams() {
  return getCatalog("noord").products.map((product) => ({
    slug: product.slug,
  }))
}

export async function generateMetadata(
  props: PageProps<"/noord/p/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params
  const product = getProduct("noord", slug)
  if (!product) return {}
  return {
    title: `${product.name} — Noord Suits`,
    description: product.description,
  }
}

export default async function Page(props: PageProps<"/noord/p/[slug]">) {
  const { slug } = await props.params
  return <ProductPage slug={slug} />
}

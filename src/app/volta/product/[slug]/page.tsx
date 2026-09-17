import type { Metadata } from "next"

import { ProductPage } from "@/components/volta/product-page"
import { getCatalog, getProduct } from "@/lib/catalog"

export function generateStaticParams() {
  return getCatalog("volta").products.map((product) => ({
    slug: product.slug,
  }))
}

export async function generateMetadata(
  props: PageProps<"/volta/product/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params
  const product = getProduct("volta", slug)
  if (!product) return {}

  return {
    title: `${product.name} — Volta`,
    description: product.description,
  }
}

export default function Page(props: PageProps<"/volta/product/[slug]">) {
  return <ProductPage params={props.params} />
}

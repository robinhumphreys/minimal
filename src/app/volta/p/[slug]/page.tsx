import { ProductTemplate } from "@/components/storefront/templates"
import { getCatalog } from "@/lib/catalog"

export function generateStaticParams() {
  return getCatalog("volta").products.map((product) => ({
    slug: product.slug,
  }))
}

export default function Page(props: PageProps<"/volta/p/[slug]">) {
  return <ProductTemplate id="volta" params={props.params} />
}

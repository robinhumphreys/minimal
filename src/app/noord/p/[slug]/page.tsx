import { ProductTemplate } from "@/components/storefront/templates"
import { getCatalog } from "@/lib/catalog"

export function generateStaticParams() {
  return getCatalog("noord").products.map((product) => ({
    slug: product.slug,
  }))
}

export default function Page(props: PageProps<"/noord/p/[slug]">) {
  return <ProductTemplate id="noord" params={props.params} />
}

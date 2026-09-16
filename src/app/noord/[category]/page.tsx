import { CategoryTemplate } from "@/components/storefront/templates"
import { getCatalog } from "@/lib/catalog"

export function generateStaticParams() {
  return getCatalog("noord").categories.map((category) => ({
    category: category.slug,
  }))
}

export default function Page(props: PageProps<"/noord/[category]">) {
  return <CategoryTemplate id="noord" params={props.params} />
}

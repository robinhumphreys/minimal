import { CategoryTemplate } from "@/components/storefront/templates"
import { getCatalog } from "@/lib/catalog"

export function generateStaticParams() {
  return getCatalog("volta").categories.map((category) => ({
    category: category.slug,
  }))
}

export default function Page(props: PageProps<"/volta/[category]">) {
  return <CategoryTemplate id="volta" params={props.params} />
}

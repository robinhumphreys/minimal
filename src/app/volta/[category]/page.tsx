import type { Metadata } from "next"

import { CategoryPage } from "@/components/volta/category-page"
import { getCatalog, getCategory } from "@/lib/catalog"

export function generateStaticParams() {
  return getCatalog("volta").categories.map((category) => ({
    category: category.slug,
  }))
}

export async function generateMetadata(
  props: PageProps<"/volta/[category]">,
): Promise<Metadata> {
  const { category: slug } = await props.params
  const category = getCategory("volta", slug)
  if (!category) return {}

  return {
    title: `${category.name} — Volta`,
    description: category.description,
  }
}

export default function Page(props: PageProps<"/volta/[category]">) {
  return (
    <CategoryPage
      params={props.params}
      searchParams={props.searchParams}
    />
  )
}

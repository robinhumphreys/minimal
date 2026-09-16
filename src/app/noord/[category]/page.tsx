import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { CategoryPage } from "@/components/noord/category-page"
import { getCatalog, getCategory } from "@/lib/catalog"

export function generateStaticParams() {
  return getCatalog("noord").categories.map((category) => ({
    category: category.slug,
  }))
}

export async function generateMetadata(
  props: PageProps<"/noord/[category]">,
): Promise<Metadata> {
  const { category: slug } = await props.params
  const category = getCategory("noord", slug)
  if (!category) return {}
  return { title: `${category.name} — Noord Suits`, description: category.description }
}

export default async function Page(props: PageProps<"/noord/[category]">) {
  const { category: slug } = await props.params
  if (!getCategory("noord", slug)) notFound()
  return <CategoryPage slug={slug} />
}

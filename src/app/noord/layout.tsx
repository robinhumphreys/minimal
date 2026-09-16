import Script from "next/script"

import { NoordShell } from "@/components/noord/noord-shell"
import { navModel, searchIndex } from "@/lib/noord/catalog-view"

export default function NoordLayout({ children }: LayoutProps<"/noord">) {
  // Built here rather than in the shell: the catalog reads `node:fs`, so it can
  // only be touched from a server component.
  return (
    <>
      <NoordShell nav={navModel()} searchIndex={searchIndex()}>
        {children}
      </NoordShell>
      <minimal-agent-bar />
      <Script src="/embed.js" data-agent="noord" strategy="afterInteractive" />
    </>
  )
}

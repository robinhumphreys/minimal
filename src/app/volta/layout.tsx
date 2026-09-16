import Script from "next/script"

import { VoltaShell } from "@/components/volta/volta-shell"
import { navModel, searchIndex } from "@/lib/volta/catalog-view"

export default function VoltaLayout({ children }: LayoutProps<"/volta">) {
  // Built here rather than in the shell: the catalog reads `node:fs`, so it can
  // only be touched from a server component.
  return (
    <>
      <VoltaShell nav={navModel()} searchIndex={searchIndex()}>
        {children}
      </VoltaShell>
      {/* The agent. The same tag a merchant pastes into their own site, and
          the only line of it the storefront knows about. */}
      <Script src="/embed.js" data-agent="volta" strategy="afterInteractive" />
    </>
  )
}

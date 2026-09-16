import { VoltaShell } from "@/components/volta/volta-shell"
import { navModel, searchIndex } from "@/lib/volta/catalog-view"

export default function VoltaLayout({ children }: LayoutProps<"/volta">) {
  // Built here rather than in the shell: the catalog reads `node:fs`, so it can
  // only be touched from a server component.
  return (
    <VoltaShell nav={navModel()} searchIndex={searchIndex()}>
      {children}
    </VoltaShell>
  )
}

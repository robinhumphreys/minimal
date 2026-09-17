import { NoordShell } from "@/components/noord/noord-shell"
import { navModel, searchIndex } from "@/lib/noord/catalog-view"
import { AgentEmbed } from "@/components/embed/agent-embed"

export default function NoordLayout({ children }: LayoutProps<"/noord">) {
  // Built here rather than in the shell: the catalog reads `node:fs`, so it can
  // only be touched from a server component.
  return (
    <>
      <NoordShell nav={navModel()} searchIndex={searchIndex()}>
        {children}
      </NoordShell>
      <AgentEmbed brand="noord" />
    </>
  )
}

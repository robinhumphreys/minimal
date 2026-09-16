"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export type NavItem = {
  title: string
  icon: React.ReactNode
  /**
   * Omitted while the screen does not exist yet. Placeholders still render and
   * still show their tooltip on the collapsed rail — the rhythm of the rail is
   * the point — they just go nowhere.
   */
  href?: string
}

export type NavGroup = {
  label?: string
  items: NavItem[]
}

/**
 * The icon rail's nav. Groups are separated by nothing but their own padding:
 * when the sidebar is collapsed the labels fade out and the gaps are what
 * remain, which is what gives the rail its grouping.
 */
export function NavMain({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname()

  return (
    <>
      {groups.map((group, index) => (
        <SidebarGroup key={group.label ?? index}>
          {group.label ? (
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          ) : null}
          <SidebarMenu>
            {group.items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={item.href ? pathname.startsWith(item.href) : false}
                  className={
                    item.href ? undefined : "text-sidebar-foreground/60"
                  }
                  render={
                    item.href ? (
                      <Link href={item.href} />
                    ) : (
                      <a href="#" aria-label={`${item.title} (coming soon)`} />
                    )
                  }
                >
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}

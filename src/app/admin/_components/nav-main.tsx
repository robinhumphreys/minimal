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
  /** Omitted while the screen doesn't exist yet; placeholders still render and tooltip, they just go nowhere. */
  href?: string
}

export type NavGroup = {
  label?: string
  items: NavItem[]
}

/** Groups are separated only by padding, so when the sidebar collapses and labels fade, the gaps still read as grouping. */
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
                  isActive={
                    item.href
                      ? pathname === item.href ||
                        pathname.startsWith(`${item.href}/`)
                      : false
                  }
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

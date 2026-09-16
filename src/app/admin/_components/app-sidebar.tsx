"use client"

import {
  BookOpenIcon,
  BotIcon,
  BrainIcon,
  ChartColumnIcon,
  ChartLineIcon,
  MessageSquareIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  PlayIcon,
  ReceiptIcon,
  Settings2Icon,
  Share2Icon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"

import { AccountSwitcher } from "./account-switcher"
import { MinimalLogo } from "./minimal-logo"
import { NavMain, type NavGroup } from "./nav-main"

// There is no auth, so the signed-in operator is a placeholder.
const USER = { name: "Merchant admin", initials: "MA" }

// Only "Agent" is wired up. The rest name the screens this admin is meant to
// grow into, so the rail has the shape it will eventually need.
const NAV: NavGroup[] = [
  {
    items: [{ title: "Agent", icon: <SparklesIcon />, href: "/admin" }],
  },
  {
    label: "Manage",
    items: [
      { title: "Conversations", icon: <MessageSquareIcon /> },
      { title: "Knowledge", icon: <BrainIcon /> },
      { title: "Playground", icon: <PlayIcon /> },
      { title: "Automations", icon: <BotIcon /> },
      { title: "Integrations", icon: <Share2Icon /> },
    ],
  },
  {
    label: "Insights",
    items: [
      { title: "Analytics", icon: <ChartColumnIcon /> },
      { title: "Reports", icon: <ChartLineIcon /> },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Billing", icon: <ReceiptIcon /> },
      { title: "Customers", icon: <UsersIcon /> },
      { title: "Settings", icon: <Settings2Icon /> },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Brand />
        <AccountSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={NAV} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator className="mx-0" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Documentation"
              className="text-sidebar-foreground/60"
              render={<a href="#" />}
            >
              <BookOpenIcon />
              <span>Documentation</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <CollapseToggle />
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={USER.name} render={<a href="#" />}>
              <Avatar size="sm" className="size-4 shrink-0">
                <AvatarFallback className="text-[0.5rem]">
                  {USER.initials}
                </AvatarFallback>
              </Avatar>
              <span>{USER.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

/**
 * Minimal AI's own mark, at the head of the rail. Deliberately not a button:
 * the product name is a label, and the rail below it is what you click.
 */
function Brand() {
  return (
    <div className="flex h-8 items-center gap-2 px-2 text-sidebar-foreground">
      <MinimalLogo className="size-4" />
      <span className="truncate text-sm font-medium group-data-[collapsible=icon]:hidden">
        Minimal AI
      </span>
    </div>
  )
}

/** The expand/collapse control that lives at the foot of the rail. */
function CollapseToggle() {
  const { state, toggleSidebar } = useSidebar()
  const collapsed = state === "collapsed"
  const label = collapsed ? "Expand sidebar" : "Collapse sidebar"

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={label}
        onClick={toggleSidebar}
        className="text-sidebar-foreground/60"
      >
        {collapsed ? <PanelLeftOpenIcon /> : <PanelLeftCloseIcon />}
        <span>{label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

"use client"

import {
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

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { AccountSwitcher } from "./account-switcher"
import { NavMain, type NavGroup } from "./nav-main"

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
    // `pt-14` clears the shell's top bar: the sidebar container is fixed to the
    // viewport, so it would otherwise start underneath the logo.
    <Sidebar collapsible="icon" className="pt-14" {...props}>
      <SidebarHeader>
        <AccountSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={NAV} />
      </SidebarContent>
      <SidebarFooter>
        <CollapseToggle />
      </SidebarFooter>
    </Sidebar>
  )
}

/** The expand/collapse control that lives at the foot of the rail. */
function CollapseToggle() {
  const { state, toggleSidebar } = useSidebar()
  const collapsed = state === "collapsed"
  const label = collapsed ? "Expand sidebar" : "Collapse sidebar"

  return (
    <SidebarMenu>
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
    </SidebarMenu>
  )
}

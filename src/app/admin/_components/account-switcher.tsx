"use client"

import { ChevronsUpDownIcon } from "lucide-react"

import { BrandMark } from "@/components/brand/brand-mark"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { BRAND_IDS, type BrandId } from "@/lib/catalog/types"
import { defaults } from "@/lib/config/defaults"
import { useAdminStore } from "@/lib/store/admin"

/**
 * The merchant accounts this admin can configure. There is no accounts API, so
 * the list is the set of brands the catalog ships with, named from their
 * default config.
 */
const ACCOUNTS: { id: BrandId; name: string }[] = BRAND_IDS.map((id) => ({
  id,
  name: defaults[id].name,
}))

/**
 * Switches which merchant the whole admin is editing. `active` lives in the
 * admin store rather than the URL, so every screen — this one included —
 * follows the switch without a navigation.
 */
export function AccountSwitcher() {
  const { isMobile } = useSidebar()
  const active = useAdminStore((state) => state.active)
  const setActive = useAdminStore((state) => state.setActive)
  const account = ACCOUNTS.find((entry) => entry.id === active) ?? ACCOUNTS[0]

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
              />
            }
          >
            {/* Forced: `SidebarMenuButton` sizes every descendant `svg` to
                `size-4`, which is right for an icon and wrong for a logo — and at
                that size `rounded-lg` is half the width, so the square field
                came out a circle. */}
            <BrandMark brand={account.id} className="size-8! rounded-lg" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{account.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                Account
              </span>
            </div>
            <ChevronsUpDownIcon className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-48"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Accounts
              </DropdownMenuLabel>
              {ACCOUNTS.map((entry) => (
                <DropdownMenuItem
                  key={entry.id}
                  onClick={() => setActive(entry.id)}
                  className="gap-2 p-2"
                >
                  <BrandMark brand={entry.id} className="size-6 rounded-sm" />
                  {entry.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

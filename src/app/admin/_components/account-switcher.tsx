"use client"

import { usePathname, useRouter } from "next/navigation"
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
 * Switches which merchant the whole admin is editing. The organisation is
 * the first segment of the address, so switching is a navigation to the same
 * screen under the other slug; the store follows the address from there.
 */
export function AccountSwitcher({ org }: { org: BrandId }) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const pathname = usePathname()
  const account = ACCOUNTS.find((entry) => entry.id === org) ?? ACCOUNTS[0]
  const switchTo = (id: BrandId) =>
    router.push(pathname.replace(`/admin/${org}`, `/admin/${id}`))

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
                  onClick={() => switchTo(entry.id)}
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

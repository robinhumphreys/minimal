"use client"

import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"

/**
 * The way forward on every admin screen, in Minimal's own blue: the one
 * button on a screen that is the product speaking rather than the merchant.
 */
export function NextButton({
  href,
  onClick,
  disabled,
  children,
  icon = <ArrowRightIcon />,
  className,
}: {
  href?: string
  onClick?: () => void
  disabled?: boolean
  children: React.ReactNode
  icon?: React.ReactNode
  className?: string
}) {
  const classes = cn(
    "h-11 gap-2 bg-brand px-6 text-base text-white hover:bg-brand/90 focus-visible:ring-brand/40",
    className,
  )
  if (href) {
    return (
      <Button
        size="lg"
        disabled={disabled}
        nativeButton={false}
        render={<Link href={href} />}
        className={classes}
      >
        {children}
        {icon}
      </Button>
    )
  }
  return (
    <Button size="lg" disabled={disabled} onClick={onClick} className={classes}>
      {children}
      {icon}
    </Button>
  )
}

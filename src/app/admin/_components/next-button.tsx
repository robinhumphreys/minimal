"use client"

import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"

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
  // The same size as whatever sits beside it; only the colour is its own.
  const classes = cn(
    "gap-2 bg-brand px-5 text-white hover:bg-brand/90 focus-visible:ring-brand/40",
    className,
  )
  // A disabled link is still a link; a disabled button is a wall.
  if (href && !disabled) {
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

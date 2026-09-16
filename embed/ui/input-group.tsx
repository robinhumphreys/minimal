"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../cn"

import { Button } from "./button"
import { Input } from "./input"
import { Textarea } from "./textarea"

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "ma:group/input-group ma:relative ma:flex ma:h-8 ma:w-full ma:min-w-0 ma:items-center ma:rounded-lg ma:border ma:border-input ma:transition-colors ma:outline-none ma:in-data-[slot=combobox-content]:focus-within:border-inherit ma:in-data-[slot=combobox-content]:focus-within:ring-0 ma:has-disabled:bg-input/50 ma:has-disabled:opacity-50 ma:has-[[data-slot=input-group-control]:focus-visible]:border-ring ma:has-[[data-slot=input-group-control]:focus-visible]:ring-3 ma:has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 ma:has-[[data-slot][aria-invalid=true]]:border-destructive ma:has-[[data-slot][aria-invalid=true]]:ring-3 ma:has-[[data-slot][aria-invalid=true]]:ring-destructive/20 ma:has-[>[data-align=block-end]]:h-auto ma:has-[>[data-align=block-end]]:flex-col ma:has-[>[data-align=block-start]]:h-auto ma:has-[>[data-align=block-start]]:flex-col ma:has-[>textarea]:h-auto ma:dark:bg-input/30 ma:dark:has-disabled:bg-input/80 ma:dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 ma:has-[>[data-align=block-end]]:[&>input]:pt-3 ma:has-[>[data-align=block-start]]:[&>input]:pb-3 ma:has-[>[data-align=inline-end]]:[&>input]:pr-1.5 ma:has-[>[data-align=inline-start]]:[&>input]:pl-1.5",
        className,
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "ma:flex ma:h-auto ma:cursor-text ma:items-center ma:justify-center ma:gap-2 ma:py-1.5 ma:text-sm ma:font-medium ma:text-muted-foreground ma:select-none ma:group-data-[disabled=true]/input-group:opacity-50 ma:[&>kbd]:rounded-[calc(var(--radius)-5px)] ma:[&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start":
          "ma:order-first ma:pl-2 ma:has-[>button]:ml-[-0.3rem] ma:has-[>kbd]:ml-[-0.15rem]",
        "inline-end":
          "ma:order-last ma:pr-2 ma:has-[>button]:mr-[-0.3rem] ma:has-[>kbd]:mr-[-0.15rem]",
        "block-start":
          "ma:order-first ma:w-full ma:justify-start ma:px-2.5 ma:pt-2 ma:group-has-[>input]/input-group:pt-2 ma:[.border-b]:pb-2",
        "block-end":
          "ma:order-last ma:w-full ma:justify-start ma:px-2.5 ma:pb-2 ma:group-has-[>input]/input-group:pb-2 ma:[.border-t]:pt-2",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  },
)

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus()
      }}
      {...props}
    />
  )
}

const inputGroupButtonVariants = cva(
  "ma:flex ma:items-center ma:gap-2 ma:text-sm ma:shadow-none",
  {
    variants: {
      size: {
        xs: "ma:h-6 ma:gap-1 ma:rounded-[calc(var(--radius)-3px)] ma:px-1.5 ma:[&>svg:not([class*='size-'])]:size-3.5",
        sm: "",
        "icon-xs":
          "ma:size-6 ma:rounded-[calc(var(--radius)-3px)] ma:p-0 ma:has-[>svg]:p-0",
        "icon-sm": "ma:size-8 ma:p-0 ma:has-[>svg]:p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  },
)

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "type"> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: "button" | "submit" | "reset"
  }) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "ma:flex ma:items-center ma:gap-2 ma:text-sm ma:text-muted-foreground ma:[&_svg]:pointer-events-none ma:[&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "ma:flex-1 ma:rounded-none ma:border-0 ma:bg-transparent ma:shadow-none ma:ring-0 ma:focus-visible:ring-0 ma:disabled:bg-transparent ma:aria-invalid:ring-0 ma:dark:bg-transparent ma:dark:disabled:bg-transparent",
        className,
      )}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "ma:flex-1 ma:resize-none ma:rounded-none ma:border-0 ma:bg-transparent ma:py-2 ma:shadow-none ma:ring-0 ma:focus-visible:ring-0 ma:disabled:bg-transparent ma:aria-invalid:ring-0 ma:dark:bg-transparent ma:dark:disabled:bg-transparent",
        className,
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}

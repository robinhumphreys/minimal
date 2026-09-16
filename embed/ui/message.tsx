import * as React from "react"
import { cn } from "../cn"

function MessageGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-group"
      className={cn("ma:flex ma:min-w-0 ma:flex-col ma:gap-2", className)}
      {...props}
    />
  )
}

function Message({
  className,
  align = "start",
  ...props
}: React.ComponentProps<"div"> & { align?: "start" | "end" }) {
  return (
    <div
      data-slot="message"
      data-align={align}
      className={cn(
        "ma:group/message ma:relative ma:flex ma:w-full ma:min-w-0 ma:gap-2 ma:text-sm ma:data-[align=end]:flex-row-reverse",
        className,
      )}
      {...props}
    />
  )
}

function MessageAvatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-avatar"
      className={cn(
        "ma:flex ma:w-fit ma:min-w-8 ma:shrink-0 ma:items-center ma:justify-center ma:self-end ma:overflow-hidden ma:rounded-full ma:bg-muted ma:group-has-data-[slot=message-footer]/message:-translate-y-8",
        className,
      )}
      {...props}
    />
  )
}

function MessageContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-content"
      className={cn(
        "ma:flex ma:w-full ma:min-w-0 ma:flex-col ma:gap-2.5 ma:wrap-break-word ma:group-data-[align=end]/message:*:data-slot:self-end",
        className,
      )}
      {...props}
    />
  )
}

function MessageHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-header"
      className={cn(
        "ma:flex ma:max-w-full ma:min-w-0 ma:items-center ma:px-3 ma:text-xs ma:font-medium ma:text-muted-foreground ma:group-has-data-[variant=ghost]/message:px-0",
        className,
      )}
      {...props}
    />
  )
}

function MessageFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-footer"
      className={cn(
        "ma:flex ma:max-w-full ma:min-w-0 ma:items-center ma:px-3 ma:text-xs ma:font-medium ma:text-muted-foreground ma:group-has-data-[variant=ghost]/message:px-0 ma:group-data-[align=end]/message:justify-end",
        className,
      )}
      {...props}
    />
  )
}

export {
  MessageGroup,
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
}

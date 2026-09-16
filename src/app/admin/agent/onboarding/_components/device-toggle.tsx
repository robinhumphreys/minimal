"use client"

import { MonitorIcon, SmartphoneIcon } from "lucide-react"
import { cn } from "cn"

export type Device = "desktop" | "mobile"

/**
 * Which of the shopper's screens the preview stands in for. Sits in the
 * preview's own corner rather than the tray: it changes what the left half
 * shows, and nothing else.
 */
export function DeviceToggle({
  value,
  onChange,
  className,
}: {
  value: Device
  onChange: (device: Device) => void
  className?: string
}) {
  return (
    <div
      role="group"
      aria-label="Preview device"
      className={cn(
        "flex gap-0.5 rounded-full border bg-card p-0.5 shadow-sm",
        className,
      )}
    >
      {(
        [
          { value: "desktop", label: "Desktop", Icon: MonitorIcon },
          { value: "mobile", label: "Mobile", Icon: SmartphoneIcon },
        ] as const
      ).map((option) => (
        <button
          key={option.value}
          type="button"
          aria-label={option.label}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "flex size-7 items-center justify-center rounded-full transition-colors",
            value === option.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <option.Icon className="size-3.5" />
        </button>
      ))}
    </div>
  )
}

/**
 * A phone's worth of screen, for the previews to render into when the toggle
 * says mobile. Just the viewport — no bezel, no notch. What is being judged
 * is the surface at that width, and a drawn-on handset only gets in the way.
 */
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-full max-h-[44rem] w-[375px] max-w-full overflow-hidden rounded-xl bg-background shadow-2xl ring-1 ring-foreground/10">
      {children}
    </div>
  )
}

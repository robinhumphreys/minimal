"use client"

import { MonitorIcon, SmartphoneIcon } from "lucide-react"
import { cn } from "cn"

export type Device = "desktop" | "mobile"

/** Sits in the preview's own corner rather than the tray, since it only changes what the left half shows. */
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

/** The phone frame is drawn by class alone, not a wrapper, so toggling device never remounts children and loses their state. */
export function DeviceStage({
  device,
  align = "center",
  children,
}: {
  device: Device
  align?: "start" | "center"
  children: React.ReactNode
}) {
  const mobile = device === "mobile"
  return (
    <div
      className={cn(
        "absolute inset-0",
        mobile && "flex justify-center p-6",
        mobile && (align === "start" ? "items-start" : "items-center"),
      )}
    >
      <div
        className={cn(
          "relative h-full",
          mobile
            ? "max-h-[44rem] w-[375px] max-w-full overflow-hidden rounded-xl border-2 border-foreground/10"
            : "w-full",
        )}
      >
        {children}
      </div>
    </div>
  )
}

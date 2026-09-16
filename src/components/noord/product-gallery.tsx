"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "cn"

/**
 * Swipeable, snapping gallery with a position readout on a phone; a stacked
 * column from `lg` up, where the buy panel sits alongside it.
 */
export function ProductGallery({
  images,
  alt,
}: {
  images: string[]
  alt: string
}) {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const [active, setActive] = React.useState(0)

  // Derives the index from scroll position rather than tracking swipes, so it
  // stays correct however the shopper moves the track.
  const onScroll = React.useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const index = Math.round(track.scrollLeft / track.clientWidth)
    setActive(Math.min(Math.max(index, 0), images.length - 1))
  }, [images.length])

  return (
    <div className="lg:flex lg:flex-col lg:gap-1">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto lg:flex-col lg:overflow-visible"
      >
        {images.map((image, index) => (
          <div
            key={image}
            className="relative aspect-[3/4] w-full shrink-0 snap-start bg-noord-wash"
          >
            <Image
              src={image}
              alt={index === 0 ? alt : ""}
              fill
              priority={index === 0}
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 py-3 lg:hidden">
          {images.map((image, index) => (
            <span
              key={image}
              aria-hidden
              className={cn(
                "h-px w-6 transition-colors",
                index === active ? "bg-noord-ink" : "bg-noord-line-strong",
              )}
            />
          ))}
          <span className="sr-only">
            Image {active + 1} of {images.length}
          </span>
        </div>
      )}
    </div>
  )
}

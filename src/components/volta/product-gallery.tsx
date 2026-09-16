"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "cn"

/**
 * The PDP image gallery.
 *
 * A snap-scrolling strip on a phone with dots under it, and a click-to-swap
 * thumbnail column from `md` up. One component rather than two so the selected
 * index stays shared: scrolling the strip moves the dots, clicking a thumb
 * moves the main image.
 */
export function ProductGallery({
  images,
  name,
}: {
  images: string[]
  name: string
}) {
  const [index, setIndex] = React.useState(0)
  const stripRef = React.useRef<HTMLUListElement>(null)

  // Derive the active dot from scroll position rather than tracking taps: the
  // strip is swiped far more often than the dots are read.
  function onScroll() {
    const strip = stripRef.current
    if (!strip) return
    setIndex(Math.round(strip.scrollLeft / strip.clientWidth))
  }

  return (
    <div className="flex flex-col gap-3 md:flex-row md:gap-4">
      {/* Phone: swipeable strip. */}
      <div className="flex flex-col gap-3 md:hidden">
        <ul
          ref={stripRef}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, i) => (
            <li key={image} className="w-full shrink-0 snap-center">
              <div className="relative aspect-square bg-white">
                <Image
                  src={image}
                  alt={i === 0 ? name : `${name}, view ${i + 1}`}
                  fill
                  preload={i === 0}
                  sizes="100vw"
                  className="object-contain p-6"
                />
              </div>
            </li>
          ))}
        </ul>

        {images.length > 1 && (
          <div className="flex justify-center gap-1.5" aria-hidden>
            {images.map((image, i) => (
              <span
                key={image}
                className={cn(
                  "h-1 w-6 rounded-volta-pill transition-colors",
                  i === index ? "bg-volta-volt" : "bg-volta-line",
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Tablet and up: thumbnails beside a fixed main image. */}
      {images.length > 1 && (
        <ul className="hidden shrink-0 flex-col gap-2 md:flex">
          {images.map((image, i) => (
            <li key={image}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`View image ${i + 1} of ${images.length}`}
                aria-pressed={i === index}
                className={cn(
                  "relative block size-20 overflow-hidden rounded-volta border-2 bg-white transition-colors",
                  i === index
                    ? "border-volta-volt"
                    : "border-volta-line hover:border-volta-line-strong",
                )}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-contain p-1.5"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="relative hidden aspect-square flex-1 rounded-volta bg-white md:block">
        <Image
          src={images[index]}
          alt={name}
          fill
          preload
          sizes="(min-width: 1024px) 45vw, 60vw"
          className="object-contain p-10"
        />
      </div>
    </div>
  )
}

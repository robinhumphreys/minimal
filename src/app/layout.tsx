import type { Metadata, Viewport } from "next"
import { Archivo, Geist_Mono, IBM_Plex_Sans, Inter } from "next/font/google"
import "./globals.css"

// The `opsz` axis lets the same file serve as Inter for reading and Inter Display for titles.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  axes: ["opsz"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

// Titles only: without the `wdth` axis, and at prose sizes, it's a poster face doing a paragraph's job.
const voltaDisplay = Archivo({
  variable: "--font-volta-display-sans",
  subsets: ["latin"],
  axes: ["wdth"],
})

// Plex, not Inter, since Noord already owns Inter and sharing a body face would blur the line between the storefronts.
const voltaText = IBM_Plex_Sans({
  variable: "--font-volta-text-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const noordSans = Inter({
  variable: "--font-noord-sans",
  subsets: ["latin"],
})

// Declared on <html>, not in each brand's own layout, so the variables still resolve inside dialogs portaled to document.body.
export const metadata: Metadata = {
  title: "Minimal AI",
  description:
    "An AI storefront agent a merchant sets up once and installs with one script tag.",
}

// The on-screen keyboard shrinks the layout viewport, so `fixed` and `dvh`
// surfaces sit on it rather than under it. Chrome and Firefox honour this
// today; Safari does not yet, and `useVisualViewport` covers it there.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} ${voltaDisplay.variable} ${voltaText.variable} ${noordSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  )
}

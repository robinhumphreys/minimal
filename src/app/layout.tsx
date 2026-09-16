import type { Metadata } from "next"
import {
  Archivo,
  Geist,
  Geist_Mono,
  IBM_Plex_Sans,
  Inter,
} from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

// Volta's headline face. The `wdth` axis is what makes the display voice —
// without it the type collapses to a plain heavy sans. Titles only: at prose
// and label sizes it is a poster face doing a paragraph's job.
const voltaDisplay = Archivo({
  variable: "--font-volta-display-sans",
  subsets: ["latin"],
  axes: ["wdth"],
})

// Volta's reading face: prose, buttons, nav, spec rows. Plex rather than Inter
// because Noord already owns Inter, and two storefronts in one repo sharing a
// body face would blur the line between them.
const voltaText = IBM_Plex_Sans({
  variable: "--font-volta-text-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

// Noord's grotesque.
const noordSans = Inter({
  variable: "--font-noord-sans",
  subsets: ["latin"],
})

// Both brands' fonts are declared on <html> rather than in their own layouts so
// the variables still resolve inside dialogs, which portal to document.body.
export const metadata: Metadata = {
  title: "new-york-v3",
  description: "",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${voltaDisplay.variable} ${voltaText.variable} ${noordSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  )
}

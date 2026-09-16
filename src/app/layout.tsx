import type { Metadata } from "next";
import { Archivo, Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Volta's grotesque. The `wdth` axis is what makes the headline voice — without
// it the display type collapses to a plain heavy sans.
const archivo = Archivo({
  variable: "--font-volta-sans",
  subsets: ["latin"],
  axes: ["wdth"],
});

// Noord's grotesque.
const noordSans = Inter({
  variable: "--font-noord-sans",
  subsets: ["latin"],
});

// Both brands' fonts are declared on <html> rather than in their own layouts so
// the variables still resolve inside dialogs, which portal to document.body.
export const metadata: Metadata = {
  title: "new-york-v3",
  description: "",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${archivo.variable} ${noordSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

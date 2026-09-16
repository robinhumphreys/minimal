import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Noord's grotesque. Declared on <html> rather than in the Noord layout so the
// variable still resolves inside dialogs, which portal to document.body.
const noordSans = Inter({
  variable: "--font-noord-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "new-york-v3",
  description: "",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${noordSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

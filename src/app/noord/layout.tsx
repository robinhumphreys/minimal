import Script from "next/script"

export default function NoordLayout({ children }: LayoutProps<"/noord">) {
  return (
    <>
      {children}
      <minimal-agent-bar />
      <Script src="/embed.js" data-agent="noord" strategy="afterInteractive" />
    </>
  )
}

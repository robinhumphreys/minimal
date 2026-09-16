import Script from "next/script"

export default function VoltaLayout({ children }: LayoutProps<"/volta">) {
  return (
    <>
      {children}
      <minimal-agent-bar />
      <Script src="/embed.js" data-agent="volta" strategy="afterInteractive" />
    </>
  )
}

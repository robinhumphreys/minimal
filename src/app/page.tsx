import Link from "next/link"

export default function Page() {
  return (
    <div className="flex flex-col gap-2 p-8">
      <h1 className="text-2xl">Minimal</h1>
      <Link href="/admin/noord/agent/onboarding" className="underline">
        Onboarding: Noord Suits
      </Link>
      <Link href="/admin/volta/agent/onboarding" className="underline">
        Onboarding: Volta
      </Link>
      <Link href="/noord" className="underline">
        Noord storefront
      </Link>
      <Link href="/volta" className="underline">
        Volta storefront
      </Link>
      <Link href="/debug" className="underline">
        Surfaces on fixtures
      </Link>
    </div>
  )
}

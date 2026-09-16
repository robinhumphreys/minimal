import Link from "next/link"

export default function Page() {
  return (
    <div className="flex flex-col gap-2 p-8">
      <h1 className="text-2xl">Minimal</h1>
      <Link href="/admin" className="underline">
        Admin
      </Link>
      <Link href="/noord" className="underline">
        Noord storefront
      </Link>
      <Link href="/volta" className="underline">
        Volta storefront
      </Link>
    </div>
  )
}

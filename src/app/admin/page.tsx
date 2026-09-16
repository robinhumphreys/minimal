import { redirect } from "next/navigation"

/**
 * There is no admin without an organisation in the address. The first brand
 * the catalogue ships with is where a bare `/admin` lands.
 */
export default function Page() {
  redirect("/admin/noord/agent/onboarding")
}

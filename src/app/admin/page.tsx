import { redirect } from "next/navigation"

/** There is no admin without an organisation in the address, so a bare `/admin` lands on the first brand. */
export default function Page() {
  redirect("/admin/noord/agent/onboarding")
}

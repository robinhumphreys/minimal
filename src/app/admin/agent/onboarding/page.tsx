import { redirect } from "next/navigation"

/** The flow has no landing page of its own; it starts at its first step. */
export default function Page() {
  redirect("/admin/agent/onboarding/step-1")
}

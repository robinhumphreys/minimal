import { redirect } from "next/navigation"

/** The flow has no landing page of its own; it starts at its first step. */
export default async function Page({
  params,
}: PageProps<"/admin/[org]/agent/onboarding">) {
  const { org } = await params
  redirect(`/admin/${org}/agent/onboarding/step-1`)
}

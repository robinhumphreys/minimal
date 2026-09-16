import { InstallStep } from "../_components/install-step"

export default async function Page({
  params,
}: PageProps<"/admin/[org]/agent/onboarding/step-5">) {
  const { org } = await params
  // Finish opens the site the agent was just installed on.
  return <InstallStep next={`/${org}`} />
}

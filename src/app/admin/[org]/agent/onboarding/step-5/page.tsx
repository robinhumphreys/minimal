import { InstallStep } from "../_components/install-step"

export default async function Page({
  params,
}: PageProps<"/admin/[org]/agent/onboarding/step-5">) {
  const { org } = await params
  return <InstallStep next={`/admin/${org}/agent`} />
}

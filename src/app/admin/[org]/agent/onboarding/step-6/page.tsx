import { PlacementStep } from "../_components/placement-step"

export default async function Page({
  params,
}: PageProps<"/admin/[org]/agent/onboarding/step-6">) {
  const { org } = await params
  return <PlacementStep next={`/admin/${org}/agent`} />
}

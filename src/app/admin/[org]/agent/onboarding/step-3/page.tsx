import { FeaturesStep } from "../_components/features-step"

export default async function Page({
  params,
}: PageProps<"/admin/[org]/agent/onboarding/step-3">) {
  const { org } = await params
  return <FeaturesStep next={`/admin/${org}/agent/onboarding/step-4`} />
}

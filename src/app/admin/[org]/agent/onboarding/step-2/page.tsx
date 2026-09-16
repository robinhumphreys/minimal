import { MatchingStep } from "../_components/matching-step"

export default async function Page({
  params,
}: PageProps<"/admin/[org]/agent/onboarding/step-2">) {
  const { org } = await params
  return <MatchingStep next={`/admin/${org}/agent/onboarding/step-3`} />
}

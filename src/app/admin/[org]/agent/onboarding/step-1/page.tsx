import { IntroStep } from "../_components/intro-step"

export default async function Page({
  params,
}: PageProps<"/admin/[org]/agent/onboarding/step-1">) {
  const { org } = await params
  return <IntroStep next={`/admin/${org}/agent/onboarding/step-2`} />
}

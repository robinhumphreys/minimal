import { SurfaceStudio } from "../_components/surface-studio"

export default async function Page({
  params,
}: PageProps<"/admin/[org]/agent/onboarding/step-4">) {
  const { org } = await params
  return <SurfaceStudio next={`/admin/${org}/agent/onboarding/step-5`} />
}

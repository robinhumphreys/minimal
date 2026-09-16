import { SurfaceStudio } from "./onboarding/_components/surface-studio"

/**
 * The agent, after onboarding: the same studio, with Publish. Changes are
 * drafts until published, and the site keeps the last published version
 * until then.
 */
export default function Page() {
  return <SurfaceStudio mode="manage" />
}

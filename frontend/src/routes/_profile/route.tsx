import { getSelectedProfileId } from "@/entities/profile"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_profile")({
  beforeLoad: () => {
    const profileId = getSelectedProfileId()

    if (!profileId) {
      throw redirect({
        to: "/profiles",
        replace: true,
      })
    }

    return { profileId }
  },

  component: ProfileLayout,
})

function ProfileLayout() {
  return (
    <>
      <Outlet />
    </>
  )
}

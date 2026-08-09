import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/_profile/recap")({
  staticData: {
    hideHeader: true,
  },

  component: RecapLayout,
})

function RecapLayout() {
  return (
    <div className='min-h-dvh bg-background text-foreground'>
      <Outlet />
    </div>
  )
}

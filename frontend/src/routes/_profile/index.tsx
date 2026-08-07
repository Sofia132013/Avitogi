import { HomePage } from "@/pages/home"
import { createFileRoute } from "@tanstack/react-router"

function HomeRoute() {
  return <HomePage />
}

export const Route = createFileRoute("/_profile/")({
  component: HomeRoute,
})

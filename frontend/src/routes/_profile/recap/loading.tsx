import { RecapLoadingPage } from "@/pages/recap-loading"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_profile/recap/loading")({
  component: RecapLoadingPage,
})

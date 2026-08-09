import { RecapPage } from "@/pages/recap"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_profile/recap/")({
  component: RecapPage,
})

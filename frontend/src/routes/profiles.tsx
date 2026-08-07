import { ProfileSelectPage } from "@/pages/profile-select"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/profiles")({
  component: ProfileSelectPage,
})

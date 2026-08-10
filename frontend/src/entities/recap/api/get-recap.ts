import { env } from "@/app/env"
import type { ProfileId } from "@/entities/profile"
import { recapResponseSchema, type RecapResponse } from "../model/recap"

export async function getRecap(userId: ProfileId, signal?: AbortSignal): Promise<RecapResponse> {
  const apiBaseUrl = env.VITE_API_BASE_URL.replace(/\/+$/, "")

  const searchParams = new URLSearchParams({
    user_id: String(userId),
  })

  const response = await fetch(`${apiBaseUrl}/recap?${searchParams.toString()}`, {
    headers: {
      Accept: "application/json",
    },
    signal,
  })

  if (!response.ok) {
    throw new Error(`Не удалось получить recap: HTTP ${response.status}`)
  }

  const data: unknown = await response.json()

  return recapResponseSchema.parse(data)
}

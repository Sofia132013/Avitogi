import { env } from "@/app/env"
import { profilesSchema, type Profile } from "../model/profiles"

export async function getProfiles(signal?: AbortSignal): Promise<Profile[]> {
  const apiBaseUrl = env.VITE_API_BASE_URL.replace(/\/+$/, "")

  const response = await fetch(`${apiBaseUrl}/profiles`, {
    headers: {
      Accept: "application/json",
    },
    signal,
  })

  if (!response.ok) {
    throw new Error(`Не удалось получить профили: HTTP ${response.status}`)
  }

  const data: unknown = await response.json()

  return profilesSchema.parse(data)
}

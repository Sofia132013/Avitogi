import { env } from "@/app/env"
import { profileSchema, type Profile, type ProfileId } from "../model/profiles"

export async function getProfile(profileId: ProfileId, signal?: AbortSignal): Promise<Profile> {
  const apiBaseUrl = env.VITE_API_BASE_URL.replace(/\/+$/, "")

  const response = await fetch(`${apiBaseUrl}/profiles/${profileId}`, {
    headers: {
      Accept: "application/json",
    },
    signal,
  })

  if (response.status === 404) {
    throw new Error("Профиль не найден")
  }

  if (!response.ok) {
    throw new Error(`Не удалось получить профиль: HTTP ${response.status}`)
  }

  const data: unknown = await response.json()

  return profileSchema.parse(data)
}

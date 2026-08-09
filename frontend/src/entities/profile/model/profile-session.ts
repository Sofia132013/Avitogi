import { env } from "@/app/env"
import { useSyncExternalStore } from "react"
import type { ProfileId } from "./profiles"

const PROFILE_STORAGE_KEY = env.VITE_PROFILE_STORAGE_KEY
const listeners = new Set<() => void>()

function emitChange() {
  listeners.forEach(listener => listener())
}

export function getSelectedProfileId(): ProfileId | null {
  if (typeof window === "undefined") {
    return null
  }

  const storedValue = localStorage.getItem(PROFILE_STORAGE_KEY)

  if (storedValue === null) {
    return null
  }

  const profileId = Number(storedValue)

  return Number.isSafeInteger(profileId) && profileId > 0 ? profileId : null
}

export function selectProfile(id: ProfileId) {
  localStorage.setItem(PROFILE_STORAGE_KEY, String(id))
  emitChange()
}

export function exitProfile() {
  localStorage.removeItem(PROFILE_STORAGE_KEY)
  emitChange()
}

function subscribe(listener: () => void) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export function useSelectedProfileId() {
  return useSyncExternalStore(subscribe, getSelectedProfileId, () => null)
}

import { env } from "@/app/env"
import { useSyncExternalStore } from "react"
import { PROFILES, type ProfileId } from "./profiles"

const PROFILE_STORAGE_KEY = env.VITE_PROFILE_STORAGE_KEY
const listeners = new Set<() => void>()

function emitChange() {
  listeners.forEach(listener => listener())
}

export function getSelectedProfileId(): ProfileId | null {
  const id = localStorage.getItem(PROFILE_STORAGE_KEY)

  const profileExists = PROFILES.some(profile => profile.id === id)

  return profileExists ? (id as ProfileId) : null
}

export function selectProfile(id: ProfileId) {
  localStorage.setItem(PROFILE_STORAGE_KEY, id)
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

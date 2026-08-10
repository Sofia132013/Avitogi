import { queryOptions, skipToken, useQuery } from "@tanstack/react-query"
import type { ProfileId } from "../model/profiles"
import { getProfile } from "./get-profile"
import { getProfiles } from "./get-profiles"

export const profileKeys = {
  all: ["profiles"] as const,

  list: () => [...profileKeys.all, "list"] as const,

  detail: (profileId: ProfileId | null) => [...profileKeys.all, "detail", profileId] as const,
}

export const profilesQueryOptions = queryOptions({
  queryKey: profileKeys.list(),
  queryFn: ({ signal }) => getProfiles(signal),
})

export function useProfiles() {
  return useQuery(profilesQueryOptions)
}

export function useProfile(profileId: ProfileId | null) {
  return useQuery({
    queryKey: profileKeys.detail(profileId),
    queryFn: profileId === null ? skipToken : ({ signal }) => getProfile(profileId, signal),
  })
}

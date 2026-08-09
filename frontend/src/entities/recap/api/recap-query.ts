import type { ProfileId } from "@/entities/profile"
import { queryOptions, useQuery } from "@tanstack/react-query"
import { getRecap } from "./get-recap"
import { getRecapMetrics } from "./get-recap-metrics"

export const recapKeys = {
  all: ["recap"] as const,

  user: (userId: ProfileId) => [...recapKeys.all, userId] as const,

  cards: (userId: ProfileId) => [...recapKeys.user(userId), "cards"] as const,

  metrics: (userId: ProfileId) => [...recapKeys.user(userId), "metrics"] as const,
}

export function recapQueryOptions(userId: ProfileId) {
  return queryOptions({
    queryKey: recapKeys.cards(userId),
    queryFn: ({ signal }) => getRecap(userId, signal),
  })
}

export function recapMetricsQueryOptions(userId: ProfileId) {
  return queryOptions({
    queryKey: recapKeys.metrics(userId),
    queryFn: ({ signal }) => getRecapMetrics(userId, signal),
  })
}

export function useRecap(userId: ProfileId) {
  return useQuery(recapQueryOptions(userId))
}

export function useRecapMetrics(userId: ProfileId) {
  return useQuery(recapMetricsQueryOptions(userId))
}

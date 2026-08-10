import { env } from "@/app/env"
import type { ProfileId } from "@/entities/profile"
import { recapMetricsSchema, type RecapMetrics } from "../model/metrics"

export async function getRecapMetrics(userId: ProfileId, signal?: AbortSignal): Promise<RecapMetrics> {
  const apiBaseUrl = env.VITE_API_BASE_URL.replace(/\/+$/, "")

  const searchParams = new URLSearchParams({
    user_id: String(userId),
  })

  const response = await fetch(`${apiBaseUrl}/metrics?${searchParams.toString()}`, {
    headers: {
      Accept: "application/json",
    },
    signal,
  })

  if (!response.ok) {
    throw new Error(`Не удалось получить метрики: HTTP ${response.status}`)
  }

  const data: unknown = await response.json()

  return recapMetricsSchema.parse(data)
}

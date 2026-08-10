import { describe, expect, it } from "vitest"

import { recapMetricsSchema } from "./metrics"

const validApiMetrics = {
  active_days: 10,
  active_months: 7,
  viewed_ads: 4,
  viewed_categories: 1,
  favorites: 2,
  contacts_started: 2,
  created_ads: 0,
  most_active_month: "2025-08",
}

describe("recapMetricsSchema", () => {
  it("преобразует метрики из snake_case в camelCase", () => {
    const result = recapMetricsSchema.parse(validApiMetrics)

    expect(result).toEqual({
      activeDays: 10,
      activeMonths: 7,
      viewedAds: 4,
      viewedCategories: 1,
      favorites: 2,
      contactsStarted: 2,
      createdAds: 0,
      mostActiveMonth: "2025-08",
    })
  })

  it("принимает нулевые значения метрик", () => {
    const result = recapMetricsSchema.safeParse({
      active_days: 0,
      active_months: 0,
      viewed_ads: 0,
      viewed_categories: 0,
      favorites: 0,
      contacts_started: 0,
      created_ads: 0,
      most_active_month: "",
    })

    expect(result.success).toBe(true)
  })

  it("отклоняет отрицательные значения", () => {
    const result = recapMetricsSchema.safeParse({
      ...validApiMetrics,
      active_days: -1,
    })

    expect(result.success).toBe(false)
  })

  it("отклоняет дробные значения", () => {
    const result = recapMetricsSchema.safeParse({
      ...validApiMetrics,
      viewed_ads: 2.5,
    })

    expect(result.success).toBe(false)
  })

  it("отклоняет ответ с отсутствующей метрикой", () => {
    const metricsWithoutFavorites = {
      active_days: 10,
      active_months: 7,
      viewed_ads: 4,
      viewed_categories: 1,
      contacts_started: 2,
      created_ads: 0,
      most_active_month: "2025-08",
    }

    const result = recapMetricsSchema.safeParse(metricsWithoutFavorites)

    expect(result.success).toBe(false)
  })
})

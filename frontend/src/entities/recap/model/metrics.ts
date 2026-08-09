import { z } from "zod"

export const recapMetricsSchema = z
  .object({
    active_days: z.number().int().nonnegative(),
    active_months: z.number().int().nonnegative(),
    viewed_ads: z.number().int().nonnegative(),
    viewed_categories: z.number().int().nonnegative(),
    favorites: z.number().int().nonnegative(),
    contacts_started: z.number().int().nonnegative(),
    created_ads: z.number().int().nonnegative(),
    most_active_month: z.string(),
  })
  .transform(metrics => ({
    activeDays: metrics.active_days,
    activeMonths: metrics.active_months,
    viewedAds: metrics.viewed_ads,
    viewedCategories: metrics.viewed_categories,
    favorites: metrics.favorites,
    contactsStarted: metrics.contacts_started,
    createdAds: metrics.created_ads,
    mostActiveMonth: metrics.most_active_month,
  }))

export type RecapMetrics = z.infer<typeof recapMetricsSchema>

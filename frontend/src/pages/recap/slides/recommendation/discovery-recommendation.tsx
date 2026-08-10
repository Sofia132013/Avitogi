import type { Recommendation } from "@/entities/recap"
import { cn } from "@/shared/lib"

import { getRecommendationPresentation } from "./recommendation-presentation"

type DiscoveryRecommendationData = Extract<
  Recommendation,
  {
    type: "OPEN_SAVED_SEARCH" | "OPEN_CATEGORY"
  }
>

interface DiscoveryRecommendationProps {
  recommendation: DiscoveryRecommendationData
}

export function DiscoveryRecommendation({ recommendation }: DiscoveryRecommendationProps) {
  const presentation = getRecommendationPresentation(recommendation.type)

  const contextLabel =
    recommendation.type === "OPEN_SAVED_SEARCH"
      ? "Сохранённый поиск"
      : recommendation.listingId
        ? "Категория и подходящее объявление"
        : "Категория по вашим интересам"

  return (
    <article
      className={cn(
        "relative mx-auto w-full max-w-xl overflow-hidden rounded-4xl p-5 text-recap sm:p-8",
        presentation.backgroundClass,
      )}
    >
      <div className='absolute -right-12 -top-12 size-40 rounded-full bg-white/20' aria-hidden='true' />

      <div className='absolute -bottom-16 -left-12 size-44 rounded-full bg-white/15' aria-hidden='true' />

      <div className='relative'>
        <div className='flex items-center justify-between gap-4'>
          <p className='text-xs font-black uppercase tracking-[0.16em]'>{presentation.eyebrow}</p>

          <span className='text-4xl' aria-hidden='true'>
            {presentation.icon}
          </span>
        </div>

        <div className='mt-8 flex min-w-0 items-center gap-3 rounded-2xl bg-background px-4 py-4 text-foreground shadow-lg'>
          <span className='shrink-0 text-xl' aria-hidden='true'>
            🔍
          </span>

          <p className='min-w-0 text-sm font-bold leading-snug wrap-break-word sm:text-base'>{recommendation.title}</p>
        </div>

        <div className='mt-4 flex flex-wrap gap-2'>
          <span className='rounded-full bg-white/70 px-3 py-2 text-xs font-black'>{contextLabel}</span>

          <span className='rounded-full bg-white/40 px-3 py-2 text-xs font-black'>Для вас</span>
        </div>
      </div>
    </article>
  )
}

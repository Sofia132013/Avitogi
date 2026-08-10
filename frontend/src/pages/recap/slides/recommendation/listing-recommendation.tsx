import type { Recommendation } from "@/entities/recap"
import { cn } from "@/shared/lib"

import { getRecommendationPresentation } from "./recommendation-presentation"

type ListingRecommendationData = Extract<
  Recommendation,
  {
    type: "CONTINUE_DRAFT" | "OPEN_FAVORITES"
  }
>

interface ListingRecommendationProps {
  recommendation: ListingRecommendationData
}

export function ListingRecommendation({ recommendation }: ListingRecommendationProps) {
  const presentation = getRecommendationPresentation(recommendation.type)

  const status =
    recommendation.type === "CONTINUE_DRAFT" ? "Можно продолжить редактирование" : "Можно вернуться к объявлению"

  return (
    <article className='relative mx-auto w-full max-w-xl'>
      <div
        className={cn(
          "absolute inset-3 translate-x-3 translate-y-3 rotate-2 rounded-4xl opacity-40",
          presentation.backgroundClass,
        )}
        aria-hidden='true'
      />

      <div className='relative overflow-hidden rounded-4xl border border-line bg-surface shadow-xl'>
        <div className={cn("grid min-h-40 place-items-center sm:min-h-52", presentation.backgroundClass)}>
          <span className='text-6xl sm:text-7xl' aria-hidden='true'>
            {presentation.icon}
          </span>
        </div>

        <div className='p-5 sm:p-7'>
          <p className='text-xs font-black uppercase tracking-[0.16em] text-muted'>{presentation.eyebrow}</p>

          <h2 className='mt-3 text-2xl font-black leading-tight wrap-break-word sm:text-3xl'>{recommendation.title}</h2>

          <div className='mt-5 flex items-center gap-3 rounded-2xl bg-muted-surface px-4 py-3'>
            <span className={cn("size-3 shrink-0 rounded-full", presentation.backgroundClass)} aria-hidden='true' />

            <span className='text-sm font-bold'>{status}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

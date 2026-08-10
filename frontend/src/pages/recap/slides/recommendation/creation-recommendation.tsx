import type { Recommendation } from "@/entities/recap"
import { cn } from "@/shared/lib"

import { getRecommendationPresentation } from "./recommendation-presentation"

type CreationRecommendationData = Extract<
  Recommendation,
  {
    type: "CREATE_LISTING"
  }
>

interface CreationRecommendationProps {
  recommendation: CreationRecommendationData
}

export function CreationRecommendation({ recommendation }: CreationRecommendationProps) {
  const presentation = getRecommendationPresentation(recommendation.type)

  return (
    <article className='mx-auto w-full max-w-xl overflow-hidden rounded-4xl border border-line bg-surface shadow-xl'>
      <div className={cn("relative p-6 text-recap sm:p-8", presentation.backgroundClass)}>
        <div className='absolute right-5 top-5 text-5xl opacity-80' aria-hidden='true'>
          {presentation.icon}
        </div>

        <p className='max-w-[75%] text-xs font-black uppercase tracking-[0.16em]'>{presentation.eyebrow}</p>

        <h2 className='mt-8 max-w-md text-3xl font-black leading-tight wrap-break-word sm:text-4xl'>
          {recommendation.title}
        </h2>
      </div>

      <div className='p-5 sm:p-7'>
        <div className='grid grid-cols-[5rem_minmax(0,1fr)] gap-4 rounded-3xl border-2 border-dashed border-line p-4'>
          <div className='grid aspect-square place-items-center rounded-2xl bg-muted-surface text-3xl'>📷</div>

          <div className='min-w-0 space-y-3 py-1'>
            <div className='h-3 w-4/5 rounded-full bg-muted-surface' />
            <div className='h-3 w-3/5 rounded-full bg-muted-surface' />
            <div className='h-3 w-2/5 rounded-full bg-muted-surface' />
          </div>
        </div>

        <p className='mt-4 text-sm font-bold text-muted'>Добавьте фотографии и расскажите о своём предложении</p>
      </div>
    </article>
  )
}

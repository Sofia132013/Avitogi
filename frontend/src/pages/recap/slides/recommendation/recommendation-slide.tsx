import type { Recommendation } from "@/entities/recap"
import type { ReactNode } from "react"

import type { RecapSlideMetaProps } from "../../recap-slide.types"
import { RecapSlideHeading, RecapSlideNavigation, RecapSlideShell } from "../../ui"
import { CreationRecommendation } from "./creation-recommendation"
import { DiscoveryRecommendation } from "./discovery-recommendation"
import { ListingRecommendation } from "./listing-recommendation"
import { getRecommendationPresentation } from "./recommendation-presentation"

interface RecommendationSlideProps extends RecapSlideMetaProps {
  recommendation: Recommendation
  onPrevious: () => void
  onFinish: () => void
}

function renderRecommendation(recommendation: Recommendation): ReactNode {
  switch (recommendation.type) {
    case "CONTINUE_DRAFT":
    case "OPEN_FAVORITES":
      return <ListingRecommendation recommendation={recommendation} />

    case "OPEN_SAVED_SEARCH":
    case "OPEN_CATEGORY":
      return <DiscoveryRecommendation recommendation={recommendation} />

    case "CREATE_LISTING":
      return <CreationRecommendation recommendation={recommendation} />
  }

  const exhaustiveCheck: never = recommendation
  return exhaustiveCheck
}

export function RecommendationSlide({
  recommendation,
  year,
  currentSlide,
  totalSlides,
  onPrevious,
  onFinish,
}: RecommendationSlideProps) {
  const presentation = getRecommendationPresentation(recommendation.type)

  return (
    <RecapSlideShell
      year={year}
      currentSlide={currentSlide}
      totalSlides={totalSlides}
      decorations={
        <>
          <div
            className='pointer-events-none absolute -left-24 top-[20%] size-52 rounded-full bg-accent-green opacity-60 sm:size-72 lg:-left-40 lg:size-96'
            aria-hidden='true'
          />

          <div
            className='pointer-events-none absolute -right-20 bottom-[5%] size-48 rounded-full bg-accent-purple opacity-60 sm:size-64 lg:-right-28 lg:size-80'
            aria-hidden='true'
          />
        </>
      }
      navigation={
        <RecapSlideNavigation onPrevious={onPrevious} onPrimary={onFinish} primaryLabel='Завершить' primaryIcon='✓' />
      }
    >
      <section className='grid min-w-0 flex-1 items-center gap-8 py-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] xl:gap-14 xl:py-10'>
        <div className='min-w-0'>
          <RecapSlideHeading badge={presentation.badge} title={recommendation.title} accent={presentation.accent} />

          <p className='mt-5 max-w-xl text-base font-medium leading-relaxed sm:text-lg'>{recommendation.reason}</p>
        </div>

        <div className='min-w-0'>{renderRecommendation(recommendation)}</div>
      </section>
    </RecapSlideShell>
  )
}

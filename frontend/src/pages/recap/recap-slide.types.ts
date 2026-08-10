import type { RecapCard, Recommendation } from "@/entities/recap"

export interface RecommendationSlideData {
  type: "recommendation"
  recommendation: Recommendation
}

export type RecapSlideData = RecapCard | RecommendationSlideData

export interface RecapSlideMetaProps {
  year: number
  currentSlide: number
  totalSlides: number
}

export type RecapSlideProps<TCard extends RecapCard> = RecapSlideMetaProps & {
  card: TCard
}

export type NavigableRecapSlideProps<TCard extends RecapCard> = RecapSlideProps<TCard> & {
  onPrevious: () => void
  onNext: () => void
}

export type FinalRecapSlideProps<TCard extends RecapCard> = RecapSlideProps<TCard> & {
  onPrevious: () => void
  onFinish: () => void
}

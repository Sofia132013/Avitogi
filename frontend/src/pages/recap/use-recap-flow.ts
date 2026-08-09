import { useProfile } from "@/entities/profile"
import { useRecap, useRecapMetrics, type RecapCard } from "@/entities/recap"
import { getRouteApi } from "@tanstack/react-router"
import { useState } from "react"

const profileRoute = getRouteApi("/_profile")
const EMPTY_CARDS: RecapCard[] = []

export function useRecapFlow() {
  const { profileId } = profileRoute.useRouteContext()

  const profileQuery = useProfile(profileId)
  const recapQuery = useRecap(profileId)
  const metricsQuery = useRecapMetrics(profileId)

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  const cards = recapQuery.data?.cards ?? EMPTY_CARDS
  const currentCard = cards[currentSlideIndex]

  const isError = profileQuery.isError || recapQuery.isError || metricsQuery.isError
  const isPending = !isError && (profileQuery.isPending || recapQuery.isPending || metricsQuery.isPending)
  const error = profileQuery.error ?? recapQuery.error ?? metricsQuery.error

  function goToNextSlide() {
    setCurrentSlideIndex(currentIndex => Math.min(currentIndex + 1, Math.max(cards.length - 1, 0)))
  }

  function goToPreviousSlide() {
    setCurrentSlideIndex(currentIndex => Math.max(currentIndex - 1, 0))
  }

  function retry() {
    void Promise.all([profileQuery.refetch(), recapQuery.refetch(), metricsQuery.refetch()])
  }

  return {
    profile: profileQuery.data,
    metrics: metricsQuery.data,
    currentCard,

    currentSlide: currentSlideIndex + 1,
    totalSlides: cards.length,

    isPending,
    isError,
    error,

    isFirstSlide: currentSlideIndex === 0,
    isLastSlide: cards.length > 0 && currentSlideIndex === cards.length - 1,

    goToNextSlide,
    goToPreviousSlide,
    retry,
  }
}

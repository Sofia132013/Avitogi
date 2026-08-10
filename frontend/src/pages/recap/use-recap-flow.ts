import { useProfile, type Profile } from "@/entities/profile"
import { useRecap, useRecapMetrics, type RecapCard, type RecapMetrics } from "@/entities/recap"
import { getRouteApi } from "@tanstack/react-router"
import { useState } from "react"

const profileRoute = getRouteApi("/_profile")
const EMPTY_CARDS: RecapCard[] = []

interface PendingRecapFlow {
  status: "pending"
}

interface ErrorRecapFlow {
  status: "error"
  retry: () => void
}

interface EmptyRecapFlow {
  status: "empty"
}

interface ReadyRecapFlow {
  status: "ready"

  profile: Profile
  metrics: RecapMetrics
  currentCard: RecapCard

  currentSlide: number
  totalSlides: number

  goToNextSlide: () => void
  goToPreviousSlide: () => void
}

type RecapFlowState = PendingRecapFlow | ErrorRecapFlow | EmptyRecapFlow | ReadyRecapFlow

export function useRecapFlow(): RecapFlowState {
  const { profileId } = profileRoute.useRouteContext()

  const profileQuery = useProfile(profileId)
  const recapQuery = useRecap(profileId)
  const metricsQuery = useRecapMetrics(profileId)

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  const cards = recapQuery.data?.cards ?? EMPTY_CARDS
  const lastSlideIndex = Math.max(cards.length - 1, 0)

  const visibleSlideIndex = Math.min(currentSlideIndex, lastSlideIndex)

  const currentCard = cards[visibleSlideIndex]

  function goToNextSlide() {
    setCurrentSlideIndex(currentIndex => Math.min(currentIndex + 1, lastSlideIndex))
  }

  function goToPreviousSlide() {
    setCurrentSlideIndex(currentIndex => Math.max(Math.min(currentIndex, lastSlideIndex) - 1, 0))
  }

  function retry() {
    void Promise.all([profileQuery.refetch(), recapQuery.refetch(), metricsQuery.refetch()])
  }

  const hasError = profileQuery.isError || recapQuery.isError || metricsQuery.isError

  if (hasError) {
    return {
      status: "error",
      retry,
    }
  }

  const isPending = profileQuery.isPending || recapQuery.isPending || metricsQuery.isPending

  if (isPending) {
    return {
      status: "pending",
    }
  }

  if (!profileQuery.data || !metricsQuery.data || !currentCard) {
    return {
      status: "empty",
    }
  }

  return {
    status: "ready",

    profile: profileQuery.data,
    metrics: metricsQuery.data,
    currentCard,

    currentSlide: visibleSlideIndex + 1,
    totalSlides: cards.length,

    goToNextSlide,
    goToPreviousSlide,
  }
}

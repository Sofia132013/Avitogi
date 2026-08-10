import { useProfile, type Profile } from "@/entities/profile"
import { useRecap, useRecapMetrics, type RecapMetrics, type RecapResponse } from "@/entities/recap"
import { getRouteApi } from "@tanstack/react-router"
import { useState } from "react"
import type { RecapSlideData, RecommendationSlideData } from "./recap-slide.types"

const profileRoute = getRouteApi("/_profile")

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
  currentSlideData: RecapSlideData

  currentSlide: number
  totalSlides: number

  goToNextSlide: () => void
  goToPreviousSlide: () => void
}

type RecapFlowState = PendingRecapFlow | ErrorRecapFlow | EmptyRecapFlow | ReadyRecapFlow

const EMPTY_SLIDES: RecapSlideData[] = []

function createRecapSlides(recap: RecapResponse | undefined): RecapSlideData[] {
  if (!recap) {
    return EMPTY_SLIDES
  }

  const recommendationSlide: RecommendationSlideData = {
    type: "recommendation",
    recommendation: recap.recommendation,
  }

  return [...recap.cards, recommendationSlide]
}

export function useRecapFlow(): RecapFlowState {
  const { profileId } = profileRoute.useRouteContext()

  const profileQuery = useProfile(profileId)
  const recapQuery = useRecap(profileId)
  const metricsQuery = useRecapMetrics(profileId)

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  const slides = createRecapSlides(recapQuery.data)

  const lastSlideIndex = Math.max(slides.length - 1, 0)

  const visibleSlideIndex = Math.min(currentSlideIndex, lastSlideIndex)

  const currentSlideData = slides[visibleSlideIndex]

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

  if (!profileQuery.data || !metricsQuery.data || !currentSlideData) {
    return {
      status: "empty",
    }
  }

  return {
    status: "ready",

    profile: profileQuery.data,
    metrics: metricsQuery.data,
    currentSlideData,

    currentSlide: visibleSlideIndex + 1,
    totalSlides: slides.length,

    goToNextSlide,
    goToPreviousSlide,
  }
}

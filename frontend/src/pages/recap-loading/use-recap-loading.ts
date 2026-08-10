import { useProfile } from "@/entities/profile"
import { useRecap, useRecapMetrics } from "@/entities/recap"
import { getRouteApi, useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"

const profileRoute = getRouteApi("/_profile")

const LOADING_STAGES = [
  {
    after: 100,
    progress: 20,
    label: "Определяем твою роль...",
  },
  {
    after: 450,
    progress: 45,
    label: "Собираем достижения...",
  },
  {
    after: 900,
    progress: 70,
    label: "Находим самое интересное...",
  },
  {
    after: 1300,
    progress: 90,
    label: "Составляем историю...",
  },
] as const

const INITIAL_STAGE = {
  progress: 0,
  label: "Подготавливаем итоги...",
}

const FINAL_STAGE = {
  progress: 100,
  label: "Всё готово!",
}

const MIN_LOADING_DURATION = 1600
const LEAVE_DELAY = 500
const NAVIGATION_DELAY = 800

export function useRecapLoading() {
  const navigate = useNavigate()
  const { profileId } = profileRoute.useRouteContext()

  const profileQuery = useProfile(profileId)
  const recapQuery = useRecap(profileId)
  const metricsQuery = useRecapMetrics(profileId)

  const [stage, setStage] = useState(INITIAL_STAGE)
  const [minimumDurationPassed, setMinimumDurationPassed] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const [loadingAttempt, setLoadingAttempt] = useState(0)

  const isError = profileQuery.isError || recapQuery.isError || metricsQuery.isError
  const isDataReady = profileQuery.isSuccess && recapQuery.isSuccess && metricsQuery.isSuccess

  const canFinish = minimumDurationPassed && isDataReady && !isError
  const visibleStage = canFinish ? FINAL_STAGE : stage

  useEffect(() => {
    const stageTimers = LOADING_STAGES.map(item =>
      window.setTimeout(() => {
        setStage({
          progress: item.progress,
          label: item.label,
        })
      }, item.after),
    )

    const minimumDurationTimer = window.setTimeout(() => {
      setMinimumDurationPassed(true)
    }, MIN_LOADING_DURATION)

    return () => {
      stageTimers.forEach(window.clearTimeout)
      window.clearTimeout(minimumDurationTimer)
    }
  }, [loadingAttempt])

  useEffect(() => {
    if (!canFinish) {
      return
    }

    const leaveTimer = window.setTimeout(() => {
      setIsLeaving(true)
    }, LEAVE_DELAY)

    const navigationTimer = window.setTimeout(() => {
      void navigate({
        to: "/recap",
        replace: true,
      })
    }, NAVIGATION_DELAY)

    return () => {
      window.clearTimeout(leaveTimer)
      window.clearTimeout(navigationTimer)
    }
  }, [canFinish, navigate])

  function retry() {
    setStage(INITIAL_STAGE)
    setMinimumDurationPassed(false)
    setIsLeaving(false)
    setLoadingAttempt(attempt => attempt + 1)

    void Promise.all([profileQuery.refetch(), recapQuery.refetch(), metricsQuery.refetch()])
  }

  return {
    isError,

    progress: visibleStage.progress,
    label: visibleStage.label,
    isLeaving,

    retry,
  }
}

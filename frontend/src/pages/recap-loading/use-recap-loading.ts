import { useProfile } from "@/entities/profile"
import { getRouteApi, useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"

const profileRoute = getRouteApi("/_profile")

const TIMELINE = [
  {
    after: 100,
    progress: 25,
    label: "Определяем твою роль...",
  },
  {
    after: 500,
    progress: 55,
    label: "Собираем достижения...",
  },
  {
    after: 900,
    progress: 80,
    label: "Составляем историю...",
  },
  {
    after: 1400,
    progress: 100,
    label: "Всё готово!",
  },
] as const

const INITIAL_STAGE = {
  progress: 0,
  label: "Подготавливаем итоги...",
}

export function useRecapLoading() {
  const navigate = useNavigate()
  const { profileId } = profileRoute.useRouteContext()

  const profileQuery = useProfile(profileId)

  const [stage, setStage] = useState(INITIAL_STAGE)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    if (!profileQuery.isSuccess) {
      return
    }

    const stageTimers = TIMELINE.map(item =>
      window.setTimeout(() => {
        setStage({
          progress: item.progress,
          label: item.label,
        })
      }, item.after),
    )

    const leaveTimer = window.setTimeout(() => {
      setIsLeaving(true)
    }, 1700)

    const navigationTimer = window.setTimeout(() => {
      void navigate({
        to: "/recap",
        replace: true,
      })
    }, 2000)

    return () => {
      stageTimers.forEach(window.clearTimeout)

      window.clearTimeout(leaveTimer)
      window.clearTimeout(navigationTimer)
    }
  }, [navigate, profileQuery.isSuccess])

  return {
    profile: profileQuery.data,

    isPending: profileQuery.isPending,
    isError: profileQuery.isError,
    error: profileQuery.error,

    progress: stage.progress,
    label: stage.label,
    isLeaving,
  }
}

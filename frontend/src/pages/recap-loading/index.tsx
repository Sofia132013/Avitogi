import { getSelectedProfileId, PROFILES } from "@/entities/profile"
import { useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"

const TIME_LINE = [
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

export function RecapLoadingPage() {
  const navigate = useNavigate()

  const profileId = getSelectedProfileId()
  const profile = PROFILES.find(item => item.id === profileId)

  const [progress, setProgress] = useState(0)
  const [label, setLabel] = useState("Подготавливаем итоги...")
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    const timers = TIME_LINE.map(stage =>
      window.setTimeout(() => {
        setProgress(stage.progress)
        setLabel(stage.label)
      }, stage.after),
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
      timers.forEach(window.clearTimeout)
      window.clearTimeout(leaveTimer)
      window.clearTimeout(navigationTimer)
    }
  }, [navigate])

  return (
    <main className='fixed inset-0 z-50 grid place-items-center bg-background px-5'>
      <section
        className={["w-full max-w-lg text-center", isLeaving ? "recap-page-leave" : "recap-page-enter"].join(" ")}
      >
        <div className='text-7xl' aria-hidden='true'>
          🏆
        </div>

        <h1 className='mt-6 text-4xl font-black'>{profile?.name ?? "Ваш профиль"}</h1>

        <p className='mt-2 text-xl text-muted'>Персональная история</p>

        <div
          className='mt-10 h-2 overflow-hidden rounded-full bg-line'
          role='progressbar'
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div
            className='h-full origin-left rounded-full bg-accent-blue transition-transform duration-500 ease-out'
            style={{
              transform: `scaleX(${progress / 100})`,
            }}
          />
        </div>

        <p className='mt-5 min-h-7 text-lg text-muted' aria-live='polite'>
          {label}
        </p>
      </section>
    </main>
  )
}

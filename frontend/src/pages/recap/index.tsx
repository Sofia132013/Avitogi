import { ErrorState, LoadingState } from "@/shared/ui"
import { useNavigate } from "@tanstack/react-router"
import { RecapSlideRenderer } from "./recap-slide-renderer"
import { useRecapFlow } from "./use-recap-flow"

const RECAP_YEAR = 2025

export function RecapPage() {
  const recap = useRecapFlow()
  const navigate = useNavigate()

  function finishRecap() {
    void navigate({ to: "/" })
  }

  if (recap.status === "error") {
    return (
      <main className='grid min-h-dvh place-items-center'>
        <ErrorState title='Не удалось загрузить итоги' retry={recap.retry} />
      </main>
    )
  }

  if (recap.status === "pending") {
    return (
      <main className='grid min-h-dvh place-items-center'>
        <LoadingState label='Загружаем итоги…' />
      </main>
    )
  }

  if (recap.status === "empty") {
    return (
      <main className='grid min-h-dvh place-items-center'>
        <ErrorState title='Данные итогов отсутствуют' />
      </main>
    )
  }

  return (
    <RecapSlideRenderer
      card={recap.currentCard}
      profile={recap.profile}
      metrics={recap.metrics}
      year={RECAP_YEAR}
      currentSlide={recap.currentSlide}
      totalSlides={recap.totalSlides}
      onPrevious={recap.goToPreviousSlide}
      onNext={recap.goToNextSlide}
      onFinish={finishRecap}
    />
  )
}

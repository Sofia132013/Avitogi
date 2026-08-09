import { ErrorState, LoadingState } from "@/shared/ui"
import { useNavigate } from "@tanstack/react-router"
import {
  AchievementsSlide,
  ActivePeriodSlide,
  IntroSlide,
  MainCategorySlide,
  RoleRatioSlide,
  YearInNumbersSlide,
} from "./slides"
import { useRecapFlow } from "./use-recap-flow"

const RECAP_YEAR = 2025

export function RecapPage() {
  const recap = useRecapFlow()

  const navigate = useNavigate()

  function finishRecap() {
    void navigate({ to: "/" })
  }

  if (recap.isError) {
    return (
      <main className='grid min-h-dvh place-items-center '>
        <ErrorState title='Не удалось загрузить итоги' retry={recap.retry} />
      </main>
    )
  }

  if (recap.isPending) {
    return (
      <main className='grid min-h-dvh place-items-center '>
        <LoadingState label='Загружаем итоги…' />
      </main>
    )
  }

  if (!recap.profile || !recap.metrics || !recap.currentCard) {
    return (
      <main className='grid min-h-dvh place-items-center '>
        <ErrorState title='Данные итогов отсутствуют' />
      </main>
    )
  }

  switch (recap.currentCard.type) {
    case "intro":
      return (
        <IntroSlide
          profile={recap.profile}
          card={recap.currentCard}
          year={RECAP_YEAR}
          currentSlide={recap.currentSlide}
          totalSlides={recap.totalSlides}
          onNext={recap.goToNextSlide}
        />
      )

    case "year_in_numbers":
      return (
        <YearInNumbersSlide
          card={recap.currentCard}
          metrics={recap.metrics}
          year={RECAP_YEAR}
          currentSlide={recap.currentSlide}
          totalSlides={recap.totalSlides}
          onPrevious={recap.goToPreviousSlide}
          onNext={recap.goToNextSlide}
        />
      )

    case "role_ratio":
      return (
        <RoleRatioSlide
          card={recap.currentCard}
          year={RECAP_YEAR}
          currentSlide={recap.currentSlide}
          totalSlides={recap.totalSlides}
          onPrevious={recap.goToPreviousSlide}
          onNext={recap.goToNextSlide}
        />
      )

    case "main_category":
      return (
        <MainCategorySlide
          card={recap.currentCard}
          year={RECAP_YEAR}
          currentSlide={recap.currentSlide}
          totalSlides={recap.totalSlides}
          onPrevious={recap.goToPreviousSlide}
          onNext={recap.goToNextSlide}
        />
      )
    case "active_period":
      return (
        <ActivePeriodSlide
          card={recap.currentCard}
          mostActiveMonth={recap.metrics.mostActiveMonth}
          year={RECAP_YEAR}
          currentSlide={recap.currentSlide}
          totalSlides={recap.totalSlides}
          onPrevious={recap.goToPreviousSlide}
          onNext={recap.goToNextSlide}
        />
      )

    case "achievements":
      return (
        <AchievementsSlide
          card={recap.currentCard}
          year={RECAP_YEAR}
          currentSlide={recap.currentSlide}
          totalSlides={recap.totalSlides}
          onPrevious={recap.goToPreviousSlide}
          onFinish={finishRecap}
        />
      )

    default:
      return (
        <main className='grid min-h-dvh place-items-center '>
          <p className='text-xl font-bold'>Этот слайд пока не реализован</p>
        </main>
      )
  }
}

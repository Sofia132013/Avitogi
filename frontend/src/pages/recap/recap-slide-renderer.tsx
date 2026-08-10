import type { Profile } from "@/entities/profile"
import type { RecapMetrics } from "@/entities/recap"
import { ErrorState } from "@/shared/ui"
import type { RecapSlideData, RecapSlideMetaProps } from "./recap-slide.types"
import {
  AchievementsSlide,
  ActivePeriodSlide,
  IntroSlide,
  MainCategorySlide,
  RecommendationSlide,
  RoleRatioSlide,
  YearInNumbersSlide,
} from "./slides"

interface RecapSlideRendererProps extends RecapSlideMetaProps {
  slide: RecapSlideData
  profile: Profile
  metrics: RecapMetrics
  onPrevious: () => void
  onNext: () => void
  onFinish: () => void
}

export function RecapSlideRenderer({
  slide,
  profile,
  metrics,
  year,
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
  onFinish,
}: RecapSlideRendererProps) {
  const slideMeta = {
    year,
    currentSlide,
    totalSlides,
  }

  const navigation = {
    onPrevious,
    onNext,
  }

  switch (slide.type) {
    case "intro":
      return <IntroSlide {...slideMeta} card={slide} profile={profile} onNext={onNext} />

    case "year_in_numbers":
      return <YearInNumbersSlide {...slideMeta} {...navigation} card={slide} metrics={metrics} />

    case "role_ratio":
      return <RoleRatioSlide {...slideMeta} {...navigation} card={slide} />

    case "main_category":
      return <MainCategorySlide {...slideMeta} {...navigation} card={slide} />

    case "active_period":
      return <ActivePeriodSlide {...slideMeta} {...navigation} card={slide} mostActiveMonth={metrics.mostActiveMonth} />

    case "achievements":
      return <AchievementsSlide {...slideMeta} card={slide} onPrevious={onPrevious} onNext={onNext} />

    case "recommendation":
      return (
        <RecommendationSlide
          recommendation={slide.recommendation}
          year={year}
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          onPrevious={onPrevious}
          onFinish={onFinish}
        />
      )

    default:
      return (
        <main className='grid min-h-dvh place-items-center'>
          <ErrorState title='Этот recap-слайд пока не поддерживается' />
        </main>
      )
  }
}

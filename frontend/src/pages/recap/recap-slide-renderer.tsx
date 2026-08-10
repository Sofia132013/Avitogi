import type { Profile } from "@/entities/profile"
import type { RecapCard, RecapMetrics } from "@/entities/recap"
import { ErrorState } from "@/shared/ui"
import type { RecapSlideProps } from "./recap-slide.types"
import {
  AchievementsSlide,
  ActivePeriodSlide,
  IntroSlide,
  MainCategorySlide,
  RoleRatioSlide,
  YearInNumbersSlide,
} from "./slides"

type RecapSlideRendererProps = RecapSlideProps<RecapCard> & {
  profile: Profile
  metrics: RecapMetrics
  onPrevious: () => void
  onNext: () => void
  onFinish: () => void
}

export function RecapSlideRenderer({
  card,
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

  switch (card.type) {
    case "intro":
      return <IntroSlide {...slideMeta} card={card} profile={profile} onNext={onNext} />

    case "year_in_numbers":
      return <YearInNumbersSlide {...slideMeta} {...navigation} card={card} metrics={metrics} />

    case "role_ratio":
      return <RoleRatioSlide {...slideMeta} {...navigation} card={card} />

    case "main_category":
      return <MainCategorySlide {...slideMeta} {...navigation} card={card} />

    case "active_period":
      return <ActivePeriodSlide {...slideMeta} {...navigation} card={card} mostActiveMonth={metrics.mostActiveMonth} />

    case "achievements":
      return <AchievementsSlide {...slideMeta} card={card} onPrevious={onPrevious} onFinish={onFinish} />

    default:
      return (
        <main className='grid min-h-dvh place-items-center'>
          <ErrorState title='Этот recap-слайд пока не поддерживается' />
        </main>
      )
  }
}

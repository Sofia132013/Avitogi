import type { MainCategoryRecapCard } from "@/entities/recap"
import type { NavigableRecapSlideProps } from "../../recap-slide.types"
import { RecapExplanation, RecapSlideHeading, RecapSlideNavigation, RecapSlideShell } from "../../ui"
import { CategorySpotlight } from "./category-spotlight"
import { getMainCategoryName, parseRelatedCategories } from "./main-category-data"
import { RelatedCategoryCard } from "./related-category-card"

type MainCategorySlideProps = NavigableRecapSlideProps<MainCategoryRecapCard>

export function MainCategorySlide({
  card,
  year,
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
}: MainCategorySlideProps) {
  const categoryName = getMainCategoryName(card.description)
  const relatedCategories = parseRelatedCategories(card.explanation)

  return (
    <RecapSlideShell
      year={year}
      currentSlide={currentSlide}
      totalSlides={totalSlides}
      decorations={
        <>
          <div
            className='pointer-events-none absolute -left-24 bottom-[5%] size-56 rounded-full bg-accent-yellow opacity-70 sm:size-72 lg:-left-40 lg:size-96'
            aria-hidden='true'
          />

          <div
            className='pointer-events-none absolute -right-20 top-[12%] size-44 rounded-full bg-accent-blue opacity-60 sm:size-60 lg:-right-28 lg:size-80'
            aria-hidden='true'
          />
        </>
      }
      navigation={<RecapSlideNavigation onPrevious={onPrevious} onPrimary={onNext} />}
    >
      <section className='grid flex-1 items-center gap-8 py-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:gap-12 xl:py-10'>
        <div>
          <RecapSlideHeading
            badge={`${currentSlide} из ${totalSlides}`}
            title={card.title}

            accent='green'
          />

          <RecapExplanation summary='Подробнее о категориях' text={card.explanation} />
        </div>

        <div className='min-w-0'>
          <CategorySpotlight categoryName={categoryName} />

          {relatedCategories.length > 0 ? (
            <div className='mt-4'>
              <h2 className='mb-3 text-lg font-black sm:text-xl'>Другие ваши интересы</h2>

              <div className='grid gap-2 sm:grid-cols-2 sm:gap-3'>
                {relatedCategories.map(category => (
                  <RelatedCategoryCard key={category.name} category={category} />
                ))}
              </div>
            </div>
          ) : (
            <div className='mt-4 rounded-2xl border border-line bg-surface p-4'>
              <p className='text-sm font-medium leading-relaxed text-muted'>{card.explanation}</p>
            </div>
          )}
        </div>
      </section>
    </RecapSlideShell>
  )
}

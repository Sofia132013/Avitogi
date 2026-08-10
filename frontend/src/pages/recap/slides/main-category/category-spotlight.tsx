import { cn } from "@/shared/lib"
import { getCategoryAppearance } from "./main-category-data"

interface CategorySpotlightProps {
  categoryName?: string
}

export function CategorySpotlight({ categoryName }: CategorySpotlightProps) {
  const appearance = categoryName
    ? getCategoryAppearance(categoryName)
    : {
        icon: "🧭",
        backgroundClass: "bg-accent-yellow",
      }

  return (
    <article
      className={cn(
        "relative min-h-56 overflow-hidden rounded-4xl p-6 text-recap",
        "sm:min-h-64 sm:p-8 lg:min-h-80",
        appearance.backgroundClass,
      )}
      aria-label={categoryName ? `Главная категория: ${categoryName}` : "Главная категория пока не определена"}
    >
      <span
        className='pointer-events-none absolute -right-8 -top-12 text-[11rem] opacity-20 sm:text-[15rem] lg:text-[19rem]'
        aria-hidden='true'
      >
        {appearance.icon}
      </span>

      <div className='relative flex h-full min-h-44 flex-col justify-between sm:min-h-48 lg:min-h-64'>
        <span className='text-xs font-black uppercase tracking-[0.14em]'>Больше всего ваших действий</span>

        <div>
          <span className='mb-4 block text-5xl sm:text-6xl' aria-hidden='true'>
            {appearance.icon}
          </span>

          <h2 className='max-w-xl text-4xl font-black leading-none tracking-tighter text-balance sm:text-5xl lg:text-7xl'>
            {categoryName ?? "Пока не определена"}
          </h2>

          {categoryName && (
            <p className='mt-3 max-w-md text-sm font-bold opacity-70 sm:text-base'>
              Эта категория набрала больше всего баллов по вашим действиям
            </p>
          )}
        </div>
      </div>
    </article>
  )
}

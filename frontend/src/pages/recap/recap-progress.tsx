interface RecapProgressProps {
  currentSlide: number
  totalSlides: number
}

export function RecapProgress({ currentSlide, totalSlides }: RecapProgressProps) {
  return (
    <div
      className='flex gap-1.5'
      role='progressbar'
      aria-label={`Слайд ${currentSlide} из ${totalSlides}`}
      aria-valuemin={1}
      aria-valuemax={totalSlides}
      aria-valuenow={currentSlide}
    >
      {Array.from({ length: totalSlides }, (_, index) => {
        const isCompleted = index < currentSlide

        return (
          <span
            key={index}
            className={[
              "h-1 flex-1 rounded-full transition-colors",
              isCompleted ? "bg-recap dark:bg-white" : "bg-recap/15 dark:bg-white/20",
            ].join(" ")}
            aria-hidden='true'
          />
        )
      })}
    </div>
  )
}

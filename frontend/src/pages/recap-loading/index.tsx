import { ErrorState } from "@/shared/ui"
import { useRecapLoading } from "./use-recap-loading"

export function RecapLoadingPage() {
  const { isError, progress, label, isLeaving, retry } = useRecapLoading()

  if (isError) {
    return (
      <main className='grid min-h-dvh place-items-center'>
        <ErrorState title='Не удалось загрузить итоги' retry={retry} />
      </main>
    )
  }

  return (
    <main className='fixed inset-0 z-50 grid place-items-center px-5'>
      <section
        className={["w-full max-w-lg text-center", isLeaving ? "recap-page-leave" : "recap-page-enter"].join(" ")}
      >
        <div className='text-7xl' aria-hidden='true'>
          🏆
        </div>

        <h1 className='mt-6 text-4xl font-black'>Загрузка...</h1>

        <p className='mt-2 text-xl text-muted'>Персональной истории</p>

        <div
          className='mt-10 h-2 overflow-hidden rounded-full bg-recap/10 dark:bg-white/10'
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

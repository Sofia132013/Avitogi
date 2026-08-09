import { ErrorState, LoadingState } from "@/shared/ui"
import { useRecapLoading } from "./use-recap-loading"

export function RecapLoadingPage() {
  const { profile, isPending, isError, progress, label, isLeaving } = useRecapLoading()

  if (isPending) {
    return <LoadingState label='Загружаем профиль…' />
  }

  if (isError || !profile) {
    return <ErrorState title='Не удалось загрузить профиль' />
  }

  return (
    <main className='fixed inset-0 z-50 grid place-items-center bg-background px-5'>
      <section
        className={["w-full max-w-lg text-center", isLeaving ? "recap-page-leave" : "recap-page-enter"].join(" ")}
      >
        <div className='text-7xl' aria-hidden='true'>
          🏆
        </div>

        <h1 className='mt-6 text-4xl font-black'>{profile.name}</h1>

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

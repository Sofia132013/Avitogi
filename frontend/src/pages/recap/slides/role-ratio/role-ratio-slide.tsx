import type { RoleRatioRecapCard } from "@/entities/recap"
import { Button } from "@/shared/ui"
import { RecapProgress } from "../../recap-progress"
import { PrimaryRole } from "./primary-role"
import { RoleMeter } from "./role-meter"
import { getPrimaryRole, getRoleAppearance, parseRoleRatios } from "./role-ratio-data"

interface RoleRatioSlideProps {
  card: RoleRatioRecapCard
  year: number
  currentSlide: number
  totalSlides: number
  onPrevious: () => void
  onNext: () => void
}

export function RoleRatioSlide({ card, year, currentSlide, totalSlides, onPrevious, onNext }: RoleRatioSlideProps) {
  const roles = parseRoleRatios(card.explanation)
  const primaryRole = getPrimaryRole(roles)

  return (
    <main className='recap-page-enter relative isolate min-h-dvh overflow-x-hidden'>
      <div
        className='pointer-events-none absolute -left-20 top-1/3 size-48 rounded-full bg-accent-green opacity-70 sm:size-64 lg:-left-40 lg:size-96'
        aria-hidden='true'
      />

      <div
        className='pointer-events-none absolute -right-16 bottom-[8%] size-40 rounded-full bg-accent-purple opacity-70 sm:size-56 lg:-right-28 lg:size-80'
        aria-hidden='true'
      />

      <div className='relative mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:px-8 lg:px-12'>
        <RecapProgress currentSlide={currentSlide} totalSlides={totalSlides} />

        <header className='mt-5 flex items-center justify-between'>
          <span className='text-xl font-black tracking-tight'>Avitogi</span>

          <span className='rounded-full bg-muted-surface px-4 py-2 text-xs font-bold uppercase tracking-[0.14em]'>
            Итоги {year}
          </span>
        </header>

        <section className='grid min-w-0 flex-1 items-center gap-6 py-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14'>
          <div className='min-w-0'>
            <span className='inline-flex rounded-full bg-accent-blue px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-recap'>
              {currentSlide} из {totalSlides}
            </span>

            <h1 className='mt-4 max-w-full wrap-break-words text-3xl font-black leading-[0.92] tracking-[-0.04em] text-balance min-[375px]:text-4xl sm:text-6xl lg:mt-7 lg:text-8xl'>
              {card.title}
            </h1>

            <p className='mt-4 max-w-xl text-base font-medium leading-relaxed text-recap sm:text-lg'>
              {card.description}
            </p>

            {primaryRole && (
              <div className='mt-5 lg:mt-8'>
                <PrimaryRole role={primaryRole} />
              </div>
            )}
          </div>

          <div className='min-w-0'>
            <div className='mb-4 flex items-center justify-between gap-4'>
              <h2 className='text-xl font-black sm:text-2xl'>Баланс ролей</h2>

              <span className='text-sm font-bold text-muted'>100%</span>
            </div>

            {roles.length > 0 && (
              <div className='mb-4 flex h-3 overflow-hidden rounded-full bg-muted-surface' aria-hidden='true'>
                {roles.map(role => {
                  const appearance = getRoleAppearance(role.label)

                  return (
                    <span
                      key={role.label}
                      className={appearance.backgroundClass}
                      style={{ width: `${role.percentage}%` }}
                      title={`${role.label}: ${role.percentage}%`}
                    />
                  )
                })}
              </div>
            )}

            <div className='grid gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-1'>
              {roles.map(role => (
                <RoleMeter key={role.label} role={role} />
              ))}
            </div>

            <details className='mt-4 rounded-2xl bg-muted-surface px-4 py-3 sm:px-5 sm:py-4'>
              <summary className='cursor-pointer text-sm font-bold'>Как определяются роли</summary>

              <p className='mt-3 text-sm leading-relaxed text-muted'>{card.explanation}</p>
            </details>
          </div>
        </section>

        <div className='flex items-center justify-between gap-3 pb-1'>
          <Button type='button' variant='secondary' size='lg' className='flex-1 sm:flex-none' onClick={onPrevious}>
            <span aria-hidden='true'>←</span>
            Назад
          </Button>

          <Button type='button' variant='primary' size='lg' className='flex-1 sm:flex-none' onClick={onNext}>
            Дальше
            <span aria-hidden='true'>→</span>
          </Button>
        </div>
      </div>
    </main>
  )
}

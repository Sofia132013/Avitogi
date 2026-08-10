import type { RoleRatioRecapCard } from "@/entities/recap"
import type { NavigableRecapSlideProps } from "../../recap-slide.types"
import { RecapExplanation, RecapSlideHeading, RecapSlideNavigation, RecapSlideShell } from "../../ui"
import { PrimaryRole } from "./primary-role"
import { RoleMeter } from "./role-meter"
import { getPrimaryRole, getRoleAppearance, parseRoleRatios } from "./role-ratio-data"

type RoleRatioSlideProps = NavigableRecapSlideProps<RoleRatioRecapCard>

export function RoleRatioSlide({ card, year, currentSlide, totalSlides, onPrevious, onNext }: RoleRatioSlideProps) {
  const roles = parseRoleRatios(card.explanation)
  const primaryRole = getPrimaryRole(roles)

  return (
    <RecapSlideShell
      year={year}
      currentSlide={currentSlide}
      totalSlides={totalSlides}
      decorations={
        <>
          <div
            className='pointer-events-none absolute -left-20 top-1/3 size-48 rounded-full bg-accent-green opacity-70 sm:size-64 lg:-left-40 lg:size-96'
            aria-hidden='true'
          />

          <div
            className='pointer-events-none absolute -right-16 bottom-[8%] size-40 rounded-full bg-accent-purple opacity-70 sm:size-56 lg:-right-28 lg:size-80'
            aria-hidden='true'
          />
        </>
      }
      navigation={<RecapSlideNavigation onPrevious={onPrevious} onPrimary={onNext} />}
    >
      <section className='grid min-w-0 flex-1 items-center gap-6 py-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14'>
        <div className='min-w-0'>
          <RecapSlideHeading
            badge={`${currentSlide} из ${totalSlides}`}
            title={card.title}
            accent='blue'
            size='large'
          />

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

          <RecapExplanation summary='Как определяются роли' text={card.explanation} className='mt-4' />
        </div>
      </section>
    </RecapSlideShell>
  )
}

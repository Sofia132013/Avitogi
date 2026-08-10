import type { Profile } from "@/entities/profile"
import type { IntroRecapCard } from "@/entities/recap"
import { Button } from "@/shared/ui"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import type { RecapSlideProps } from "../recap-slide.types"
import { RecapSlideShell } from "../ui"

type IntroSlideProps = RecapSlideProps<IntroRecapCard> & {
  profile: Profile
  onNext: () => void
}
export function IntroSlide({ profile, card, year, currentSlide, totalSlides, onNext }: IntroSlideProps) {
  return (
    <RecapSlideShell
      year={year}
      currentSlide={currentSlide}
      totalSlides={totalSlides}
      decorations={
        <>
          <div
            className='pointer-events-none absolute -left-20 top-[18%] size-44 rounded-full bg-accent-green sm:size-60 lg:-left-32 lg:size-80'
            aria-hidden='true'
          />

          <div
            className='pointer-events-none absolute -right-24 -bottom-20 size-72 rounded-full bg-accent-purple sm:size-96 lg:-right-32 lg:size-128'
            aria-hidden='true'
          />
        </>
      }
    >
      <section className='grid flex-1 items-center gap-6 py-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)] lg:gap-16 lg:py-12'>
        <div className='order-2 text-center lg:order-1 lg:text-left'>
          <span className='inline-flex rounded-full bg-accent-blue px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-recap'>
            {card.title}
          </span>

          <h1 className='mt-5 wrap-break-word text-5xl font-black leading-[0.9] tracking-[-0.04em] text-balance sm:text-6xl lg:mt-8 lg:text-8xl'>
            Привет,
            <br />
            {profile.name}!
          </h1>

          <p className='mx-auto mt-5 max-w-xl text-base leading-relaxed text-recap/65 dark:text-white/65 sm:text-lg lg:mx-0 lg:mt-8 lg:text-xl'>
            Мы собрали события, открытия и моменты, которые сделали твой {year}-й на Авито особенным.
          </p>

          <Button variant='primary' size='xl' className='mt-7 w-full sm:w-auto lg:mt-10' onClick={onNext}>
            Начать
            <span aria-hidden='true'>→</span>
          </Button>
        </div>

        <div className='order-1 flex justify-center lg:order-2'>
          <div className='relative grid aspect-square w-full max-w-52 place-items-center sm:max-w-72 lg:max-w-md'>
            <div className='absolute inset-3 rounded-full bg-accent-blue sm:inset-5' aria-hidden='true' />

            <div
              className='absolute -right-2 top-2 size-12 rounded-full bg-accent-yellow sm:right-2 sm:size-20 lg:size-24'
              aria-hidden='true'
            />

            <div
              className='absolute bottom-3 left-0 size-8 rounded-full bg-accent-green sm:size-12 lg:size-16'
              aria-hidden='true'
            />

            <Avatar className='relative z-10 size-28 border-[6px] border-white shadow-2xl sm:size-40 lg:size-56'>
              <AvatarImage src={profile.avatarUrl ?? undefined} alt={profile.name} />

              <AvatarFallback className='bg-white text-5xl font-black text-recap lg:text-7xl'>
                {profile.name[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <span className='absolute -bottom-1 right-0 z-20 rounded-full bg-recap px-4 py-2 text-xs font-black text-white shadow-lg dark:bg-white dark:text-recap sm:px-5 sm:py-3 sm:text-sm'>
              {totalSlides - 1} историй о тебе
            </span>
          </div>
        </div>
      </section>
    </RecapSlideShell>
  )
}

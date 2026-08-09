import { Button } from "@/shared/ui"
import { Link } from "@tanstack/react-router"

export function HomePage() {
  return (
    <main>
      <section className='relative overflow-x-clip dark:text-white text-recap'>
        <div className='absolute -top-32 right-[8%] lg:size-96 md:size-72 size-72 rounded-full bg-accent-blue' />
        <div className='absolute top-52 -right-20 lg:size-72 size-60 rounded-full bg-accent-purple' />
        <div className='absolute -bottom-24 right-[30%] lg:size-48 size-36  rounded-full bg-accent-green' />
        <div className='relative mx-auto flex min-h-152 max-w-7xl flex-col px-5 py-7 md:px-8'>
          <div className='my-auto max-w-4xl py-16'>
            <span className='rounded-full bg-accent-purple px-4 py-2 text-xs font-bold tracking-[0.14em] uppercase text-white dark:text-recap'>
              Персональная история
            </span>
            <h1 className='mt-7 text-4xl sm:text-6xl leading-[0.92] font-black text-balance md:text-7xl lg:text-8xl'>
              Узнайте, каким был ваш год на Авито
            </h1>
            <p className='mt-8 max-w-2xl sm:text-lg leading-relaxed dark:text-white/65 text-recap/65 md:text-xl'>
              Не сухая статистика, а история о ваших интересах, привычках и следующем полезном шаге.
            </p>
            <Link to='/recap/loading'>
              <Button variant='secondary' size='xl' className='mt-10'>
                Узнать свои итоги
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

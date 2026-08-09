import { selectProfile, useProfiles, type ProfileId } from "@/entities/profile"
import { Button, ErrorState, LoadingState } from "@/shared/ui"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"

export function ProfileSelectPage() {
  const navigate = useNavigate()
  const profilesQuery = useProfiles()

  const [selectedProfileId, setSelectedProfileId] = useState<ProfileId | null>(null)

  const profiles = profilesQuery.data ?? []

  function handleContinue() {
    const profileExists = profiles.some(profile => profile.id === selectedProfileId)

    if (selectedProfileId === null || !profileExists) {
      return
    }

    selectProfile(selectedProfileId)

    void navigate({
      to: "/",
      replace: true,
    })
  }

  return (
    <main className='relative grid min-h-dvh place-items-center overflow-x-clip bg-background px-5 py-12 text-foreground'>
      <div className='absolute -left-20 top-20 size-52 rounded-full bg-accent-purple' aria-hidden='true' />
      <div className='absolute -right-24 bottom-10 size-72 rounded-full bg-accent-blue' aria-hidden='true' />
      <section className='relative z-10 w-full max-w-4xl'>
        <div className='text-center'>
          <span className='inline-flex rounded-full bg-accent-green px-4 py-2 text-xs font-bold tracking-[0.14em] dark:text-recap uppercase'>
            Выбор профиля
          </span>

          <h1 className='mt-6 text-4xl font-black sm:text-5xl dark:text-white text-recap'>Чьи итоги будем смотреть?</h1>

          <p className='mx-auto mt-4 max-w-xl text-base leading-relaxed dark:text-white text-recap sm:text-lg'>
            Выберите готовый профиль.
          </p>
        </div>
        {profilesQuery.isPending && <LoadingState label='Загружаем профили…' />}
        {profilesQuery.isError && (
          <ErrorState
            title='Не удалось загрузить профили'
            retry={() => {
              void profilesQuery.refetch()
            }}
          />
        )}
        {profiles.length === 0 && (
          <p className='mt-10 text-center max-w-xl text-base leading-relaxed dark:text-white text-recap sm:text-lg'>
            Доступных профилей пока нет
          </p>
        )}
        <div className='mt-10 grid gap-4 sm:grid-cols-3'>
          {profiles.map(profile => {
            const isSelected = selectedProfileId === profile.id

            return (
              <button
                key={profile.id}
                type='button'
                aria-pressed={isSelected}
                onClick={() => setSelectedProfileId(profile.id)}
                className={[
                  "flex min-h-64 flex-col items-center rounded-3xl border-2 bg-white p-6 text-center transition",
                  "hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg",
                  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-blue",
                  isSelected ? "border-foreground shadow-lg" : "border-line",
                ].join(" ")}
              >
                <Avatar className='size-24 dark:border-recap border-2'>
                  <AvatarImage src={String(profile.avatarUrl)} alt={profile.name} />
                  <AvatarFallback className='text-3xl font-black text-recap bg-white'>{profile.name[0]}</AvatarFallback>
                </Avatar>
                <span className='mt-6 text-xl font-black text-recap'>{profile.name}</span>
                <span
                  className={["mt-auto pt-6 text-sm font-bold", isSelected ? "text-recap" : "text-transparent"].join(
                    " ",
                  )}
                >
                  Выбрано
                </span>
              </button>
            )
          })}
        </div>
        <div className='mt-8 flex justify-center'>
          <Button size='xl' variant='primary' disabled={!selectedProfileId} onClick={handleContinue}>
            Продолжить
          </Button>
        </div>
      </section>
    </main>
  )
}

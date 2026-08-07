import type { RouterContext } from "@/app/router"
import { Button, Header } from "@/shared/ui"
import { ErrorState, LoadingState } from "@/shared/ui/state"
import { QueryErrorResetBoundary } from "@tanstack/react-query"
import { createRootRouteWithContext, Link, Outlet, type ErrorComponentProps } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  pendingComponent: () => <LoadingState label='Открываем страницу…' />,
  notFoundComponent: () => (
    <main className='grid min-h-dvh place-items-center bg-background px-6 text-center'>
      <div>
        <p className='text-7xl font-black text-accent-purple'>404</p>
        <h1 className='mt-4 text-3xl font-black'>Такой истории нет</h1>
        <p className='mt-3 text-muted'>Проверьте ссылку или выберите тестовый профиль заново.</p>
        <Button asChild className='mt-7'>
          <Link to='/'>На главную</Link>
        </Button>
      </div>
    </main>
  ),
  errorComponent: RootError,
})

function RootComponent() {
  return (
    <>
      <Header />
      <Outlet />
      {import.meta.env.DEV ? <TanStackRouterDevtools position='bottom-right' /> : null}
    </>
  )
}

function RootError({ error, reset }: ErrorComponentProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset: resetQuery }) => (
        <ErrorState
          title={error instanceof Error ? error.message : "Неизвестная ошибка"}
          retry={() => {
            resetQuery()
            reset()
          }}
        />
      )}
    </QueryErrorResetBoundary>
  )
}

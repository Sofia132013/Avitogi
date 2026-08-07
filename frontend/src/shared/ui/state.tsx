import { Button } from "./button"

export function LoadingState({ label = "Загружаем…" }: { label?: string }) {
  return (
    <div className='grid min-h-72 place-items-center' role='status'>
      <div className='text-center'>
        <span className='mx-auto block size-12 animate-spin rounded-full border-4 border-line border-t-accent-purple' />
        <p className='mt-4 font-medium text-muted'>{label}</p>
      </div>
    </div>
  )
}

export function ErrorState({ title = "Что-то пошло не так", retry }: { title?: string; retry?: () => void }) {
  return (
    <div className='mx-auto grid min-h-72 max-w-lg place-items-center px-6 text-center' role='alert'>
      <div>
        <span className='mx-auto grid size-14 place-items-center rounded-full bg-danger/10 text-2xl text-danger'>
          !
        </span>
        <h1 className='mt-5 text-2xl font-bold'>{title}</h1>
        <p className='mt-2 text-muted'>Попробуйте повторить действие или вернуться на главную.</p>
        {retry ? (
          <Button className='mt-6' onClick={retry}>
            Повторить
          </Button>
        ) : null}
      </div>
    </div>
  )
}

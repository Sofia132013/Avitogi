import { createFileRoute } from '@tanstack/react-router'


function Index() {
  return (
    <div className="p-2">
      <h1 className="text-3xl font-bold text-center">Avitogi home screen</h1>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: Index,
})
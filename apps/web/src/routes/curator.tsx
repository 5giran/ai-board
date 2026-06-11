import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/curator')({
  component: CuratorPage,
})

function CuratorPage() {
  return (
    <div>
        <h2>AI 큐레이터</h2>
    </div>
  )
}

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/me')({
  component: MyPage,
})

function MyPage() {
  return (
    <div>
        <h2>My Page</h2>
    </div>
  )
}

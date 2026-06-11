import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/signup')({
  component: SignupPage,
})

function SignupPage() {
  return (
    <div>
        <h2>Sign up</h2>
    </div>
  )
}

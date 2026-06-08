import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col justify-center px-6">
      <p className="text-sm font-medium text-muted-foreground">AI Board</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-normal">
        환경 설정 완료
      </h1>
      <p className="mt-4 leading-7 text-muted-foreground">
        다음 단계부터 NestJS 모듈, TypeORM Entity, React 화면을 하나씩 직접
        구현합니다.
      </p>
    </main>
  )
}

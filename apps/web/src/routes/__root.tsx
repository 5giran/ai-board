import { Outlet, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <AppHeader />

      <main>
        <Outlet />
      </main>
    </div>
  )
}

function AppHeader() {
  return (
    <header>
      <h1>Extendly</h1>
    </header>
  )
}

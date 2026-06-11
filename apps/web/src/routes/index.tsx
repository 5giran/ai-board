import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div>
      <AppHeader />
      <SearchHero />
      <FilterSection />
      <ExtensionGrid />
    </div>
  )
}


function AppHeader() {
  return (
    <header>
      <h1>AppHeader</h1>
    </header>
  )
}

function SearchHero() {
  return (
    <section>
      <h2>SearchHero</h2>
    </section>
  )
}

function FilterSection() {
  return (
    <section>
      <h2>FilterSection</h2>
    </section>
  )
}

function ExtensionGrid() {
  return (
    <section>
      <h2>ExtensionGrid</h2>
    </section>
  )
}
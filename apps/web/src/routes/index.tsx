import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

// mock data
type ExtensionSummary = {
  id: string
  name: string
  platform: 'Chrome' | 'Obsidian' | 'VS Code' | 'Raycast' | 'Notion'
  provider: string
  description: string
  tags: string[]
  rating: number
  downloads: number
  updatedAt: string
  matchScore: number
  isMcpVerified: boolean
  sourceUrl: string
}

const mockExtensions: ExtensionSummary[] = [
  {
    id: '1',
    name: 'Raycast GitHub',
    platform: 'Raycast',
    provider: 'Raycast Community',
    description:
      'GitHub issues, pull requests, notifications를 빠르게 확인하고 처리하는 생산성 익스텐션.',
    tags: ['devtools', 'github', 'productivity'],
    rating: 4.8,
    downloads: 12400,
    updatedAt: '2026-05-21',
    matchScore: 94,
    isMcpVerified: true,
    sourceUrl: '#',
  },
  {
    id: '2',
    name: 'Obsidian Web Clipper',
    platform: 'Obsidian',
    provider: 'Community Plugin',
    description:
      '웹 페이지를 Obsidian 노트로 저장하고 태그와 메타데이터를 함께 정리합니다.',
    tags: ['notes', 'research', 'automation'],
    rating: 4.7,
    downloads: 9800,
    updatedAt: '2026-04-30',
    matchScore: 91,
    isMcpVerified: true,
    sourceUrl: '#',
  },
  {
    id: '3',
    name: 'Commit Message AI',
    platform: 'VS Code',
    provider: 'Open Source',
    description: '코드 변경사항을 분석해 커밋 메시지 초안을 추천합니다.',
    tags: ['git', 'ai', 'developer'],
    rating: 4.5,
    downloads: 22100,
    updatedAt: '2026-06-02',
    matchScore: 88,
    isMcpVerified: false,
    sourceUrl: '#',
  },
]
// 여기까지

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
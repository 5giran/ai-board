import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/extensions/new')({
  component: ExtensionNewPage,
})

function ExtensionNewPage() {
  return (
    <div>
        <h2>New Extension</h2>
    </div>
  )
}

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/extensions/$extensionId")({
  component: ExtensionDetailPage,
});

function ExtensionDetailPage() {
  const { extensionId } = Route.useParams();

  return (
    <div>
      <h2>Extension Detail</h2>
      <p>extensionId: {extensionId}</p>
    </div>
  );
}

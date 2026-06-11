import { createFileRoute } from "@tanstack/react-router";

import { mockExtensions } from "@/mocks/extensions";

export const Route = createFileRoute("/extensions/$extensionId")({
  component: ExtensionDetailPage,
});

function ExtensionDetailPage() {
  const { extensionId } = Route.useParams();

  const extension = mockExtensions.find(
    (extension) => extension.id === extensionId,
  );

  if (!extension) {
    return (
      <div>
        <h2>Extension not found</h2>
        <p>extensionId: {extensionId}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>{extension.name}</h2>

      <p>Platform: {extension.platform}</p>
      <p>Provider: {extension.provider}</p>
      <p>{extension.description}</p>

      <ul>
        {extension.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>

      <p>Rating: {extension.rating}</p>
      <p>Downloads: {extension.downloads}</p>
      <p>Updated: {extension.updatedAt}</p>
      <p>Match score: {extension.matchScore}%</p>
      <p>MCP verified: {extension.isMcpVerified ? "Yes" : "No"}</p>
    </div>
  );
}
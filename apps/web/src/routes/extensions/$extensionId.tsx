import { createFileRoute } from "@tanstack/react-router";

import { mockComments, mockExtensions } from "@/mocks/extensions";

export const Route = createFileRoute("/extensions/$extensionId")({
  component: ExtensionDetailPage,
});

function ExtensionDetailPage() {
  const { extensionId } = Route.useParams();

  const extension = mockExtensions.find(
    (extension) => extension.id === extensionId,
  );

  const comments = mockComments.filter(
    (comment) => comment.extensionId === extensionId,
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

      <h3>Tags</h3>
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

      <h3>Features</h3>
      <ul>
        {extension.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>

      <h3>Metadata</h3>
      <p>Version: {extension.version}</p>
      <p>License: {extension.license}</p>
      <p>Category: {extension.category}</p>
      <p>Fetched at: {extension.fetchedAt}</p>

      <h3>Compatibility</h3>
      <ul>
        {extension.compatibility.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h3>Permissions</h3>
      <ul>
        {extension.permissions.map((permission) => (
          <li key={permission}>{permission}</li>
        ))}
      </ul>

      <h3>Comments</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <strong>{comment.author}</strong>: {comment.content}
          </li>
        ))}
      </ul>
    </div>
  );
}
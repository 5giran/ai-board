import type { ExtensionSummary, Platform } from "@/mocks/extensions";

export function formatDownloads(downloads: number) {
  if (downloads >= 1000) {
    return `${(downloads / 1000).toFixed(downloads >= 10000 ? 1 : 1)}k`;
  }

  return `${downloads}`;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDate(date: string) {
  return date.slice(0, 10).replaceAll("-", ".");
}

export function platformSlug(platform: Platform) {
  return platform === "VS Code" ? "vscode" : platform.toLowerCase();
}

export function authorInitials(author: string) {
  const cleaned = author.replace(/[^a-zA-Z0-9]/g, "");

  return (cleaned.slice(0, 2) || "YR").toUpperCase();
}

export function verifiedLabel(extension: ExtensionSummary) {
  return extension.isMcpVerified ? "✓ MCP" : "unverified";
}

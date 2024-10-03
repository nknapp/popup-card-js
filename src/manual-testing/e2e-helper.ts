/**
 * Returns the of the manual test that is associated with the current test.
 * Call with "import.meta.url
 */
export function getAssociatedUrl(url: string): string {
  const baseUrl = new URL("..", import.meta.url).href;
  const relativePath = "./" + url.slice(baseUrl.length);
  const associatedModule = relativePath.replace(/\.spec\.ts$/, ".ts")
  return `http://localhost:5173?test=${encodeURIComponent(associatedModule)}&playwright=true`;
}

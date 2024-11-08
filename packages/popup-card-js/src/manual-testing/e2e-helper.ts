import { Page } from "@playwright/test";

/**
 * Opens  the of the manual test that is associated with the current test and waits for page to become ready for visual tests
 * Call with "import.meta.url" and current page object.
 */
export async function openAssociatedUrl(
  page: Page,
  url: string,
): Promise<void> {
  await page.goto(getAssociatedUrl(url));
}

/**
 * Returns the of the manual test that is associated with the current test.
 * Call with "import.meta.url
 */
function getAssociatedUrl(url: string): string {
  const baseUrl = new URL("..", import.meta.url).href;
  const relativePath = "./" + url.slice(baseUrl.length);
  const associatedModule = relativePath.replace(/\.spec\.ts$/, ".ts");
  return `/?test=${encodeURIComponent(associatedModule)}&playwright=true`;
}

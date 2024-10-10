import { Page } from "@playwright/test";

export async function simulateSteps(page: Page, steps = 100) {
  await page.waitForFunction(() => window.__simulator__);
  await page.evaluate((steps) => window.__simulator__.runSteps(steps), steps);
}

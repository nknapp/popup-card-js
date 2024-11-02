import { expect, test } from "@playwright/test";
import { openAssociatedUrl } from "../manual-testing/e2e-helper.ts";
import { simulateSteps } from "../manual-testing/simulateSteps.test-helper.ts";

test("scene", async ({ page }) => {
  await openAssociatedUrl(page, import.meta.url);
  await new Promise((resolve) => setTimeout(resolve, 100));
  await simulateSteps(page, 10);
  await expect(page).toHaveScreenshot();
  await simulateSteps(page, 30);
  await expect(page).toHaveScreenshot();
  await simulateSteps(page, 60);
  await expect(page).toHaveScreenshot();
});

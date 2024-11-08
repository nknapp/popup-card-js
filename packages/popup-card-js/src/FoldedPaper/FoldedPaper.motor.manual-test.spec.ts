import { expect, test } from "@playwright/test";
import { openAssociatedUrl } from "../manual-testing/e2e-helper.ts";
import { simulateSteps } from "../manual-testing/simulateSteps.test-helper.ts";

test("FoldedPaper.motor", async ({ page }) => {
  await openAssociatedUrl(page, import.meta.url);
  await page.waitForFunction(() => document.fonts.ready);

  await page.getByText("one=-60 two=60").click();
  await simulateSteps(page, 500);
  await expect(page).toHaveScreenshot();

  await page.getByText("two=90", { exact: true }).click();
  await simulateSteps(page, 500);
  await expect(page).toHaveScreenshot();
});

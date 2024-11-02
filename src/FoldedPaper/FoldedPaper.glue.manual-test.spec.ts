import { expect, test } from "@playwright/test";
import { openAssociatedUrl} from "../manual-testing/e2e-helper.ts";
import { simulateSteps } from "../manual-testing/simulateSteps.test-helper.ts";

test("FoldedPaper.glue", async ({ page }) => {
  await openAssociatedUrl(page, import.meta.url);

  await simulateSteps(page, 10);
  await expect(page).toHaveScreenshot();

  await page.getByText("one=-160").click();
  await simulateSteps(page, 200);
  await expect(page).toHaveScreenshot();

  await page.getByText("one=-180").click();
  await simulateSteps(page, 200);
  await expect(page).toHaveScreenshot();

  await page.getByText("one=0", { exact: true }).click();
  await simulateSteps(page, 300);
  await expect(page).toHaveScreenshot();
});

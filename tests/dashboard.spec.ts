import { expect, test } from "@playwright/test";

test("dashboard renders and can refresh data", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("dashboard-title")).toHaveText(
    "Multi Social Views Dashboard",
  );

  await expect(page.getByTestId("card-youtube")).toBeVisible();
  await expect(page.getByTestId("card-tiktok")).toBeVisible();
  await expect(page.getByTestId("card-instagram")).toBeVisible();

  await page.getByTestId("refresh-button").click();

  await expect(page.getByTestId("last-updated")).not.toContainText("Belum ada");
});

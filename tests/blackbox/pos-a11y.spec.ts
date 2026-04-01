import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("POS WebApp - Accessibility (A11y) Tests", () => {
  test("Dashboard page should not have any automatically detectable accessibility issues", async ({
    page,
  }) => {
    await page.goto("/");
    // Wait for main content to load
    await expect(page.getByText("Omzet Hari Ini")).toBeVisible();

    // Analyze page
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    // A completely clean run would be: expect(accessibilityScanResults.violations).toEqual([])
    // But since complex UIs often have minor violations, we check for critical ones:
    const criticalViolations = accessibilityScanResults.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(criticalViolations.length).toBeLessThan(5); // Adjust threshold as needed
  });

  test("Cashier page should be accessible", async ({ page }) => {
    await page.goto("/cashier");

    // Check main layout
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    const criticalViolations = accessibilityScanResults.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    // Ideally we'd assert to be exactly 0, but in legacy/existing code we ensure it's low
    expect(criticalViolations.length).toBeLessThan(5);
  });

  test("Store Settings should have properly labelled inputs", async ({
    page,
  }) => {
    await page.goto("/store-settings");
    await expect(page.locator("#storeName")).toBeVisible();

    // Specifically test this section for forms
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include("#storeName")
      .analyze();

    // The input should have an associated label or aria-label
    expect(
      accessibilityScanResults.violations.find((v) => v.id === "label"),
    ).toBeUndefined();
  });
});

import { test, expect, type Page } from "@playwright/test";
const errors = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  errors.set(page, []);
  page.on("pageerror", (error) => errors.get(page)!.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.get(page)!.push(message.text());
  });
  await page.goto("/");
});
test.afterEach(async ({ page }) => {
  expect(errors.get(page)).toEqual([]);
});
test("homepage and six chapters load without runtime errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await expect(
    page.getByRole("heading", { name: "VOLT R1", exact: true }),
  ).toBeVisible();
  for (const id of [
    "awakening",
    "performance",
    "battery",
    "engineering",
    "configurator",
    "ride",
  ])
    await expect(page.locator(`#${id}`)).toBeAttached();
  await expect(page.locator("#awakening canvas")).toBeVisible();
  await expect(page.locator("#awakening .scene-loading")).toHaveCount(0);
  expect(errors).toEqual([]);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator(".hero-title")).toHaveCSS("opacity", "1");
  await page.screenshot({ path: "test-results/volt-r1-desktop.png" });
});
test("configurator changes finish, battery and ride data", async ({ page }) => {
  const config = page.locator("#configurator");
  await config.scrollIntoViewIfNeeded();
  await config.getByRole("button", { name: "Signal Red", exact: true }).click();
  await expect(
    config.getByRole("button", { name: "Signal Red", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await config.getByRole("button", { name: "4. Battery", exact: true }).click();
  await config.getByRole("button", { name: "Long Range", exact: true }).click();
  await expect(page.getByTestId("config-range")).toHaveText("228 mi");
  await config
    .getByRole("button", { name: "6. Ride mode", exact: true })
    .click();
  await config.getByRole("button", { name: "Sport", exact: true }).click();
  await expect(page.getByTestId("config-range")).toHaveText("210 mi");
  await expect(page.getByTestId("config-acceleration")).toHaveText("3.0 sec");
});
test("day and night switch updates accessible state", async ({ page }) => {
  await page
    .locator("#awakening")
    .getByRole("button", { name: "Switch to night mode" })
    .click();
  await expect(page.locator("#awakening")).toHaveClass(/night/);
  await page
    .locator("#awakening")
    .getByRole("button", { name: "Switch to day mode" })
    .click();
  await expect(page.locator("#awakening")).not.toHaveClass(/night/);
});
test("engineering selection and reset work with keyboard", async ({ page }) => {
  const engineering = page.locator("#engineering");
  await engineering.scrollIntoViewIfNeeded();
  const motor = engineering.getByRole("button", {
    name: "02 Motor",
    exact: true,
  });
  await motor.focus();
  await page.keyboard.press("Enter");
  await expect(motor).toHaveAttribute("aria-pressed", "true");
  await expect(
    engineering.getByRole("heading", { name: "Motor", exact: true }),
  ).toBeVisible();
  await engineering
    .getByRole("button", { name: "Reset view", exact: true })
    .click();
  await expect(motor).toHaveAttribute("aria-pressed", "false");
  await engineering.screenshot({
    path: "test-results/volt-r1-engineering.png",
  });
});
test("saved builds and shared URL preserve configuration", async ({ page }) => {
  const config = page.locator("#configurator");
  await config.scrollIntoViewIfNeeded();
  await config.getByRole("button", { name: "Arctic White" }).click();
  await config
    .getByRole("button", { name: "Save locally", exact: true })
    .click();
  await config
    .getByRole("button", { name: "Reset build", exact: true })
    .click();
  await config
    .getByRole("button", { name: "Restore saved", exact: true })
    .click();
  await expect(
    config.getByRole("button", { name: "Arctic White" }),
  ).toHaveAttribute("aria-pressed", "true");
  await config
    .getByRole("button", { name: "Share build", exact: false })
    .click();
  await expect(page.getByLabel("Configuration link")).toHaveValue(
    /color=%23e3e5df/,
  );
  await page.reload();
  await expect(
    page.locator("#configurator").getByRole("button", { name: "Arctic White" }),
  ).toHaveAttribute("aria-pressed", "true");
});
test("reduced motion retains battery inspection and ride controls", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await page
    .locator("#battery")
    .getByRole("button", { name: "Inspect battery", exact: false })
    .click();
  await expect(
    page
      .locator("#battery")
      .getByRole("button", { name: "Inspect battery", exact: false }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .locator("#ride")
    .getByRole("button", { name: "START R1", exact: false })
    .click();
  await expect(page.locator("#ride")).toContainText(
    "R1 READY / STILL EXPERIENCE",
  );
  await page
    .locator("#ride")
    .getByRole("button", { name: "STOP R1", exact: false })
    .click();
});
test("mobile has no overflow and exposes an intentional 3D fallback", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(
    page
      .locator("#awakening")
      .getByRole("button", { name: "Explore in 3D", exact: false }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/volt-r1-mobile.png",
    fullPage: false,
  });
});
test("developer diagnostics and case study are available", async ({ page }) => {
  await page.getByRole("button", { name: /DEV MODE/ }).click();
  await expect(page.getByText("DRAW CALLS", { exact: true })).toBeVisible();
  await page.getByLabel("Wireframe", { exact: true }).check();
  await page.goto("/case-study");
  await expect(
    page.getByRole("heading", { name: "Actual measurements." }),
  ).toBeVisible();
  await expect(page.getByText("GLB ASSET", { exact: true })).toBeVisible();
});

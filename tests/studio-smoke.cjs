const { chromium } = require("playwright");
const assert = require("node:assert/strict");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || undefined,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  page.setDefaultTimeout(10000);
  const errors = [];
  page.on("pageerror", (e) => {
    errors.push(e.message);
    console.error("PAGE ERROR", e.message);
  });
  await page.goto(process.env.TEST_URL || "http://127.0.0.1:5173");
  await page
    .getByRole("heading", {
      name: "A future in medicine. A path that’s yours.",
    })
    .waitFor();
  await page.screenshot({ path: "/tmp/aesculamd-desktop.png", fullPage: true });
  await page.getByRole("button", { name: "Personalize my path" }).click();
  await page.locator("[name=name]").fill("Alex");
  await page.locator("[name=capacity]").selectOption("30");
  await page.locator("[name=priority]").selectOption("5");
  await page.getByLabel("Limited transportation").check();
  await page.getByRole("button", { name: "Create my action plan" }).click();
  assert.equal(await page.locator(".action-row").count(), 3);
  await page
    .getByText(
      "Find one nearby or transit-accessible role and check duties and availability",
      { exact: true },
    )
    .waitFor();
  await page.locator(".action-row input[type=checkbox]").first().check();
  await page.reload();
  await page.getByRole("button", { name: /My action plan/ }).click();
  assert.equal(
    await page.locator(".action-row input[type=checkbox]").first().isChecked(),
    true,
  );
  await page.getByRole("button", { name: /Learning studio/ }).click();
  await page.locator("#page-learning .learning-card").first().click();
  await page.locator(".case-option").nth(1).click();
  await page
    .locator("#session-reflection")
    .fill(
      "At work I noticed two new teammates missed a closing step. I asked what confused them, made a checklist together, and checked whether it helped next week.",
    );
  await page
    .getByRole("button", { name: "Save reflection & next step" })
    .click();
  assert.equal(await page.locator(".action-row").count(), 4);
  await page.getByRole("button", { name: /Evidence log/ }).click();
  assert.ok(
    (await page.locator("#page-evidencelog").textContent()).includes(
      "At work I noticed",
    ),
  );
  await page.getByRole("button", { name: /AI coach/ }).click();
  await page.locator("#studio-question").fill("How do I prioritize my time?");
  await page.getByRole("button", { name: "Think it through" }).click();
  await page
    .getByText("On-device planning prompt · not AI", { exact: true })
    .waitFor();
  await page.route("**/api/ai-reply", (r) =>
    r.fulfill({
      status: 503,
      contentType: "application/json",
      body: '{"error":"unavailable"}',
    }),
  );
  await page.locator("#studio-consent").check();
  await page.getByRole("button", { name: "Think it through" }).click();
  await page
    .getByText("AI unavailable · on-device planning prompt", { exact: true })
    .waitFor();
  await page.getByRole("button", { name: /Progress & privacy/ }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download full backup" }).click();
  const file = await download;
  await file.saveAs("/tmp/aesculamd-backup.json");
  const data = JSON.parse(
    require("fs").readFileSync("/tmp/aesculamd-backup.json"),
  );
  assert.equal(data.studio.actions.length, 4);
  assert.equal(data.curriculum.evidenceLog.length, 1);
  page.on("dialog", (d) => d.accept());
  await page
    .locator("input[type=file]")
    .setInputFiles("/tmp/aesculamd-backup.json");
  await page.waitForTimeout(600);
  assert.equal(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("aesculamd-studio-v1")).actions.length,
    ),
    4,
  );
  await page.getByRole("button", { name: /Full curriculum/ }).click();
  await page.locator(".stage-row").first().click();
  await page.locator("#sp-title").waitFor();
  await page.getByRole("button", { name: /Overview/ }).click();
  await page.screenshot({
    path: "/tmp/aesculamd-personalized.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "/tmp/aesculamd-mobile.png", fullPage: true });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    true,
  );
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page.getByRole("button", { name: /Learning studio/ }).click();
  assert.equal(
    await page
      .locator("#sidebar")
      .evaluate((e) => e.classList.contains("open")),
    false,
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: onboarding, constraints, action persistence, learning reflection, evidence, offline/failed AI, backup/restore, legacy lesson, mobile navigation; no JS errors.",
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

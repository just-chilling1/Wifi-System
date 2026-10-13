const { chromium } = require("playwright");
const path = require("path");

const routes = [
  ["dashboard", "/dashboard"],
  ["create", "/create"],
  ["pages", "/pages"],
  ["share", "/share"],
  ["training", "/training"],
  ["support", "/support"],
  ["bonus-training", "/bonus-training"],
  ["dfy-profit", "/upgrades/dfy-profit"],
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
  });
  await page.addInitScript(() => {
    localStorage.setItem("wificode:wifi-code-verified", "1");
  });
  const outDir = path.join(__dirname, "screenshots");
  require("fs").mkdirSync(outDir, { recursive: true });
  const base = process.env.APP_URL || "http://localhost:3000";

  for (const [name, route] of routes) {
    try {
      await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded", timeout: 90000 });
      await page.waitForTimeout(4000);
      const finalUrl = page.url();
      if (/\/(login|signin|signup|onboarding|auth)/.test(finalUrl)) {
        console.log(`FAIL ${name}: redirected to ${finalUrl}`);
        continue;
      }
      await page.screenshot({ path: path.join(outDir, `${name}.png`) });
      console.log(`OK ${name} -> ${finalUrl}`);
    } catch (e) {
      console.log(`FAIL ${name}: ${e.message.split("\n")[0]}`);
    }
  }
  await browser.close();
})();

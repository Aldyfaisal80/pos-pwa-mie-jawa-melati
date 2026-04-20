import { chromium } from "playwright";
import path from "path";
import fs from "fs";

const OUTPUT_DIR = path.join(process.cwd(), "docs/wireframe/screenshots");
const BASE_URL = "http://localhost:3030";

const PAGES = [
  { file: "wireframe-index.html", name: "00-index" },
  { file: "wireframe-01-dashboard.html", name: "01-dashboard" },
  { file: "wireframe-02-cashier.html", name: "02-cashier" },
  { file: "wireframe-03-product.html", name: "03-product" },
  { file: "wireframe-04-report.html", name: "04-report" },
  { file: "wireframe-05-settings.html", name: "05-settings" },
];

const VIEWPORTS = [
  { width: 1440, height: 900, suffix: "desktop" },
  { width: 390, height: 844, suffix: "mobile" },
];

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const browser = await chromium.launch();

  for (const page of PAGES) {
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({ viewport: vp });
      const p = await ctx.newPage();
      
      console.log(`Loading ${page.file} on ${vp.suffix}...`);
      await p.goto(`${BASE_URL}/${page.file}`, { waitUntil: "networkidle" });
      
      const filename = `WF-${page.name}-${vp.suffix}.png`;
      await p.screenshot({
        path: path.join(OUTPUT_DIR, filename),
        fullPage: true,
      });
      
      console.log(`✅ Captured: ${filename}`);
      await ctx.close();
    }
  }

  await browser.close();
  console.log(`\n🎉 All screenshots saved to: ${OUTPUT_DIR}`);
}

main().catch(console.error);

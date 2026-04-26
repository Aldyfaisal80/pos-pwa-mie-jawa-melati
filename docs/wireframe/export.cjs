const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    console.log("Navigating to http://127.0.0.1:5500/docs/wireframe/wireframe-05-settings.html");
    await page.goto('http://127.0.0.1:5500/docs/wireframe/wireframe-05-settings.html', { waitUntil: 'networkidle' });

    const exportDir = path.join(__dirname, 'export');
    if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
    }

    const views = [
      { viewId: 'view-desktop', selector: '#wf05d .desktop-frame', file: 'WF-05-Pengaturan-Desktop.png', name: 'Desktop' },
      { viewId: 'view-mobile', selector: '#wf05m .mobile-frame', file: 'WF-05-Pengaturan-Mobile.png', name: 'Mobile' },
      { viewId: 'view-panel-store', selector: '#wf05pi .modal-stage', file: 'WF-05-Panel-InfoToko.png', name: 'Panel Info Toko' },
      { viewId: 'view-panel-printer', selector: '#wf05pp .modal-stage', file: 'WF-05-Panel-Printer.png', name: 'Panel Printer' },
      { viewId: 'view-panel-account', selector: '#wf05ac .modal-stage', file: 'WF-05-Panel-Akun.png', name: 'Panel Akun' },
      { viewId: 'view-account-sheet', selector: '#wf05as .mobile-frame', file: 'WF-05-AccountSheet-Mobile.png', name: 'AccountSheet Mobile' },
    ];

    for (const view of views) {
        console.log(`Processing ${view.name}...`);
        
        await page.evaluate((vid) => {
            const allViews = ['view-desktop', 'view-mobile', 'view-panel-store', 'view-panel-printer', 'view-panel-account', 'view-account-sheet'];
            allViews.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.style.display = (id === vid) ? 'block' : 'none';
                }
            });
        }, view.viewId);

        await page.waitForTimeout(500); // wait for layout to stabilize

        const element = await page.$(view.selector);
        if (element) {
            const savePath = path.join(exportDir, view.file);
            console.log(`Capturing screenshot for ${view.name}...`);
            // Adding force: true to bypass any potential clickability checks, and padding via margin or just raw element
            await element.screenshot({ path: savePath, omitBackground: true, timeout: 10000 });
            console.log(`Saved to ${savePath}`);
        } else {
            console.warn(`Element ${view.selector} not found`);
        }
    }
    
    await browser.close();
    console.log("Export complete!");
  } catch (error) {
    console.error("Error during export:", error);
    process.exit(1);
  }
})();

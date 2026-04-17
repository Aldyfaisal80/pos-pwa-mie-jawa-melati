// @ts-nocheck
// wireframe-shared.js — Shared utilities for all POS PWA wireframe docs

/**
 * Export a wireframe frame as PNG.
 * Captures only the inner frame (.mobile-frame, .desktop-frame, .modal-bg, .modal-stage)
 * with 16px padding on all sides — does NOT include the frame-unit label or canvas background.
 *
 * @param {string} id - The id of the .frame-unit wrapper element
 * @param {string} fn - The desired filename (without .png extension)
 */
async function exportSection(id, fn) {
  const frameUnit = document.getElementById(id);
  if (!frameUnit) return;
  const el = frameUnit.querySelector(
    '.mobile-frame, .desktop-frame, .modal-bg, .modal-stage'
  ) || frameUnit;

  const btn = event.target.closest('button');
  const orig = btn.innerHTML;
  btn.innerHTML = '⏳...';
  btn.disabled = true;

  const PAD = 16;
  try {
    const canvas = await html2canvas(el, {
      backgroundColor: '#efefef',
      scale: 2,
      useCORS: true,
      logging: false,
      x: -PAD,
      y: -PAD,
      width: el.offsetWidth + PAD * 2,
      height: el.offsetHeight + PAD * 2
    });
    const a = document.createElement('a');
    a.download = fn + '.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
  } catch (e) {
    alert('Gagal export: ' + e.message);
  }

  btn.innerHTML = orig;
  btn.disabled = false;
}

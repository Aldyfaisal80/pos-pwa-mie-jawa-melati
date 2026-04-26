// @ts-nocheck
// wireframe-shared.js — Shared utilities for all POS PWA wireframe docs

/**
 * Export a wireframe frame as PNG.
 * Captures only the inner frame (.mobile-frame, .desktop-frame, .modal-bg, .modal-stage)
 * with 16px padding on all sides.
 *
 * FIX: Temporarily reveals all hidden ancestors (display:none) before capturing,
 * waits for browser to compute layout, then captures using getBoundingClientRect
 * for accurate dimensions. Restores original visibility state after export.
 *
 * @param {string} id - The id of the frame wrapper element
 * @param {string} fn - The desired filename (without .png extension)
 */
async function exportSection(id, fn) {
  const frameUnit = document.getElementById(id);
  if (!frameUnit) return;

  // Capture the button reference BEFORE modifying DOM (event may become stale)
  let btn = null;
  let orig = '';
  if (typeof event !== 'undefined' && event && event.target) {
    btn = event.target.closest('button');
    if (btn) {
      orig = btn.innerHTML;
      btn.innerHTML = '⏳...';
      btn.disabled = true;
    }
  }

  // Temporarily show all hidden ancestors so html2canvas can render them
  const hiddenAncestors = [];
  let ancestor = frameUnit.parentElement;
  while (ancestor && ancestor !== document.body) {
    if (getComputedStyle(ancestor).display === 'none') {
      hiddenAncestors.push({ el: ancestor, prevDisplay: ancestor.style.display });
      ancestor.style.display = 'block';
    }
    ancestor = ancestor.parentElement;
  }

  // Wait for browser layout engine to compute dimensions after visibility change
  await new Promise(resolve => setTimeout(resolve, 100));

  const el = frameUnit.querySelector(
    '.mobile-frame, .desktop-frame, .modal-bg, .modal-stage'
  ) || frameUnit;

  // Use getBoundingClientRect for accurate rendered dimensions
  const rect = el.getBoundingClientRect();
  const PAD = 16;

  // Fallback: use CSS variable values if dimensions still zero
  const elW = (rect.width > 0 ? rect.width : el.offsetWidth) || 200;
  const elH = (rect.height > 0 ? rect.height : el.offsetHeight) || 440;

  try {
    const canvas = await html2canvas(el, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      logging: false,
      x: -PAD,
      y: -PAD,
      width: elW + PAD * 2,
      height: elH + PAD * 2
    });
    const a = document.createElement('a');
    a.download = fn + '.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
  } catch (e) {
    alert('Gagal export: ' + e.message);
  }

  // Restore original visibility of all ancestors we temporarily revealed
  hiddenAncestors.forEach(({ el: hiddenEl, prevDisplay }) => {
    hiddenEl.style.display = prevDisplay;
  });

  if (btn) {
    btn.innerHTML = orig;
    btn.disabled = false;
  }
}

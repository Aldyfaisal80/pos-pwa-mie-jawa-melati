import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Membuat SVG sederhana "MJ" (Mie Jawa)
const createIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#2563EB" rx="${size * 0.2}" />
  <text 
    x="50%" 
    y="55%" 
    font-family="system-ui, sans-serif" 
    font-size="${size * 0.45}px" 
    font-weight="bold" 
    fill="white" 
    text-anchor="middle" 
    dominant-baseline="middle"
  >MJ</text>
</svg>
`;

// Kita simpan sebagai PNG base64 hack (svg to png via node canvas terlalu berat untuk dummy)
// Jadi simpan saja SVG dan ubah manifest agar membaca SVG.
// Atau buat file dummy sementara agar next-pwa tidak protes.

const publicDir = path.join(__dirname, "..", "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

fs.writeFileSync(path.join(publicDir, "icon-192x192.svg"), createIcon(192));
fs.writeFileSync(path.join(publicDir, "icon-512x512.svg"), createIcon(512));

console.log("Dummy icons generated!");

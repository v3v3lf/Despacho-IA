// Generate premium icons for the extension
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const sizes = [16, 48, 128];
const iconsDir = path.join(__dirname, 'icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Color palette requested: white icon with green "Sisp" text
const colors = {
  bg: '#ffffff',
  border: '#d1fae5',
  green: '#00a86b',
  greenDark: '#047857',
  shadow: 'rgba(4, 120, 87, 0.18)'
};

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  const scale = size / 128;
  const radius = 22 * scale;
  const padding = 6 * scale;

  // Transparent outside + white rounded square
  ctx.clearRect(0, 0, size, size);

  ctx.beginPath();
  ctx.roundRect(padding, padding, size - padding * 2, size - padding * 2, radius);
  ctx.fillStyle = colors.bg;
  ctx.fill();

  // Subtle green border
  ctx.lineWidth = Math.max(1, 3 * scale);
  ctx.strokeStyle = colors.border;
  ctx.stroke();

  // Soft shadow/glow inside
  const glow = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  glow.addColorStop(0, 'rgba(16, 185, 129, 0.10)');
  glow.addColorStop(1, 'rgba(16, 185, 129, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(padding, padding, size - padding * 2, size - padding * 2);

  // Text "Sisp" in green. For tiny 16px icon, use "S" for legibility.
  const text = size <= 16 ? 'S' : 'Sisp';
  const fontSize = size <= 16 ? size * 0.66 : size * 0.34;
  ctx.fillStyle = colors.green;
  ctx.font = `800 ${fontSize}px Arial, Helvetica, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, size / 2, size / 2 + 2 * scale);

  // Small green underline for brand accent on larger icons
  if (size > 16) {
    const lineW = size * 0.46;
    const lineH = Math.max(2, 5 * scale);
    const lineX = (size - lineW) / 2;
    const lineY = size * 0.69;
    ctx.beginPath();
    ctx.roundRect(lineX, lineY, lineW, lineH, lineH / 2);
    ctx.fillStyle = colors.greenDark;
    ctx.fill();
  }

  // Save the icon
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(iconsDir, `icon${size}.png`), buffer);
  console.log(`✓ Created icon${size}.png`);
}

// Generate icons
sizes.forEach(size => drawIcon(size));

console.log('\n✅ All premium icons generated!');
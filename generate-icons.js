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

// Premium color palette
const colors = {
  bg: '#080b14',
  surface: '#0d1117',
  accent: '#00e5bb',
  accentDark: '#00c9a7',
  text: '#e2e8f0',
  glow: 'rgba(0, 229, 187, 0.4)'
};

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  const scale = size / 128;
  
  // Background - dark gradient
  const bgGrad = ctx.createLinearGradient(0, 0, size, size);
  bgGrad.addColorStop(0, '#0f172a');
  bgGrad.addColorStop(1, '#080b14');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);
  
  // Border/frame effect
  ctx.strokeStyle = 'rgba(0, 229, 187, 0.3)';
  ctx.lineWidth = 1 * scale;
  ctx.strokeRect(2 * scale, 2 * scale, size - 4 * scale, size - 4 * scale);
  
  // Inner glow
  const innerGrad = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  );
  innerGrad.addColorStop(0, 'rgba(0, 229, 187, 0.15)');
  innerGrad.addColorStop(1, 'rgba(0, 229, 187, 0)');
  ctx.fillStyle = innerGrad;
  ctx.fillRect(4 * scale, 4 * scale, size - 8 * scale, size - 8 * scale);
  
  // Main accent box (rounded rectangle)
  const boxSize = size * 0.7;
  const boxX = (size - boxSize) / 2;
  const boxY = (size - boxSize) / 2;
  const radius = 12 * scale;
  
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxSize, boxSize, radius);
  ctx.fillStyle = colors.accent;
  ctx.fill();
  
  // Inner shadow for depth
  ctx.beginPath();
  ctx.roundRect(boxX + 2 * scale, boxY + 2 * scale, boxSize - 4 * scale, boxSize - 4 * scale, radius - 2 * scale);
  ctx.fillStyle = colors.accentDark;
  ctx.fill();
  
  // Text "S" for SISP
  const fontSize = size * 0.45;
  ctx.fillStyle = '#080b14';
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('S', size / 2, size / 2 + 2 * scale);
  
  // Small accent dot (badge indicator)
  const dotSize = size * 0.12;
  const dotX = size - dotSize - 4 * scale;
  const dotY = 4 * scale;
  ctx.beginPath();
  ctx.arc(dotX + dotSize / 2, dotY + dotSize / 2, dotSize / 2, 0, Math.PI * 2);
  ctx.fillStyle = '#34d399';
  ctx.fill();
  
  // Glow effect around dot
  ctx.beginPath();
  ctx.arc(dotX + dotSize / 2, dotY + dotSize / 2, dotSize / 2 + 2 * scale, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(52, 211, 153, 0.3)';
  ctx.fill();
  
  // Save the icon
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(iconsDir, `icon${size}.png`), buffer);
  console.log(`✓ Created icon${size}.png`);
}

// Generate icons
sizes.forEach(size => drawIcon(size));

console.log('\n✅ All premium icons generated!');
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), "..");
const assetsDir = path.join(root, "assets");
fs.mkdirSync(assetsDir, { recursive: true });

const size = 512;
const pixels = Buffer.alloc(size * size * 4);

function setPixel(x, y, r, g, b, a = 255) {
  const offset = (y * size + x) * 4;
  pixels[offset] = r;
  pixels[offset + 1] = g;
  pixels[offset + 2] = b;
  pixels[offset + 3] = a;
}

function roundedRect(x, y, width, height, radius, color) {
  const [r, g, b, a] = color;
  const startX = Math.max(0, Math.round(x));
  const startY = Math.max(0, Math.round(y));
  const endX = Math.min(size, Math.round(x + width));
  const endY = Math.min(size, Math.round(y + height));

  for (let py = startY; py < endY; py += 1) {
    for (let px = startX; px < endX; px += 1) {
      const left = px - x;
      const right = x + width - 1 - px;
      const top = py - y;
      const bottom = y + height - 1 - py;
      const dx = Math.max(radius - Math.min(left, right), 0);
      const dy = Math.max(radius - Math.min(top, bottom), 0);
      if (dx * dx + dy * dy <= radius * radius) {
        setPixel(px, py, r, g, b, a);
      }
    }
  }
}

function line(x0, y0, x1, y1, thickness, color) {
  const [r, g, b, a] = color;
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const x = Math.round(x0 + (x1 - x0) * t);
    const y = Math.round(y0 + (y1 - y0) * t);
    roundedRect(x - thickness / 2, y - thickness / 2, thickness, thickness, thickness / 2, [r, g, b, a]);
  }
}

for (let y = 0; y < size; y += 1) {
  for (let x = 0; x < size; x += 1) {
    const t = (x + y) / (size * 2);
    setPixel(x, y, Math.round(28 + 18 * t), Math.round(91 + 84 * t), Math.round(190 - 76 * t), 255);
  }
}

roundedRect(76, 76, 360, 360, 72, [255, 255, 255, 238]);
roundedRect(118, 130, 276, 52, 20, [37, 99, 235, 255]);
roundedRect(118, 214, 126, 126, 28, [15, 118, 110, 255]);
roundedRect(268, 214, 126, 126, 28, [180, 83, 9, 255]);
line(154, 384, 358, 384, 18, [30, 41, 59, 255]);
line(154, 416, 286, 416, 18, [30, 41, 59, 220]);

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const name = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([name, data])), 0);
  return Buffer.concat([length, name, data, crc]);
}

function pngFromRgba(width, height, rgba) {
  const scanlines = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const scanlineOffset = y * (width * 4 + 1);
    scanlines[scanlineOffset] = 0;
    rgba.copy(scanlines, scanlineOffset + 1, y * width * 4, (y + 1) * width * 4);
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    signature,
    pngChunk("IHDR", header),
    pngChunk("IDAT", zlib.deflateSync(scanlines, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0))
  ]);
}

const png = pngFromRgba(size, size, pixels);
fs.writeFileSync(path.join(assetsDir, "icon.png"), png);

const icoHeader = Buffer.alloc(22);
icoHeader.writeUInt16LE(0, 0);
icoHeader.writeUInt16LE(1, 2);
icoHeader.writeUInt16LE(1, 4);
icoHeader[6] = 0;
icoHeader[7] = 0;
icoHeader[8] = 0;
icoHeader[9] = 0;
icoHeader.writeUInt16LE(1, 10);
icoHeader.writeUInt16LE(32, 12);
icoHeader.writeUInt32LE(png.length, 14);
icoHeader.writeUInt32LE(22, 18);
fs.writeFileSync(path.join(assetsDir, "icon.ico"), Buffer.concat([icoHeader, png]));

console.log("Generated assets/icon.png and assets/icon.ico");

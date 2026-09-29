import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPngBuffer(width, height, drawPixelFn) {
  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // Helper to compute CRC32
  function makeCrcTable() {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        if (c & 1) c = 0xedb88320 ^ (c >>> 1);
        else c = c >>> 1;
      }
      table[n] = c >>> 0;
    }
    return table;
  }
  const crcTable = makeCrcTable();

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function createChunk(type, data) {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const toCrc = Buffer.concat([typeBuf, data]);
    crcBuf.writeUInt32BE(crc32(toCrc), 0);
    return Buffer.concat([length, typeBuf, data, crcBuf]);
  }

  // IHDR Chunk: 13 bytes
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth: 8
  ihdrData[9] = 6; // Color type: 6 (RGBA)
  ihdrData[10] = 0; // Compression method: 0
  ihdrData[11] = 0; // Filter method: 0
  ihdrData[12] = 0; // Interlace method: 0
  const ihdr = createChunk('IHDR', ihdrData);

  // Raw scanlines with filter byte 0 (None)
  const bytesPerPixel = 4;
  const stride = width * bytesPerPixel + 1;
  const rawData = Buffer.alloc(height * stride);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * stride;
    rawData[rowOffset] = 0; // Filter: 0
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * bytesPerPixel;
      const [r, g, b, a] = drawPixelFn(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  // Compress raw scanlines using zlib deflate
  const compressed = zlib.deflateSync(rawData, { level: 9 });
  const idat = createChunk('IDAT', compressed);

  // IEND Chunk
  const iend = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

/**
 * Geometric drawing function for Darshan Monogram "D" + Amber Gold theme
 */
function darshanIconPainter(x, y, width, height) {
  const nx = (x / width) * 2 - 1; // -1 to 1
  const ny = (y / height) * 2 - 1;
  const distFromCenter = Math.sqrt(nx * nx + ny * ny);

  // Rounded corner mask
  const cornerRadius = 0.65;
  const cornerDist = Math.max(Math.abs(nx), Math.abs(ny));
  if (Math.abs(nx) > cornerRadius && Math.abs(ny) > cornerRadius) {
    const cx = Math.abs(nx) - cornerRadius;
    const cy = Math.abs(ny) - cornerRadius;
    if (cx * cx + cy * cy > (1 - cornerRadius) * (1 - cornerRadius)) {
      return [0, 0, 0, 0]; // Transparent outside rounded corner
    }
  }

  // Base background: Dark Obsidian (#09090b to #18181b)
  let bgR = 14 + Math.round((1 - ny) * 8);
  let bgG = 14 + Math.round((1 - ny) * 8);
  let bgB = 18 + Math.round((1 - ny) * 8);

  // Outer border ring
  if (cornerDist > 0.92 && cornerDist <= 0.98) {
    // Amber subtle border
    return [245, 158, 11, 200];
  }

  // Radial ambient amber glow behind monogram
  if (distFromCenter < 0.65) {
    const glowIntensity = (1 - distFromCenter / 0.65) * 0.35;
    bgR = Math.min(255, bgR + Math.round(245 * glowIntensity));
    bgG = Math.min(255, bgG + Math.round(158 * glowIntensity));
    bgB = Math.min(255, bgB + Math.round(11 * glowIntensity));
  }

  // Draw Monogram "D"
  // D Vertical stem: x in [-0.45, -0.25], y in [-0.55, 0.55]
  const inStem = nx >= -0.45 && nx <= -0.22 && ny >= -0.55 && ny <= 0.55;

  // D Top curve:
  const inTopBar = ny >= -0.55 && ny <= -0.35 && nx >= -0.45 && nx <= 0.15;
  // D Bottom curve:
  const inBottomBar = ny >= 0.35 && ny <= 0.55 && nx >= -0.45 && nx <= 0.15;

  // D Outer arc: Center (0.1, 0), radius ~0.55
  const arcDx = nx - 0.1;
  const arcDy = ny;
  const arcDist = Math.sqrt(arcDx * arcDx + arcDy * arcDy);
  const inOuterArc = arcDist <= 0.55 && nx >= 0.05 && ny >= -0.55 && ny <= 0.55;
  const inInnerHole = arcDist <= 0.32 && nx >= -0.22 && ny >= -0.35 && ny <= 0.35;

  const isMonogramD = (inStem || inTopBar || inBottomBar || inOuterArc) && !inInnerHole;

  // Cinematic play wedge inside:
  const inPlayTriangle =
    nx >= -0.15 &&
    nx <= 0.25 &&
    Math.abs(ny) <= (0.25 - nx) * 0.65 &&
    nx >= -0.1;

  if (isMonogramD || inPlayTriangle) {
    // Amber gold gradient: #fef08a to #f59e0b
    const goldFactor = (nx + 0.5 + (1 - ny)) * 0.4;
    const r = Math.min(255, Math.round(251 + goldFactor * 4));
    const g = Math.min(255, Math.round(191 + goldFactor * 30));
    const b = Math.min(255, Math.round(36 + goldFactor * 100));
    return [r, g, b, 255];
  }

  return [bgR, bgG, bgB, 255];
}

/**
 * Creates a valid single-image ICO file from PNG buffer
 */
function createIcoFile(pngBuffer, width, height) {
  // ICO Header: 6 bytes
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type: 1 = Icon
  header.writeUInt16LE(1, 4); // Count of images: 1

  // Directory Entry: 16 bytes
  const entry = Buffer.alloc(16);
  entry[0] = width >= 256 ? 0 : width; // Width
  entry[1] = height >= 256 ? 0 : height; // Height
  entry[2] = 0; // Color palette: 0
  entry[3] = 0; // Reserved
  entry.writeUInt16LE(1, 4); // Color planes: 1
  entry.writeUInt16LE(32, 6); // Bits per pixel: 32
  entry.writeUInt32BE(pngBuffer.length, 8); // Size of image data
  entry.writeUInt32BE(22, 12); // Offset of image data (6 + 16 = 22)

  // Note: For ICO byte order, size and offset are little-endian
  entry.writeUInt32LE(pngBuffer.length, 8);
  entry.writeUInt32LE(22, 12);

  return Buffer.concat([header, entry, pngBuffer]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating high-resolution browser icons...');

// 1. 32x32 Favicon PNG & ICO
const png32 = createPngBuffer(32, 32, darshanIconPainter);
const ico = createIcoFile(png32, 32, 32);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico);
fs.writeFileSync(path.join('src/app', 'favicon.ico'), ico);
console.log('✓ public/favicon.ico & src/app/favicon.ico generated');

// 2. 180x180 Apple Touch Icon
const png180 = createPngBuffer(180, 180, darshanIconPainter);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
console.log('✓ public/apple-touch-icon.png generated');

// 3. 192x192 Web App Icon
const png192 = createPngBuffer(192, 192, darshanIconPainter);
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), png192);
console.log('✓ public/icon-192.png generated');

// 4. 512x512 High-Res Splash Icon
const png512 = createPngBuffer(512, 512, darshanIconPainter);
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), png512);
console.log('✓ public/icon-512.png generated');

console.log('All browser icons successfully created!');

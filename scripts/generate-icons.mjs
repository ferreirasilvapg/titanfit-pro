import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const crc = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(crc, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function generatePng(width, height, isMaskable = false) {
  // PNG signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Raw image data with filter byte 0 at start of each scanline
  const scanlineLength = 1 + width * 4;
  const rawData = Buffer.alloc(height * scanlineLength);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.42;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter None

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Base background #0b0f19
      let r = 11, g = 15, b = 25, a = 255;

      // Outer glow / accent circle or ring
      if (dist < radius) {
        // Gradient inner circle
        const t = (y / height);
        r = Math.round(16 + t * 5);
        g = Math.round(24 + t * 15);
        b = Math.round(40 + t * 25);

        // Center barbell / lightning design
        const barW = width * 0.38;
        const barH = height * 0.05;
        if (Math.abs(dx) < barW / 2 && Math.abs(dy) < barH / 2) {
          // Barbell bar: silver
          r = 226; g = 232; b = 240;
        }

        // Left / Right weight plates
        const plateW = width * 0.045;
        const plateH = height * 0.22;
        const plateX = width * 0.18;
        if ((Math.abs(dx - plateX) < plateW / 2 || Math.abs(dx + plateX) < plateW / 2) && Math.abs(dy) < plateH / 2) {
          // Neon Emerald Plate
          r = 16; g = 185; b = 129;
        }

        // Inner plate
        const innerPlateW = width * 0.03;
        const innerPlateH = height * 0.16;
        const innerPlateX = width * 0.23;
        if ((Math.abs(dx - innerPlateX) < innerPlateW / 2 || Math.abs(dx + innerPlateX) < innerPlateW / 2) && Math.abs(dy) < innerPlateH / 2) {
          r = 6; g = 182; b = 212; // Cyan
        }

        // Lightning bolt in center
        // Diagonal line segments
        const boltX = dx / (width * 0.15);
        const boltY = dy / (height * 0.25);
        if (boltY >= -1 && boltY <= 1) {
          const targetX = boltY * 0.4 - (boltY > 0 ? 0.15 : -0.15);
          if (Math.abs(boltX - targetX) < 0.3) {
            r = 16; g = 185; b = 129; // Emerald bolt
          }
        }
      }

      // Outer border ring
      if (Math.abs(dist - radius) < (width * 0.02)) {
        r = 16; g = 185; b = 129;
      }

      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const idatCompressed = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = makeChunk('IDAT', idatCompressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'icon-192.png'), generatePng(192, 192));
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), generatePng(512, 512));
fs.writeFileSync(path.join(publicDir, 'icon-maskable-512.png'), generatePng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generatePng(180, 180));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), generatePng(32, 32));

console.log('PWA Icons generated successfully!');

import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, '..', 'public');
const SOURCE = path.join(PUBLIC, 'launchericon-512x512.png');

const sizes = [192, 512];

for (const size of sizes) {
  await sharp(SOURCE)
    .resize(size, size, { fit: 'cover' })
    .png()
    .toFile(path.join(PUBLIC, `launchericon-${size}x${size}.png`));
  console.log(`✓ Generated launchericon-${size}x${size}.png`);
}

console.log('Done');

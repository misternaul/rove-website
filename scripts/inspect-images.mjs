import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const uploadedDir = 'C:\\Users\\mrhas\\.gemini\\antigravity\\brain\\d86c8bd5-4ccf-4418-94bd-99bc6ba109a9\\.user_uploaded';

const images = [
  { name: 'spec-black.jpg', file: 'media__1785347883659.jpg' },
  { name: 'brand-identity.jpg', file: 'media__1785347883678.jpg' },
  { name: 'editorial-wardrobe.jpg', file: 'media__1785347883694.jpg' },
  { name: 'editorial-rocks.jpg', file: 'media__1785347883778.jpg' },
  { name: 'spec-sand.jpg', file: 'media__1785347883796.jpg' }
];

const outDir = path.join(process.cwd(), 'public', 'images');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  for (const item of images) {
    const srcPath = path.join(uploadedDir, item.file);
    const metadata = await sharp(srcPath).metadata();
    console.log(`${item.name} (${item.file}): width = ${metadata.width}, height = ${metadata.height}`);
    
    // Copy original full images to public/images
    fs.copyFileSync(srcPath, path.join(outDir, item.name));
  }
}

run().catch(console.error);

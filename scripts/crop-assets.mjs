import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicImages = path.join(process.cwd(), 'public', 'images');
const specBlack = path.join(publicImages, 'spec-black.jpg');
const specSand = path.join(publicImages, 'spec-sand.jpg');
const brandId = path.join(publicImages, 'brand-identity.jpg');
const wardrobe = path.join(publicImages, 'editorial-wardrobe.jpg');

async function extract() {
  console.log('Starting asset extraction...');

  // 1. Logo mark & Favicon crops from brand-identity.jpg (682x1024)
  // Top-left logo box with text
  await sharp(brandId)
    .extract({ left: 15, top: 25, width: 195, height: 170 })
    .toFile(path.join(publicImages, 'logo-lockup.jpg'));
    
  // Icon only from central LOGO MARK header
  await sharp(brandId)
    .extract({ left: 225, top: 40, width: 180, height: 130 })
    .toFile(path.join(publicImages, 'logo-icon.jpg'));

  // Also save logo-icon as png for favicon use (or simple JPG icon)
  await sharp(brandId)
    .extract({ left: 225, top: 40, width: 180, height: 130 })
    .resize(128, 128, { fit: 'contain', background: { r: 13, g: 13, b: 13, alpha: 1 } })
    .toFormat('png')
    .toFile(path.join(process.cwd(), 'public', 'favicon.png'));

  // 2. Polo Front & Back crops from spec sheets (683x1024)
  // Jet Black Polo Front
  await sharp(specBlack)
    .extract({ left: 185, top: 25, width: 250, height: 335 })
    .toFile(path.join(publicImages, 'polo-black-front.jpg'));
    
  // Jet Black Polo Back
  await sharp(specBlack)
    .extract({ left: 430, top: 25, width: 240, height: 335 })
    .toFile(path.join(publicImages, 'polo-black-back.jpg'));

  // Sand Beige Polo Front
  await sharp(specSand)
    .extract({ left: 185, top: 25, width: 250, height: 335 })
    .toFile(path.join(publicImages, 'polo-sand-front.jpg'));

  // Sand Beige Polo Back
  await sharp(specSand)
    .extract({ left: 430, top: 25, width: 240, height: 335 })
    .toFile(path.join(publicImages, 'polo-sand-back.jpg'));

  // 3. Close up craft shots (row 1 & 2 of closeups)
  // Black Chest Logo embroidery
  await sharp(specBlack)
    .extract({ left: 8, top: 618, width: 130, height: 150 })
    .toFile(path.join(publicImages, 'detail-black-logo.jpg'));

  // Black Custom Button
  await sharp(specBlack)
    .extract({ left: 142, top: 618, width: 130, height: 150 })
    .toFile(path.join(publicImages, 'detail-black-button.jpg'));

  // Black Sleeve Line Signature (three gold lines)
  await sharp(specBlack)
    .extract({ left: 8, top: 772, width: 130, height: 145 })
    .toFile(path.join(publicImages, 'detail-black-sleeve.jpg'));

  // Sand Dune Texture closeup
  await sharp(specSand)
    .extract({ left: 540, top: 772, width: 134, height: 145 })
    .toFile(path.join(publicImages, 'detail-sand-texture.jpg'));

  // Sand Shoulder Piping
  await sharp(specSand)
    .extract({ left: 142, top: 772, width: 130, height: 145 })
    .toFile(path.join(publicImages, 'detail-sand-piping.jpg'));

  // Editorial Wardrobe Polo focus crop
  await sharp(wardrobe)
    .extract({ left: 290, top: 200, width: 460, height: 650 })
    .toFile(path.join(publicImages, 'editorial-polo-crop.jpg'));

  console.log('All crops completed successfully!');
}

extract().catch(console.error);

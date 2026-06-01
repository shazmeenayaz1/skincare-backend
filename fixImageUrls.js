/**
 * One-time fix: save full Cloudinary https URLs in MongoDB.
 * Run: node fixImageUrls.js
 */
import mongoose from 'mongoose';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Product from './Models/ProductSchema.js';
import Category from './Models/CategorySchema.js';
import Banner from './Models/BannerSchema.js';
import { normalizeImageUrl } from './utils/normalizeImageUrl.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eq = trimmed.indexOf('=');
      if (eq === -1) return;
      process.env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
    });
}

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected');

  let count = 0;

  for (const p of await Product.find()) {
    const img = normalizeImageUrl(p.main_image);
    const gallery = (p.gallery_images || []).map(normalizeImageUrl).filter(Boolean);
    if (img !== p.main_image || JSON.stringify(gallery) !== JSON.stringify(p.gallery_images)) {
      await Product.updateOne({ _id: p._id }, { main_image: img, gallery_images: gallery });
      count += 1;
    }
  }

  for (const c of await Category.find()) {
    const img = normalizeImageUrl(c.image);
    if (img && img !== c.image) {
      await Category.updateOne({ _id: c._id }, { image: img });
      count += 1;
    }
  }

  for (const b of await Banner.find()) {
    const img = normalizeImageUrl(b.image);
    if (img && img !== b.image) {
      await Banner.updateOne({ _id: b._id }, { image: img });
      count += 1;
    }
  }

  console.log(`Fixed ${count} image records.`);
  await mongoose.disconnect();
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

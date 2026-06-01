import mongoose from 'mongoose';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Product from './Models/ProductSchema.js';
import Category from './Models/CategorySchema.js';

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
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    });
}

const IMAGES = [
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1552046122-03184de85e08?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1608247764146-d738337521bd?auto=format&fit=crop&w=800&q=80',
];

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const koreanProducts = [
  { name: 'COSRX Low pH Good Morning Gel Cleanser', brand: 'COSRX', cat: 'Cleanser', price: 3200, discount: 2799, skin: ['Oily', 'Combination'], concerns: ['Acne', 'Oil Control'] },
  { name: 'Anua Heartleaf 77 Soothing Toner', brand: 'Anua', cat: 'Toner', price: 4200, discount: 3699, skin: ['Sensitive', 'Oily'], concerns: ['Redness', 'Acne'] },
  { name: 'Beauty of Joseon Relief Sun SPF50+', brand: 'Beauty of Joseon', cat: 'Sunscreen', price: 2800, discount: 2499, skin: ['All'], concerns: ['UV Protection', 'Dryness'] },
  { name: 'COSRX Advanced Snail 96 Mucin Essence', brand: 'COSRX', cat: 'Serum', price: 4500, discount: 3999, skin: ['Dry', 'Normal'], concerns: ['Hydration', 'Barrier Repair'], featured: true },
  { name: 'Laneige Water Sleeping Mask', brand: 'Laneige', cat: 'Night', price: 5200, discount: 4599, skin: ['Dry', 'Dehydrated'], concerns: ['Hydration'] },
  { name: 'Innisfree Green Tea Seed Serum', brand: 'Innisfree', cat: 'Serum', price: 3800, discount: 3299, skin: ['Combination', 'Normal'], concerns: ['Hydration', 'Dullness'] },
  { name: 'Medicube Zero Pore Pad 2.0', brand: 'Medicube', cat: 'Toner', price: 4800, discount: 4199, skin: ['Oily', 'Combination'], concerns: ['Pores', 'Texture'] },
  { name: 'Skin1004 Madagascar Centella Ampoule', brand: 'Skin1004', cat: 'Serum', price: 3600, discount: 3199, skin: ['Sensitive', 'All'], concerns: ['Soothing', 'Redness'] },
  { name: 'Round Lab 1025 Dokdo Cleanser', brand: 'Round Lab', cat: 'Cleanser', price: 2900, discount: 2599, skin: ['Sensitive', 'Dry'], concerns: ['Hydration'] },
  { name: 'Torriden Dive-In Low Molecule Serum', brand: 'Torriden', cat: 'Serum', price: 4100, discount: 3699, skin: ['Dry', 'Dehydrated'], concerns: ['Hydration'], featured: true },
  { name: 'Klairs Supple Preparation Unscented Toner', brand: 'Klairs', cat: 'Toner', price: 3400, discount: 2999, skin: ['Sensitive', 'Dry'], concerns: ['Hydration'] },
  { name: 'Missha Time Revolution Night Repair Ampoule', brand: 'Missha', cat: 'Serum', price: 5500, discount: 4899, skin: ['Mature', 'Dry'], concerns: ['Anti-Aging', 'Firmness'] },
  { name: 'Dr. Jart+ Cicapair Tiger Grass Color Correcting', brand: 'Dr. Jart+', cat: 'Moisturizer', price: 6200, discount: 5499, skin: ['Sensitive', 'Red'], concerns: ['Redness', 'Tone'] },
  { name: 'Sulwhasoo First Care Activating Serum', brand: 'Sulwhasoo', cat: 'Serum', price: 12500, discount: 10999, skin: ['Mature', 'Dry'], concerns: ['Anti-Aging', 'Radiance'], featured: true },
  { name: 'Pyunkang Yul Essence Toner', brand: 'Pyunkang Yul', cat: 'Toner', price: 3100, discount: 2799, skin: ['Sensitive', 'Dry'], concerns: ['Barrier Repair'] },
  { name: 'Banila Co Clean It Zero Cleansing Balm', brand: 'Banila Co', cat: 'Cleanser', price: 3500, discount: 3099, skin: ['All'], concerns: ['Makeup Removal'] },
  { name: 'Goodal Green Tangerine Vita C Serum', brand: 'Goodal', cat: 'Serum', price: 4400, discount: 3899, skin: ['Dull', 'Combination'], concerns: ['Dark Spots', 'Brightening'] },
  { name: 'Isntree Hyaluronic Acid Water Essence', brand: 'Isntree', cat: 'Serum', price: 3300, discount: 2899, skin: ['Dry', 'Dehydrated'], concerns: ['Hydration'] },
  { name: 'Haruharu Wonder Black Rice Probiotic Serum', brand: 'Haruharu Wonder', cat: 'Serum', price: 3900, discount: 3499, skin: ['Sensitive', 'Dry'], concerns: ['Barrier Repair', 'Glow'] },
  { name: 'COSRX BHA Blackhead Power Liquid', brand: 'COSRX', cat: 'Exfoliator', price: 3700, discount: 3299, skin: ['Oily', 'Combination'], concerns: ['Blackheads', 'Pores'] },
  { name: 'Anua Peach 70 Niacin Serum', brand: 'Anua', cat: 'Serum', price: 4300, discount: 3799, skin: ['Combination', 'Dull'], concerns: ['Pores', 'Brightening'], featured: true },
  { name: 'Beauty of Joseon Glow Serum Propolis+Niacin', brand: 'Beauty of Joseon', cat: 'Serum', price: 3000, discount: 2699, skin: ['Dull', 'Dry'], concerns: ['Glow', 'Dark Spots'] },
  { name: 'Laneige Lip Sleeping Mask Berry', brand: 'Laneige', cat: 'Lip', price: 3400, discount: 2999, skin: ['All'], concerns: ['Dry Lips'] },
  { name: 'Etude SoonJung 2x Barrier Intensive Cream', brand: 'Etude', cat: 'Moisturizer', price: 3600, discount: 3199, skin: ['Sensitive', 'Dry'], concerns: ['Barrier Repair'] },
  { name: 'Innisfree Super Volcanic Pore Clay Mask', brand: 'Innisfree', cat: 'Mask', price: 2700, discount: 2399, skin: ['Oily', 'Combination'], concerns: ['Pores', 'Oil Control'] },
  { name: 'COSRX Master Patch Original Fit', brand: 'COSRX', cat: 'Acne', price: 1200, discount: 999, skin: ['Oily', 'Acne-prone'], concerns: ['Acne'] },
  { name: 'Numbuzin No.3 Skin Softening Serum', brand: 'Numbuzin', cat: 'Serum', price: 4600, discount: 4099, skin: ['Rough', 'Dull'], concerns: ['Texture', 'Glow'] },
  { name: 'SKINFOOD Carrot Carotene Calming Water Pad', brand: 'SKINFOOD', cat: 'Toner', price: 3200, discount: 2799, skin: ['Sensitive', 'Dry'], concerns: ['Soothing'] },
  { name: 'The Face Shop Rice & Ceramide Moisturizer', brand: 'The Face Shop', cat: 'Moisturizer', price: 2500, discount: 2199, skin: ['Dry', 'Normal'], concerns: ['Hydration'] },
  { name: 'Holika Holika Good Cera Super Cream', brand: 'Holika Holika', cat: 'Moisturizer', price: 2900, discount: 2599, skin: ['Dry', 'Sensitive'], concerns: ['Barrier Repair'] },
  { name: 'Celimax Derma Nature Relief Madecica Cream', brand: 'Celimax', cat: 'Moisturizer', price: 3400, discount: 2999, skin: ['Sensitive', 'Acne-prone'], concerns: ['Soothing', 'Redness'] },
  { name: 'AXIS-Y Dark Spot Correcting Glow Serum', brand: 'AXIS-Y', cat: 'Serum', price: 3800, discount: 3399, skin: ['Combination', 'Dull'], concerns: ['Dark Spots', 'Hyperpigmentation'] },
  { name: 'Purito Centella Unscented Serum', brand: 'Purito', cat: 'Serum', price: 3100, discount: 2799, skin: ['Sensitive', 'All'], concerns: ['Soothing', 'Redness'] },
  { name: 'Some By Mi AHA BHA PHA 30 Days Miracle Toner', brand: 'Some By Mi', cat: 'Toner', price: 2800, discount: 2499, skin: ['Oily', 'Acne-prone'], concerns: ['Acne', 'Texture'] },
  { name: 'COSRX Full Fit Propolis Light Cream', brand: 'COSRX', cat: 'Moisturizer', price: 3600, discount: 3199, skin: ['Dry', 'Dull'], concerns: ['Glow', 'Hydration'] },
  { name: 'Beauty of Joseon Dynasty Cream', brand: 'Beauty of Joseon', cat: 'Moisturizer', price: 4200, discount: 3799, skin: ['Dry', 'Mature'], concerns: ['Anti-Aging', 'Firmness'] },
  { name: 'Dr. G Red Blemish Clear Soothing Cream', brand: 'Dr. G', cat: 'Moisturizer', price: 3900, discount: 3499, skin: ['Oily', 'Acne-prone'], concerns: ['Acne', 'Redness'] },
  { name: 'Laneige Cream Skin Refill Toner', brand: 'Laneige', cat: 'Toner', price: 4800, discount: 4299, skin: ['Dry', 'Dehydrated'], concerns: ['Hydration'], featured: true },
  { name: 'Innisfree No Sebum Mineral Powder', brand: 'Innisfree', cat: 'Moisturizer', price: 1800, discount: 1599, skin: ['Oily', 'Combination'], concerns: ['Oil Control'] },
  { name: 'Missha All Around Safe Block Essence SPF50', brand: 'Missha', cat: 'Sunscreen', price: 2600, discount: 2299, skin: ['All'], concerns: ['UV Protection'] },
  { name: 'Round Lab Birch Juice Moisturizing Sunscreen', brand: 'Round Lab', cat: 'Sunscreen', price: 3400, discount: 2999, skin: ['Sensitive', 'Dry'], concerns: ['UV Protection', 'Hydration'] },
  { name: 'Torriden Balanceful Cica Cream', brand: 'Torriden', cat: 'Moisturizer', price: 3700, discount: 3299, skin: ['Sensitive', 'Combination'], concerns: ['Soothing', 'Barrier Repair'] },
  { name: 'Anua Heartleaf Pore Control Cleansing Oil', brand: 'Anua', cat: 'Cleanser', price: 4000, discount: 3599, skin: ['Oily', 'Combination'], concerns: ['Pores', 'Makeup Removal'] },
  { name: 'COSRX Hydrium Triple Hyaluronic Moisturizer', brand: 'COSRX', cat: 'Moisturizer', price: 3500, discount: 3099, skin: ['Dry', 'Dehydrated'], concerns: ['Hydration'] },
  { name: 'Medicube Deep Vita C Capsule Cream', brand: 'Medicube', cat: 'Moisturizer', price: 5100, discount: 4599, skin: ['Dull', 'Uneven'], concerns: ['Dark Spots', 'Brightening'] },
  { name: 'Skin1004 Hyalu-Cica Water-Fit Sun Serum SPF50', brand: 'Skin1004', cat: 'Sunscreen', price: 3200, discount: 2899, skin: ['Oily', 'Sensitive'], concerns: ['UV Protection', 'Soothing'] },
  { name: 'Klairs Rich Moist Soothing Cream', brand: 'Klairs', cat: 'Moisturizer', price: 3300, discount: 2999, skin: ['Dry', 'Sensitive'], concerns: ['Hydration'] },
  { name: 'Benton Snail Bee High Content Essence', brand: 'Benton', cat: 'Serum', price: 2900, discount: 2599, skin: ['Combination', 'Acne-prone'], concerns: ['Acne', 'Texture'] },
  { name: "I'm From Mugwort Mask", brand: "I'm From", cat: 'Mask', price: 3600, discount: 3199, skin: ['Sensitive', 'Irritated'], concerns: ['Soothing', 'Cooling'] },
  { name: 'COSRX Ultimate Nourishing Rice Spa Mask', brand: 'COSRX', cat: 'Mask', price: 2700, discount: 2399, skin: ['Dry', 'Dull'], concerns: ['Brightening', 'Hydration'] },
  { name: 'Beauty of Joseon Revive Eye Serum Ginseng+Retinal', brand: 'Beauty of Joseon', cat: 'Eye', price: 3100, discount: 2799, skin: ['Mature', 'All'], concerns: ['Fine Lines', 'Dark Circles'] },
  { name: 'Laneige Water Bank Blue Hyaluronic Eye Cream', brand: 'Laneige', cat: 'Eye', price: 4500, discount: 3999, skin: ['Dry', 'Dehydrated'], concerns: ['Hydration', 'Fine Lines'] },
  { name: 'Innisfree Green Tea Seed Hyaluronic Sheet Mask', brand: 'Innisfree', cat: 'Sheet', price: 450, discount: 399, skin: ['All'], concerns: ['Hydration'] },
  { name: 'Dr. Jart+ Cryo Rubber Mask Brightening', brand: 'Dr. Jart+', cat: 'Sheet', price: 1800, discount: 1599, skin: ['Dull', 'Tired'], concerns: ['Brightening', 'Cooling'] },
  { name: 'Tirtir Milk Skin Toner Light', brand: 'TIRTIR', cat: 'Toner', price: 3900, discount: 3499, skin: ['Dry', 'Dull'], concerns: ['Glow', 'Hydration'], featured: true },
];

const findCategory = (categories, keyword) => {
  const map = {
    Cleanser: 'Cleansers',
    Toner: 'Toners',
    Serum: 'Serums',
    Moisturizer: 'Moisturizers',
    Sunscreen: 'Sunscreens',
    Eye: 'Eye Creams',
    Mask: 'Face Masks',
    Sheet: 'Sheet Masks',
    Night: 'Night Creams',
    Lip: 'Lip Care',
    Acne: 'Acne Treatments',
    Exfoliator: 'Exfoliators',
  };
  const target = map[keyword] || keyword;
  const found = categories.find(
    (c) => c.name.toLowerCase() === target.toLowerCase() || c.name.toLowerCase().includes(keyword.toLowerCase())
  );
  return found?._id || categories[0]._id;
};

const seedKoreanProducts = async () => {
  try {
    const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skincare_db';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const categories = await Category.find();
    if (categories.length === 0) {
      console.log('No categories found. Run: node seedCategories.js');
      process.exit(1);
    }

    const existingSkus = new Set(
      (await Product.find({ sku: /^KR-GLOW-/ }, { sku: 1 })).map((p) => p.sku)
    );

    const productsToSeed = koreanProducts.slice(0, 50);

    const docs = productsToSeed.map((p, index) => {
      const num = String(index + 1).padStart(3, '0');
      const sku = `KR-GLOW-${num}`;
      const slug = slugify(`${p.brand}-${p.name}`);
      return {
        name: p.name,
        slug: existingSkus.has(sku) ? `${slug}-${num}` : slug,
        sku,
        category_id: findCategory(categories, p.cat),
        price: p.price,
        discount_price: p.discount,
        stock_quantity: 20 + (index % 80),
        brand: p.brand,
        short_description: `Premium K-Beauty by ${p.brand}`,
        description: `${p.name} is a bestselling Korean skincare formula designed for visible results. Lightweight texture, dermatologist-loved ingredients, and suitable for daily use in humid climates like Pakistan.`,
        benefits: `Targets ${p.concerns.join(', ')}. Supports healthy, glowing skin with consistent use.`,
        ingredients: 'Water, Glycerin, Niacinamide, Centella Asiatica Extract, Hyaluronic Acid, Panthenol (varies by formula)',
        how_to_use: 'Apply to clean skin. Pat gently until absorbed. Use AM and/or PM as directed. Follow with moisturizer and SPF in daytime.',
        skin_type: p.skin,
        concerns: p.concerns,
        main_image: IMAGES[index % IMAGES.length],
        gallery_images: [],
        status: 'active',
        is_featured: p.featured || index % 7 === 0,
      };
    });

    const toInsert = docs.filter((d) => !existingSkus.has(d.sku));
    if (toInsert.length === 0) {
      console.log('All 50 Korean products already exist (KR-GLOW-* SKUs).');
      await mongoose.disconnect();
      return;
    }

    await Product.insertMany(toInsert, { ordered: false });
    console.log(`Successfully added ${toInsert.length} Korean products!`);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedKoreanProducts();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './Models/ProductSchema.js';
import Category from './Models/CategorySchema.js';

dotenv.config();

const seedProducts = async () => {
  try {
    const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skincare_db';
    await mongoose.connect(MONGODB_URI, { family: 4 });
    console.log('Connected to MongoDB for product seeding');

    // Fetch categories to link products
    const categories = await Category.find();
    if (categories.length === 0) {
      console.log('No categories found. Please seed categories first.');
      process.exit(1);
    }

    const getCategoryId = (name) => {
      const cat = categories.find(c => c.name.toLowerCase().includes(name.toLowerCase()));
      return cat ? cat._id : categories[0]._id;
    };

    const products = [
      {
        name: 'Medicube Zero Pore Pad 2.0',
        slug: 'medicube-zero-pore-pad-2-0',
        description: 'Clinically proven to tighten pores and remove dead skin cells for a smooth complexion. Features dual-textured pads for gentle exfoliation and pore tightening.',
        short_description: 'Dual-textured toning pads for pore tightening and exfoliation.',
        price: 28.00,
        stock_quantity: 50,
        sku: 'MED-001',
        category_id: getCategoryId('Cleansers'),
        brand: 'Medicube',
        skin_type: ['All', 'Oily'],
        concerns: ['Pores', 'Texture'],
        main_image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80',
        status: 'active',
        is_featured: true
      },
      {
        name: 'Celimax Dual Barrier Cream',
        slug: 'celimax-dual-barrier-cream',
        description: 'Deeply hydrates and strengthens the skin barrier with 5 types of Ceramide. Perfect for sensitive and dry skin types.',
        short_description: 'Intense moisture barrier cream for sensitive skin.',
        price: 24.00,
        stock_quantity: 40,
        sku: 'CEL-001',
        category_id: getCategoryId('Moisturizers'),
        brand: 'Celimax',
        skin_type: ['Dry', 'Sensitive'],
        concerns: ['Dryness', 'Barrier Repair'],
        main_image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
        status: 'active'
      },
      {
        name: 'COSRX Advanced Snail 96 Mucin Power Essence',
        slug: 'cosrx-snail-mucin-essence',
        description: 'A lightweight essence which absorbs into the skin fast and gives skin a natural glow from inside. Formulated with 96% Snail Secretion Filtrate.',
        short_description: 'Nourishing and hydrating essence with snail mucin.',
        price: 25.00,
        stock_quantity: 100,
        sku: 'COS-001',
        category_id: getCategoryId('Serums'),
        brand: 'COSRX',
        skin_type: ['All'],
        concerns: ['Hydration', 'Repair'],
        main_image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80',
        status: 'active',
        is_featured: true
      },
      {
        name: 'Anua Heartleaf 77% Soothing Toner',
        slug: 'anua-heartleaf-toner',
        description: 'Perfectly formulated to soothe, tone, and hydrate the skin. Contains 77% Heartleaf extract grown in Korea.',
        short_description: 'Calming and hydrating toner for irritated skin.',
        price: 22.00,
        stock_quantity: 60,
        sku: 'ANU-001',
        category_id: getCategoryId('Toners'),
        brand: 'Anua',
        skin_type: ['All', 'Sensitive'],
        concerns: ['Redness', 'Irritation'],
        main_image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80',
        status: 'active'
      },
      {
        name: 'Beauty of Joseon Relief Sun: Rice + Probiotics',
        slug: 'boj-relief-sun-rice',
        description: 'A lightweight and creamy type organic sunscreen that\'s comfortable on skin. Containing 30% rice extract and grain fermented extracts.',
        short_description: 'Daily sunscreen with rice and probiotics.',
        price: 18.00,
        stock_quantity: 150,
        sku: 'BOJ-001',
        category_id: getCategoryId('Sunscreens'),
        brand: 'Beauty of Joseon',
        skin_type: ['All'],
        concerns: ['UV Protection', 'Brightening'],
        main_image: 'https://images.unsplash.com/photo-1552046122-03184de85e08?auto=format&fit=crop&w=800&q=80',
        status: 'active',
        is_featured: true
      },
      {
        name: 'Round Lab Birch Juice Moisturizing Sunscreen',
        slug: 'round-lab-birch-juice-sun',
        description: 'Moisturizing sunscreen with Birch Juice and Hyaluronic Acid that hydrates skin while protecting from UV rays.',
        short_description: 'Hydrating sunscreen with Birch Sap.',
        price: 21.00,
        stock_quantity: 80,
        sku: 'RLB-001',
        category_id: getCategoryId('Sunscreens'),
        brand: 'Round Lab',
        skin_type: ['Dry', 'All'],
        concerns: ['Dryness', 'UV Protection'],
        main_image: 'https://images.unsplash.com/photo-1594125355938-f96e19198692?auto=format&fit=crop&w=800&q=80',
        status: 'active'
      },
      {
        name: 'Laneige Lip Sleeping Mask Berry',
        slug: 'laneige-lip-sleeping-mask',
        description: 'A leave-on lip mask that soothes and moisturizes for smoother, more supple lips overnight.',
        short_description: 'Overnight nourishing lip treatment.',
        price: 24.00,
        stock_quantity: 200,
        sku: 'LAN-001',
        category_id: getCategoryId('Lip Care'),
        brand: 'Laneige',
        skin_type: ['All'],
        concerns: ['Dry Lips'],
        main_image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=800&q=80',
        status: 'active'
      },
      {
        name: 'Skin1004 Madagascar Centella Ampoule',
        slug: 'skin1004-centella-ampoule',
        description: 'Made with 100% Centella Asiatica Extract to repair damaged skin and soothe sensitive skin.',
        short_description: 'Pure centella ampoule for calming skin.',
        price: 19.00,
        stock_quantity: 75,
        sku: 'SKN-001',
        category_id: getCategoryId('Serums'),
        brand: 'Skin1004',
        skin_type: ['Sensitive', 'All'],
        concerns: ['Redness', 'Repair'],
        main_image: 'https://images.unsplash.com/photo-1608247764146-d738337521bd?auto=format&fit=crop&w=800&q=80',
        status: 'active'
      },
      {
        name: 'Axis-Y Dark Spot Correcting Glow Serum',
        slug: 'axis-y-glow-serum',
        description: 'A Niacinamide based serum that corrects dark spots and improves uneven skin tone.',
        short_description: 'Brightening serum for dark spots.',
        price: 17.00,
        stock_quantity: 90,
        sku: 'AXY-001',
        category_id: getCategoryId('Serums'),
        brand: 'Axis-Y',
        skin_type: ['All'],
        concerns: ['Dark Spots', 'Brightening'],
        main_image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80',
        status: 'active'
      },
      {
        name: 'Medicube Deep Vita C Ampoule',
        slug: 'medicube-vita-c-ampoule',
        description: 'Concentrated Vitamin C ampoule that targets pigmentation and brightens the complexion in just 7 days.',
        short_description: 'Intensive vitamin C brightening treatment.',
        price: 35.00,
        stock_quantity: 30,
        sku: 'MED-002',
        category_id: getCategoryId('Serums'),
        brand: 'Medicube',
        skin_type: ['Dull', 'All'],
        concerns: ['Pigmentation', 'Dullness'],
        main_image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=800&q=80',
        status: 'active'
      },
      {
        name: 'Celimax The Real Noni Glow Oil',
        slug: 'celimax-noni-oil',
        description: 'A lightweight facial oil enriched with Noni Fruit Extract to nourish and revitalize the skin.',
        short_description: 'Nutrient-rich facial oil for a healthy glow.',
        price: 26.00,
        stock_quantity: 25,
        sku: 'CEL-002',
        category_id: getCategoryId('Face Oils'),
        brand: 'Celimax',
        skin_type: ['Dry', 'Combination'],
        concerns: ['Anti-Aging', 'Glow'],
        main_image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
        status: 'active'
      },
      {
        name: 'Innisfree Green Tea Seed Serum',
        slug: 'innisfree-green-tea-serum',
        description: 'A moisturizing serum enriched with organic Jeju Green Tea and Green Tea seeds for deep hydration.',
        short_description: 'Hydrating serum from Jeju Island.',
        price: 27.00,
        stock_quantity: 85,
        sku: 'INN-001',
        category_id: getCategoryId('Serums'),
        brand: 'Innisfree',
        skin_type: ['All', 'Dry'],
        concerns: ['Hydration'],
        main_image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80',
        status: 'active'
      },
      {
        name: 'COSRX Low pH Good Morning Gel Cleanser',
        slug: 'cosrx-gel-cleanser',
        description: 'A super gentle cleanser that\'s great for your morning wash, this low pH formula doesn\'t strip your skin of its natural oils.',
        short_description: 'Gentle low pH daily cleanser.',
        price: 12.00,
        stock_quantity: 120,
        sku: 'COS-002',
        category_id: getCategoryId('Cleansers'),
        brand: 'COSRX',
        skin_type: ['All', 'Sensitive'],
        concerns: ['Gentle Cleansing'],
        main_image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=800&q=80',
        status: 'active'
      },
      {
        name: 'Beauty of Joseon Dynasty Cream',
        slug: 'boj-dynasty-cream',
        description: 'A multi-functional cream containing rice bran water, ginseng water, squalane, and niacinamide for hydration and radiance.',
        short_description: 'Classic luxury cream for radiant skin.',
        price: 24.00,
        stock_quantity: 45,
        sku: 'BOJ-002',
        category_id: getCategoryId('Moisturizers'),
        brand: 'Beauty of Joseon',
        skin_type: ['All', 'Dry'],
        concerns: ['Radiance', 'Anti-Aging'],
        main_image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80',
        status: 'active'
      },
      {
        name: 'Medicube Blue Erasing Cream',
        slug: 'medicube-blue-cream',
        description: 'A deep moisturizing cream that provides 24-hour hydration and helps soothe sensitive skin.',
        short_description: 'Intense 24-hour moisturizing cream.',
        price: 29.00,
        stock_quantity: 40,
        sku: 'MED-003',
        category_id: getCategoryId('Moisturizers'),
        brand: 'Medicube',
        skin_type: ['Sensitive', 'Dry'],
        concerns: ['Dryness', 'Soothing'],
        main_image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=800&q=80',
        status: 'active'
      }
    ];

    // Clear existing products
    await Product.deleteMany({});
    console.log('Deleted existing products');

    // Insert new products
    await Product.insertMany(products);
    console.log('Successfully seeded 15 high-quality products!');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();

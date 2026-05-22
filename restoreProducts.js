import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './Models/ProductSchema.js';
import Category from './Models/CategorySchema.js';

dotenv.config();

const restoreProducts = async () => {
  try {
    const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skincare_db';
    await mongoose.connect(MONGODB_URI, { family: 4 });
    console.log('Connected to MongoDB');

    await Product.deleteMany({}); // Clear old ones

    const categories = await Category.find();
    const findCat = (name) => categories.find(c => c.name.includes(name))?._id || categories[0]?._id;

    const products = [
      {
        name: "Medicube Zero Pore Pad 2.0",
        slug: "medicube-zero-pore-pad-2-0",
        sku: "MED-ZPP-01",
        category_id: findCat('Toner'),
        price: 4500,
        discount_price: 3850,
        stock_quantity: 50,
        brand: "Medicube",
        description: "Clinically proven to tighten pores and remove dead skin cells.",
        main_image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
        is_featured: true,
        status: 'active'
      },
      {
        name: "Celimax Dual Barrier Cream",
        slug: "celimax-dual-barrier-cream",
        sku: "CEL-DBC-01",
        category_id: findCat('Moisturizer'),
        price: 3200,
        discount_price: 2950,
        stock_quantity: 35,
        brand: "Celimax",
        description: "Intense hydration for compromised skin barriers.",
        main_image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
        is_featured: true,
        status: 'active'
      },
      {
        name: "COSRX Snail Mucin Essence",
        slug: "cosrx-snail-mucin-essence",
        sku: "COS-SME-01",
        category_id: findCat('Serum'),
        price: 2800,
        discount_price: 2400,
        stock_quantity: 100,
        brand: "COSRX",
        description: "The viral snail mucin for ultimate glow and hydration.",
        main_image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80",
        is_featured: true,
        status: 'active'
      },
      {
        name: "Anua Heartleaf 77% Soothing Toner",
        slug: "anua-heartleaf-77-soothing-toner",
        sku: "ANU-HT-01",
        category_id: findCat('Toner'),
        price: 3800,
        discount_price: 3400,
        stock_quantity: 40,
        brand: "Anua",
        description: "Perfectly soothing toner for sensitive and acne-prone skin.",
        main_image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
        is_featured: true,
        status: 'active'
      },
      {
        name: "Beauty of Joseon Relief Sun",
        slug: "beauty-of-joseon-relief-sun",
        sku: "BOJ-RS-01",
        category_id: findCat('Sunscreen'),
        price: 2600,
        discount_price: 2200,
        stock_quantity: 80,
        brand: "Beauty of Joseon",
        description: "Rice + Probiotics sunscreen that feels like a moisturizer.",
        main_image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80",
        is_featured: true,
        status: 'active'
      },
      {
        name: "L'Oréal Glycolic Serum",
        slug: "loreal-glycolic-serum",
        sku: "LOR-GLY-01",
        category_id: findCat('Serum'),
        price: 1800,
        discount_price: 900,
        stock_quantity: 60,
        brand: "L'Oréal",
        description: "Anti-dark spot serum for even skin tone.",
        main_image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
        is_featured: true,
        status: 'active'
      },
      {
        name: "Axis-Y Glow Serum",
        slug: "axis-y-glow-serum",
        sku: "AXI-GLO-01",
        category_id: findCat('Serum'),
        price: 4500,
        discount_price: 3950,
        stock_quantity: 45,
        brand: "Axis-Y",
        description: "Niacinamide-based serum for correcting dark spots.",
        main_image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80",
        is_featured: true,
        status: 'active'
      },
      {
        name: "Vaseline Gluta-HYA Lotion",
        slug: "vaseline-gluta-hya-lotion",
        sku: "VAS-GHY-01",
        category_id: findCat('Body Lotion'),
        price: 3400,
        discount_price: 2800,
        stock_quantity: 70,
        brand: "Vaseline",
        description: "Dewy radiance gluta-hya lotion for body glow.",
        main_image: "https://images.unsplash.com/photo-1552046122-03184de85e08?auto=format&fit=crop&w=800&q=80",
        is_featured: true,
        status: 'active'
      }
    ];

    await Product.insertMany(products);
    console.log(`Successfully restored ${products.length} products!`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error restoring products:', error);
    process.exit(1);
  }
};

restoreProducts();

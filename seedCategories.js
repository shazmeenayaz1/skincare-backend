import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './Models/CategorySchema.js';

dotenv.config();

const categories = [
  { name: 'Cleansers', description: 'Gentle and effective face washes', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80' },
  { name: 'Toners', description: 'Balance and refresh your skin', image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80' },
  { name: 'Moisturizers', description: 'Hydrate and protect', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80' },
  { name: 'Serums', description: 'Concentrated treatments for specific concerns', image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80' },
  { name: 'Sunscreens', description: 'Essential UV protection', image: 'https://images.unsplash.com/photo-1552046122-03184de85e08?auto=format&fit=crop&w=800&q=80' },
  { name: 'Eye Creams', description: 'Care for the delicate eye area', image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=800&q=80' },
  { name: 'Face Masks', description: 'Weekly treatments for glowing skin', image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=800&q=80' },
  { name: 'Exfoliators', description: 'Remove dead skin cells for brightness', image: 'https://images.unsplash.com/photo-1590156546946-ce55a12a63ee?auto=format&fit=crop&w=800&q=80' },
  { name: 'Lip Care', description: 'Soft and hydrated lips', image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=800&q=80' },
  { name: 'Body Lotions', description: 'Full body hydration', image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80' },
  { name: 'Hand Creams', description: 'Protect and soften your hands', image: 'https://images.unsplash.com/photo-1611082216935-7c090bf5d7ec?auto=format&fit=crop&w=800&q=80' },
  { name: 'Foot Care', description: 'Revitalize tired feet', image: 'https://images.unsplash.com/photo-1519415387722-a1c3bbff71ca?auto=format&fit=crop&w=800&q=80' },
  { name: 'Anti-Aging', description: 'Youthful skin treatments', image: 'https://images.unsplash.com/photo-1594125355938-f96e19198692?auto=format&fit=crop&w=800&q=80' },
  { name: 'Acne Treatments', description: 'Targeted solutions for breakouts', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80' },
  { name: 'Face Oils', description: 'Nourishing botanical oils', image: 'https://images.unsplash.com/photo-1608247764146-d738337521bd?auto=format&fit=crop&w=800&q=80' },
  { name: 'Sheet Masks', description: 'Quick hydration boosts', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80' },
  { name: 'Night Creams', description: 'Overnight repair and renewal', image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80' },
  { name: 'Day Creams', description: 'Lightweight daytime protection', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80' },
  { name: 'Neck Creams', description: 'Firming care for neck and chest', image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=800&q=80' },
  { name: 'Shaving Creams', description: 'Smooth and comfortable shave', image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80' },
  { name: 'Aftershave', description: 'Soothe skin after shaving', image: 'https://images.unsplash.com/photo-1624330186713-99429a17aa63?auto=format&fit=crop&w=800&q=80' },
  { name: 'Beard Oils', description: 'Nourish and style your beard', image: 'https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?auto=format&fit=crop&w=800&q=80' },
  { name: 'Bath Salts', description: 'Relaxing and detoxifying bath', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80' },
  { name: 'Body Scrubs', description: 'Smooth skin from head to toe', image: 'https://images.unsplash.com/photo-1591130901023-ec6416042127?auto=format&fit=crop&w=800&q=80' },
  { name: 'Massage Oils', description: 'Therapeutic and relaxing oils', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80' }
];

const seedDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skincare_db';
    await mongoose.connect(MONGODB_URI, { family: 4 });
    console.log('Connected to MongoDB for seeding');

    await Category.deleteMany({});
    console.log('Deleted existing categories');

    await Category.insertMany(categories);
    console.log('Successfully seeded 25 categories with accurate images!');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();

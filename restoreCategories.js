import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './Models/CategorySchema.js';

dotenv.config();

const seedCategories = async () => {
  try {
    const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skincare_db';
    await mongoose.connect(MONGODB_URI, { family: 4 });
    console.log('Connected to MongoDB');

    await Category.deleteMany({}); // Clear old ones

    const categories = [
      { name: 'Cleansers', description: 'Gentle facial cleansers', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80' },
      { name: 'Toners', description: 'Refreshing facial toners', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80' },
      { name: 'Moisturizers', description: 'Hydrating face creams', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80' },
      { name: 'Serums', description: 'Potent treatment serums', image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80' },
      { name: 'Sunscreens', description: 'Daily UV protection', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80' },
      { name: 'Eye Creams', description: 'Targeted eye care', image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=800&q=80' },
      { name: 'Face Masks', description: 'Deep cleaning masks', image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=800&q=80' },
      { name: 'Exfoliators', description: 'Gentle skin peeling', image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80' },
      { name: 'Lip Care', description: 'Hydrating lip balms', image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=800&q=80' },
      { name: 'Body Lotions', description: 'Full body hydration', image: 'https://images.unsplash.com/photo-1552046122-03184de85e08?auto=format&fit=crop&w=800&q=80' },
      { name: 'Hand Creams', description: 'Nourishing hand care', image: 'https://images.unsplash.com/photo-1611082216935-7c090bf5d7ec?auto=format&fit=crop&w=800&q=80' },
      { name: 'Foot Care', description: 'Soothing foot treatments', image: 'https://images.unsplash.com/photo-1519415510236-8559119946b7?auto=format&fit=crop&w=800&q=80' },
      { name: 'Anti-Aging', description: 'Youth restoring products', image: 'https://images.unsplash.com/photo-1551243500-683a4964fb4c?auto=format&fit=crop&w=800&q=80' },
      { name: 'Acne Treatments', description: 'Blemish control', image: 'https://images.unsplash.com/photo-1621151634882-c4d7455bc5ee?auto=format&fit=crop&w=800&q=80' },
      { name: 'Face Oils', description: 'Nourishing facial oils', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80' }
    ];

    await Category.insertMany(categories);
    console.log(`Successfully seeded ${categories.length} categories!`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './Models/CategorySchema.js';
import Product from './Models/ProductSchema.js';

dotenv.config();

const deleteBrokenItems = async () => {
  try {
    const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skincare_db';
    await mongoose.connect(MONGODB_URI, { family: 4 });
    console.log('Connected to MongoDB');

    const brokenCategories = [
      'Hand Creams',
      'Foot Care',
      'Anti-Aging',
      'Sheet Masks',
      'Neck Creams',
      'Shaving Creams',
      'Beard Oils',
      'Bath Salts',
      'Body Scrubs',
      'Massage Oils'
    ];

    const result = await Category.deleteMany({ name: { $in: brokenCategories } });
    console.log(`Deleted ${result.deletedCount} broken categories from DB`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error during deletion:', error);
    process.exit(1);
  }
};

deleteBrokenItems();

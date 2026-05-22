import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './Models/CategorySchema.js';
import Product from './Models/ProductSchema.js';

dotenv.config();

const cleanupDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skincare_db';
    await mongoose.connect(MONGODB_URI, { family: 4 });
    console.log('Connected to MongoDB for cleanup');

    // Delete categories without valid external images
    const categoryResult = await Category.deleteMany({
      $or: [
        { image: { $exists: false } },
        { image: "" },
        { image: { $not: /^http/ } }
      ]
    });
    console.log(`Deleted ${categoryResult.deletedCount} categories with invalid images`);

    // Delete products without valid external images
    const productResult = await Product.deleteMany({
      $or: [
        { main_image: { $exists: false } },
        { main_image: "" },
        { main_image: { $not: /^http/ } }
      ]
    });
    console.log(`Deleted ${productResult.deletedCount} products with invalid images`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
};

cleanupDB();

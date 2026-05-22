import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './Models/ProductSchema.js';

dotenv.config();

const deleteAllProducts = async () => {
  try {
    const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skincare_db';
    await mongoose.connect(MONGODB_URI, { family: 4 });
    console.log('Connected to MongoDB');

    const result = await Product.deleteMany({});
    console.log(`Deleted ${result.deletedCount} products from DB`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error during deletion:', error);
    process.exit(1);
  }
};

deleteAllProducts();

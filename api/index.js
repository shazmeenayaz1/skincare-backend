import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from '../app.js';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.DB || 'mongodb://127.0.0.1:27017/skincare_db';

// Reuse MongoDB connection between cold starts if possible.
const globalWithMongo = globalThis;
if (!globalWithMongo.__mongo_connect_promise) {
  globalWithMongo.__mongo_connect_promise = mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    family: 4
  });
}

try {
  await globalWithMongo.__mongo_connect_promise;
  console.log('Connected to MongoDB');
} catch (error) {
  console.error('MongoDB connection error:', error.message);
}

export default app;

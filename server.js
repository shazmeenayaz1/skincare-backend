import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGO_URI || process.env.DB || 'mongodb://127.0.0.1:27017/skincare_db';

// Helper to mask MongoDB URI password for security
const maskMongoUri = (uri) => {
  try {
    return uri.replace(/:([^:@]+)@/, ':******@');
  } catch (e) {
    return uri;
  }
};

console.log('==================================================');
console.log('Connecting to MongoDB...');
console.log(`Database URI: ${maskMongoUri(MONGODB_URI)}`);
console.log('==================================================');

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  family: 4 // Use IPv4, skip IPv6
})
  .then(() => {
    console.log('==================================================');
    console.log('🎉 Successfully connected to MongoDB!');
    console.log('==================================================');
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('==================================================');
    console.error('❌ Error connecting to MongoDB:', error.message);
    console.error('==================================================');
    process.exit(1);
  });


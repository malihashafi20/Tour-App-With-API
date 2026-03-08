 // db.js
import mongoose from 'mongoose';

const connectToMongo = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/myDBClass';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

export default connectToMongo;

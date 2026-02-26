import mongoose from 'mongoose';

// Connect to MongoDB database
export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/user-service';
    await mongoose.connect(mongoUri);
    console.log('User Service: MongoDB connected successfully');
  } catch (error) {
    console.error('User Service: MongoDB connection error:', error);
    process.exit(1);
  }
};


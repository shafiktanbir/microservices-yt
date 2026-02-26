import mongoose from 'mongoose';

// Connect to MongoDB database
export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-service';
    await mongoose.connect(mongoUri);
    console.log('Todo Service: MongoDB connected successfully');
  } catch (error) {
    console.error('Todo Service: MongoDB connection error:', error);
    process.exit(1);
  }
};


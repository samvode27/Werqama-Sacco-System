import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host} to DB: ${conn.connection.name}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB error:", error.message);
    setTimeout(connectDB, 5000); // retry after 5 sec
  }
};


export default connectDB;

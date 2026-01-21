import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:');
    console.error(error && error.message ? error.message : error);
    if (error && error.stack) console.error(error.stack);

    // Helpful developer hint for TLS/SSL failures
    if (error && /SSL|tls|certificate|TLS/.test(error.message || '')) {
      console.error('Possible causes: Atlas network IP whitelist blocking connections, TLS/SSL version mismatch, or corporate firewall performing TLS interception.');
      console.error('Check: 1) Network Access in MongoDB Atlas (allow your IP or 0.0.0.0/0 for testing). 2) That your connection string is correct (including database path). 3) That your environment can establish outbound TLS connections.');
    }

    process.exit(1);
  }
};

export default connectDB;

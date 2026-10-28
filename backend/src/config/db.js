const mongoose = require('mongoose');

/**
 * Connects to MongoDB database using Mongoose.
 * Supports:
 *  1. Remote MongoDB Atlas URI (mongodb+srv://...)
 *  2. Local MongoDB URI (mongodb://localhost:27017/job_tracker)
 *  3. In-memory MongoDB fallback when USE_MEMORY_DB=true or when local MongoDB is not running in dev
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/job_tracker';

  // Option to explicitly run with in-memory database for quick zero-setup demos
  if (process.env.USE_MEMORY_DB === 'true') {
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`📦 Connected to In-Memory MongoDB (${conn.connection.host})`);
      console.log('💡 Note: Running in zero-setup memory mode. Data resets when server restarts.');
      return;
    } catch (memErr) {
      console.warn('⚠️ Could not start in-memory MongoDB, attempting standard connection...');
    }
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000, // Quick timeout if local server is not running
    });
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ Could not connect to MongoDB at ${uri}: ${error.message}`);

    // If in development mode and local MongoDB is not running, fallback to MongoMemoryServer
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('🔄 Launching embedded In-Memory MongoDB for immediate local development...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const memoryUri = mongod.getUri();
        const conn = await mongoose.connect(memoryUri);
        console.log(`📦 Connected to In-Memory MongoDB (${conn.connection.host})`);
        console.log('✅ Local server is ready to use without needing MongoDB pre-installed!');
        return;
      } catch (fallbackError) {
        console.error('❌ In-Memory fallback failed:', fallbackError.message);
      }
    }

    console.error('\n======================================================');
    console.error('❌ MONGODB CONNECTION ERROR:');
    console.error('   Please ensure MongoDB is running locally or set');
    console.error('   a valid MONGODB_URI (e.g. MongoDB Atlas) in backend/.env');
    console.error('======================================================\n');
    process.exit(1);
  }
};

module.exports = connectDB;

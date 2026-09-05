import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  // If already connected, do not attempt to reconnect
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // If currently connecting, wait for it
  if (mongoose.connection.readyState === 2) {
    await new Promise<void>((resolve) => {
      mongoose.connection.once('connected', () => resolve());
    });
    return;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/memora_db';

  try {
    // Attempt connecting to the configured MongoDB URI with a 2-second timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`✅ MongoDB connected successfully to ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (err: any) {
    console.warn(`⚠️ Could not connect to primary MongoDB at ${uri}: ${err.message}`);
    console.log('🔄 Spinning up embedded in-memory MongoDB server for seamless zero-config local execution...');

    try {
      if (!mongoMemoryServer) {
        mongoMemoryServer = await MongoMemoryServer.create();
      }
      const memoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`✅ Embedded In-Memory MongoDB connected at ${memoryUri}`);
    } catch (memErr: any) {
      console.error('❌ Failed to connect to In-Memory MongoDB:', memErr);
      process.exit(1);
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
    mongoMemoryServer = null;
  }
};

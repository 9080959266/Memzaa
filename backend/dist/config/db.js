"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
let mongoMemoryServer = null;
const connectDB = async () => {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/memora_db';
    try {
        // Attempt connecting to the configured MongoDB URI with a short timeout
        await mongoose_1.default.connect(uri, {
            serverSelectionTimeoutMS: 2500,
        });
        console.log(`✅ MongoDB connected successfully to ${mongoose_1.default.connection.host}/${mongoose_1.default.connection.name}`);
    }
    catch (err) {
        console.warn(`⚠️ Could not connect to primary MongoDB at ${uri}: ${err.message}`);
        console.log('🔄 Spinning up embedded in-memory MongoDB server for seamless zero-config local execution...');
        try {
            mongoMemoryServer = await mongodb_memory_server_1.MongoMemoryServer.create();
            const memoryUri = mongoMemoryServer.getUri();
            await mongoose_1.default.connect(memoryUri);
            console.log(`✅ Embedded In-Memory MongoDB connected at ${memoryUri}`);
        }
        catch (memErr) {
            console.error('❌ Failed to connect to In-Memory MongoDB:', memErr);
            process.exit(1);
        }
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    await mongoose_1.default.disconnect();
    if (mongoMemoryServer) {
        await mongoMemoryServer.stop();
    }
};
exports.disconnectDB = disconnectDB;

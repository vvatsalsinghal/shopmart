// =============================================================================
// FILE: server/src/config/db.js
// PURPOSE: Centralized MongoDB connection manager using Mongoose ODM.
// MONGOOSE CONCEPT: Connection Pool & Asynchronous Lifecycle
// =============================================================================

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Ensure server/.env is loaded reliably regardless of current working directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * connectDB: Asynchronous function establishing connection to MongoDB.
 * Utilizes connection pooling for optimal network throughput.
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopmart';

    console.log(`📡 [Mongoose] Attempting connection to MongoDB...`);

    // MONGOOSE CONCEPT: mongoose.connect() returns a connection instance
    const conn = await mongoose.connect(mongoUri);

    console.log(`🍃 [MongoDB Connected Successfully] Host: ${conn.connection.host} | DB: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ [MongoDB Connection Error]: ${error.message}`);
    console.warn(`💡 TIP: Make sure your MongoDB service is running, or set a valid MONGO_URI in server/.env (e.g. MongoDB Atlas).`);
    return null;
  }
};

export default connectDB;

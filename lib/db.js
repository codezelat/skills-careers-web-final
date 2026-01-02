import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let cachedClient = null;
let cachedDb = null;
let connectionPromise = null;

export async function connectToDatabase() {
  // Return cached connection if available and connected
  if (cachedClient && cachedDb) {
    try {
      // Verify the connection is still alive
      await cachedClient.db().admin().ping();
      return cachedClient;
    } catch (error) {
      console.log("Cached connection lost, reconnecting...");
      cachedClient = null;
      cachedDb = null;
      connectionPromise = null;
    }
  }

  // If a connection is already in progress, wait for it
  if (connectionPromise) {
    return connectionPromise;
  }

  const options = {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    maxPoolSize: 10,
    minPoolSize: 2,
  };

  try {
    connectionPromise = MongoClient.connect(process.env.MONGODB_URI, options);
    const client = await connectionPromise;
    const db = client.db();

    // Cache the connection
    cachedClient = client;
    cachedDb = db;

    console.log("MongoDB connected successfully");
    return client;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    cachedClient = null;
    cachedDb = null;
    connectionPromise = null;
    throw error;
  }
}

import { MongoClient } from "mongodb";

let cachedClient = null;
let cachedDb = null;
let connectionPromise = null;

export async function connectToDatabase() {
  // Validate MongoDB URI
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }

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
    try {
      return await connectionPromise;
    } catch (error) {
      // Reset if the pending connection failed
      connectionPromise = null;
      throw error;
    }
  }

  const options = {
    serverSelectionTimeoutMS: 30000, // 30s for initial connection (especially for Atlas)
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000, // 30s to establish connection
    maxPoolSize: 10,
    minPoolSize: 2,
    retryWrites: true,
    retryReads: true,
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

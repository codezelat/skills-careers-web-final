import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  console.log('Testing MongoDB connection...');
  console.log('URI:', process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@'));
  
  const options = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    maxPoolSize: 10,
    minPoolSize: 2,
  };

  try {
    console.log('\nAttempting connection...');
    const client = await MongoClient.connect(process.env.MONGODB_URI, options);
    console.log('✓ Connected successfully!');
    
    const db = client.db();
    console.log('✓ Database name:', db.databaseName);
    
    const collections = await db.listCollections().toArray();
    console.log('✓ Collections:', collections.map(c => c.name).join(', '));
    
    await client.close();
    console.log('✓ Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Connection failed!');
    console.error('Error:', error.message);
    console.error('Name:', error.name);
    if (error.cause) {
      console.error('Cause:', error.cause);
    }
    process.exit(1);
  }
}

testConnection();

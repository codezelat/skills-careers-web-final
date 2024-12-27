// scripts/setup-elasticsearch.js
const { Client } = require("@elastic/elasticsearch");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const elasticClient = new Client({
  node: process.env.ELASTICSEARCH_URL,
  auth: {
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD,
  },
});

const mongoUri = process.env.MONGODB_URI;

// Define collection configurations
const collections = {
  recruiters: {
    indexName: "recruiters",
    mappings: {
      properties: {
        recruiterName: {
          type: "text",
          fields: { keyword: { type: "keyword" } },
        },
        email: { type: "text", fields: { keyword: { type: "keyword" } } },
      },
    },
    transform: (doc) => ({
      recruiterName: doc.recruiterName,
      email: doc.email,
    }),
  },
  jobseekers: {
    indexName: "jobseekers",
    mappings: {
      properties: {
        firstName: { type: "text", fields: { keyword: { type: "keyword" } } },
        lastName: { type: "text", fields: { keyword: { type: "keyword" } } },
        email: { type: "text", fields: { keyword: { type: "keyword" } } },
      },
    },
    transform: (doc) => ({
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
    }),
  },
  jobs: {
    indexName: "jobs",
    mappings: {
      properties: {
        jobTitle: { type: "text", fields: { keyword: { type: "keyword" } } },
        recruiterId: { type: "keyword" },
        location: { type: "text", fields: { keyword: { type: "keyword" } } },
      },
    },
    transform: (doc) => ({
      jobTitle: doc.title,
      recruiterId: doc.recruiterId,
      location: doc.location,
    }),
  },
  jobapplications: {
    indexName: "jobapplication",
    mappings: {
      properties: {
        jobId: { type: "keyword" },
        jobseekerId: { type: "keyword" },
        cvFileId: { type: "keyword" },
        status: { type: "keyword" },
      },
    },
    transform: (doc) => ({
      jobId: doc.jobId,
      jobseekerId: doc.jobseekerId,
      cvFileId: doc.status,
      status: doc.status,
    }),
  },
};

async function setupCollection(db, collectionName, config) {
  console.log(`\nProcessing ${collectionName}...`);

  // Fetch documents from MongoDB
  const documents = await db.collection(collectionName).find({}).toArray();
  console.log(
    `Found ${documents.length} documents in MongoDB collection: ${collectionName}`
  );

  // Check and delete existing index
  const indexExists = await elasticClient.indices.exists({
    index: config.indexName,
  });

  if (indexExists) {
    console.log(`Deleting existing index: ${config.indexName}...`);
    await elasticClient.indices.delete({ index: config.indexName });
  }

  // Create new index with mapping
  console.log(`Creating index: ${config.indexName}...`);
  await elasticClient.indices.create({
    index: config.indexName,
    body: {
      mappings: config.mappings,
    },
  });

  // Prepare data for bulk indexing
  const operations = documents.flatMap((doc) => [
    { index: { _index: config.indexName } },
    config.transform(doc),
  ]);

  if (operations.length > 0) {
    // Bulk index the data
    console.log(`Indexing data for ${collectionName}...`);
    const bulkResponse = await elasticClient.bulk({
      refresh: true,
      operations,
    });

    if (bulkResponse.errors) {
      console.error(`Bulk operation had errors for ${collectionName}`);
      console.error(bulkResponse.errors);
    } else {
      console.log(
        `Successfully indexed ${documents.length} documents for ${collectionName}`
      );
    }
  } else {
    console.log(`No data to index for ${collectionName}`);
  }

  // Verify the data
  const count = await elasticClient.count({ index: config.indexName });
  console.log(
    `Total documents in Elasticsearch index ${config.indexName}: ${count.count}`
  );
}

async function setupElasticsearch() {
  let mongoClient;
  try {
    console.log("Starting setup...");

    // Connect to MongoDB
    mongoClient = await MongoClient.connect(mongoUri);
    const db = mongoClient.db();
    console.log("Connected to MongoDB");

    // Process each collection
    for (const [collectionName, config] of Object.entries(collections)) {
      await setupCollection(db, collectionName, config);
    }

    console.log("\nSetup completed successfully!");
  } catch (error) {
    console.error("Setup failed:", error);
    console.error(error.stack);
  } finally {
    if (mongoClient) await mongoClient.close();
    await elasticClient.close();
  }
}

setupElasticsearch();

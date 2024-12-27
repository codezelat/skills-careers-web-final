// scripts/sync-elasticsearch.js
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

async function setupIndices() {
  for (const [collectionName, config] of Object.entries(collections)) {
    const indexExists = await elasticClient.indices.exists({
      index: config.indexName,
    });

    if (!indexExists) {
      console.log(`Creating index for ${collectionName}...`);
      await elasticClient.indices.create({
        index: config.indexName,
        body: {
          mappings: config.mappings,
        },
      });
    }
  }
}

async function handleChange(change, collectionName) {
  const config = collections[collectionName];
  if (!config) return;

  try {
    switch (change.operationType) {
      case "insert": {
        console.log(
          `Inserting new ${collectionName} document to Elasticsearch...`
        );
        await elasticClient.index({
          index: config.indexName,
          id: change.documentKey._id.toString(),
          document: config.transform(change.fullDocument),
          refresh: true,
        });
        break;
      }

      case "update": {
        console.log(`Updating ${collectionName} document in Elasticsearch...`);
        await elasticClient.update({
          index: config.indexName,
          id: change.documentKey._id.toString(),
          doc: config.transform(change.fullDocument),
          refresh: true,
        });
        break;
      }

      case "delete": {
        console.log(
          `Deleting ${collectionName} document from Elasticsearch...`
        );
        await elasticClient.delete({
          index: config.indexName,
          id: change.documentKey._id.toString(),
          refresh: true,
        });
        break;
      }
    }
  } catch (error) {
    console.error(`Error processing ${collectionName} change:`, error);
  }
}

async function syncElasticsearch() {
  let mongoClient;
  try {
    mongoClient = await MongoClient.connect(mongoUri);
    const db = mongoClient.db();
    console.log(
      "Connected to MongoDB, setting up indices and watching for changes..."
    );

    // Setup indices if they don't exist
    await setupIndices();

    // Watch all collections
    for (const collectionName of Object.keys(collections)) {
      const collection = db.collection(collectionName);

      const changeStream = collection.watch([
        {
          $match: {
            operationType: {
              $in: ["insert", "update", "delete"],
            },
          },
        },
      ]);

      changeStream.on("change", (change) =>
        handleChange(change, collectionName)
      );

      changeStream.on("error", (error) => {
        console.error(`Change stream error for ${collectionName}:`, error);
      });
    }

    // Handle graceful shutdown
    process.on("SIGINT", async () => {
      console.log("Closing connections...");
      await mongoClient.close();
      await elasticClient.close();
      process.exit();
    });
  } catch (error) {
    console.error("Sync setup failed:", error);
    if (mongoClient) await mongoClient.close();
    await elasticClient.close();
  }
}

// Start the sync process
syncElasticsearch();

// scripts/sync-elasticsearch.js
const { Client } = require("@elastic/elasticsearch");
const { MongoClient } = require("mongodb");
require("dotenv").config();

// const elasticClient = new Client({
//   node: process.env.ELASTICSEARCH_URL,
//   auth: {
//     username: process.env.ELASTIC_USERNAME,
//     password: process.env.ELASTIC_PASSWORD,
//   },
// });

const elasticClient = new Client({
  cloud: {
    id: process.env.ELASTIC_CLOUD_ID
  },
  auth: {
    apiKey: process.env.ELASTIC_API_KEY
  }
});

const mongoUri = process.env.MONGODB_URI;

// Define collection configurations
const collections = {
  recruiters: {
    indexName: "recruiters",
    mappings: {
      properties: {
        recruiterId: {
          type: "text",
          fields: { keyword: { type: "keyword" } },
        },
        recruiterName: {
          type: "text",
          fields: { keyword: { type: "keyword" } },
        },
        email: { type: "text", fields: { keyword: { type: "keyword" } } },
        employeeRange: {
          type: "text",
          fields: { keyword: { type: "keyword" } },
        },
        industry: { type: "text", fields: { keyword: { type: "keyword" } } },
        location: { type: "text", fields: { keyword: { type: "keyword" } } },
      },
    },
    transform: (doc) => ({
      recruiterId: doc._id.toString(),
      recruiterName: doc.recruiterName,
      email: doc.email,
      employeeRange: doc.employeeRange,
      industry: doc.industry,
      location: doc.location,
    }),
  },
  jobseekers: {
    indexName: "jobseekers",
    mappings: {
      properties: {
        jobseekerId: {
          type: "text",
          fields: { keyword: { type: "keyword" } },
        },
        email: { type: "text", fields: { keyword: { type: "keyword" } } },
      },
    },
    transform: (doc) => ({
      jobseekerId: doc._id.toString(),
      email: doc.email,
    }),
  },
  jobs: {
    indexName: "jobs",
    mappings: {
      properties: {
        jobId: {
          type: "text",
          fields: { keyword: { type: "keyword" } },
        },
        jobTitle: { type: "text", fields: { keyword: { type: "keyword" } } },
        recruiterId: { type: "keyword" },
        location: { type: "text", fields: { keyword: { type: "keyword" } } },
        jobCategory: {
          type: "text",
          fields: { keyword: { type: "keyword" } },
        },
        jobExperience: {
          type: "text",
          fields: { keyword: { type: "keyword" } },
        },
      },
    },
    transform: (doc) => ({
      jobId: doc._id.toString(),
      jobTitle: doc.jobTitle,
      recruiterId: doc.recruiterId,
      location: doc.location,
      jobCategory: doc.jobCategory,
      jobExperience: doc.jobExperience,
    }),
  },
  // jobapplications: {
  //   indexName: "jobapplication",
  //   mappings: {
  //     properties: {
  //       jobapplicationId: {
  //         type: "text",
  //         fields: { keyword: { type: "keyword" } },
  //       },
  //       jobId: { type: "keyword" },
  //       jobTitle: { type: "text", fields: { keyword: { type: "keyword" } } },
  //       jobseekerId: { type: "keyword" },
  //       firstName: { type: "text", fields: { keyword: { type: "keyword" } } },
  //       lastName: { type: "text", fields: { keyword: { type: "keyword" } } },
  //       email: { type: "text", fields: { keyword: { type: "keyword" } } },
  //       status: { type: "text", fields: { keyword: { type: "keyword" } } },
  //     },
  //   },
  //   transform: (doc) => ({
  //     jobapplicationId: doc._id.toString(),
  //     jobId: doc.jobId,
  //     jobTitle: doc.jobTitle,
  //     jobseekerId: doc.jobseekerId,
  //     firstName: doc.firstName,
  //     lastName: doc.lastName,
  //     email: doc.email,
  //     status: doc.status,
  //   }),
  // },
  pressreleases: {
    indexName: "pressrelease",
    mappings: {
      properties: {
        pressreleaseId: {
          type: "text",
          fields: { keyword: { type: "keyword" } },
        },
        title: { type: "keyword" },
      },
    },
    transform: (doc) => ({
      pressreleaseId: doc._id.toString(),
      title: doc.title,
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
              $in: ["insert"],
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

syncElasticsearch();

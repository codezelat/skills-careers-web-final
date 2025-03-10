// scripts/setup-elasticsearch.js
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
    id: process.env.ELASTIC_CLOUD_ID,
  },
  auth: {
    apiKey: process.env.ELASTIC_API_KEY,
  },
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
      contactNumber: doc.contactNumber,
      companyDescription: doc.companyDescription,
      industry: doc.industry,
      location: doc.location,
      logo: doc.logo,
      createdAt: doc.createdAt,
      facebook: doc.facebook,
      instagram: doc.instagram,
      linkedin: doc.linkedin,
      x: doc.x,
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
        createdAt: { type: "date" },
        jobTypes: { type: "text", fields: { keyword: { type: "keyword" } } },
        shortDescription: { type: "text" },
      },
    },
    transform: (doc) => ({
      jobId: doc._id.toString(),
      jobTitle: doc.jobTitle,
      recruiterId: doc.recruiterId,
      location: doc.location,
      jobCategory: doc.jobCategory,
      jobExperience: doc.jobExperience,
      createdAt: doc.createdAt,
      jobTypes: doc.jobTypes,
      shortDescription: doc.shortDescription,
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

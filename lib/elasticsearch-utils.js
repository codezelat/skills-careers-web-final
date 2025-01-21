// lib/elasticsearch-utils.js
const { Client } = require("@elastic/elasticsearch");
require("dotenv").config();

const elasticClient = new Client({
  node: process.env.ELASTICSEARCH_URL,
  auth: {
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD,
  },
});

// Function to reindex a single collection
async function reindexCollection(db, collectionName) {
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
        },
      },
      transform: (doc) => ({
        recruiterId: doc._id.toString(),
        recruiterName: doc.recruiterName,
        email: doc.email,
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
        },
      },
      transform: (doc) => ({
        jobId: doc._id.toString(),
        jobTitle: doc.title,
        recruiterId: doc.recruiterId,
        location: doc.location,
        jobCategory: doc.jobCategory,
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

  const config = collections[collectionName];
  if (!config) {
    throw new Error(`Collection ${collectionName} not configured`);
  }

  try {
    // Fetch all documents for this collection
    const documents = await db.collection(collectionName).find({}).toArray();
    console.log(`Found ${documents.length} documents in ${collectionName}`);

    // Delete existing index
    const indexExists = await elasticClient.indices.exists({
      index: config.indexName,
    });

    if (indexExists) {
      await elasticClient.indices.delete({ index: config.indexName });
      console.log(`Deleted existing index: ${config.indexName}`);
    }

    // Create new index with mapping
    await elasticClient.indices.create({
      index: config.indexName,
      body: {
        mappings: config.mappings,
      },
    });
    console.log(`Created new index: ${config.indexName}`);

    // Bulk index documents
    if (documents.length > 0) {
      const operations = documents.flatMap((doc) => [
        { index: { _index: config.indexName } },
        config.transform(doc),
      ]);

      const bulkResponse = await elasticClient.bulk({
        refresh: true,
        operations,
      });

      if (bulkResponse.errors) {
        throw new Error(`Bulk indexing failed for ${collectionName}`);
      }

      console.log(`Indexed ${documents.length} documents in ${collectionName}`);
    }

    return true;
  } catch (error) {
    console.error(`Error reindexing ${collectionName}:`, error);
    throw error;
  }
}

module.exports = {
  reindexCollection,
  elasticClient,
};

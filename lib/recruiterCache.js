// In-memory cache for recruiter details
const recruiterCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Batch fetching queue
let batchQueue = [];
let batchTimeout = null;
const BATCH_DELAY = 50; // ms to wait before processing batch

/**
 * Get recruiter details with caching and automatic batching
 */
export async function getRecruiterDetails(recruiterId) {
  if (!recruiterId) return null;

  // Check cache first
  const cached = recruiterCache.get(recruiterId);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  // Return a promise that will be resolved when the batch completes
  return new Promise((resolve, reject) => {
    batchQueue.push({ recruiterId, resolve, reject });

    // Clear existing timeout
    if (batchTimeout) {
      clearTimeout(batchTimeout);
    }

    // Set new timeout to process batch
    batchTimeout = setTimeout(async () => {
      await processBatch();
    }, BATCH_DELAY);
  });
}

/**
 * Process the batch queue
 */
async function processBatch() {
  if (batchQueue.length === 0) return;

  const currentBatch = [...batchQueue];
  batchQueue = [];

  // Get unique IDs
  const uniqueIds = [...new Set(currentBatch.map((item) => item.recruiterId))];

  try {
    // Fetch in batch
    const response = await fetch("/api/recruiterdetails/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: uniqueIds }),
    });

    if (!response.ok) {
      throw new Error("Batch fetch failed");
    }

    const { recruiters } = await response.json();

    // Update cache and resolve promises
    currentBatch.forEach(({ recruiterId, resolve }) => {
      const recruiterData = recruiters[recruiterId] || {
        industry: "Unknown",
        recruiterName: "Unknown",
        logo: "/images/default-image.jpg",
      };

      // Cache the result
      recruiterCache.set(recruiterId, {
        data: recruiterData,
        timestamp: Date.now(),
      });

      resolve(recruiterData);
    });
  } catch (error) {
    console.error("Error in batch processing:", error);

    // Reject all promises in the batch
    currentBatch.forEach(({ reject }) => {
      reject(error);
    });
  }
}

/**
 * Clear the cache (useful for testing or forced refresh)
 */
export function clearRecruiterCache() {
  recruiterCache.clear();
}

/**
 * Prefetch multiple recruiter details
 */
export async function prefetchRecruiters(recruiterIds) {
  if (!recruiterIds || recruiterIds.length === 0) return;

  try {
    const response = await fetch("/api/recruiterdetails/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: recruiterIds }),
    });

    if (!response.ok) return;

    const { recruiters } = await response.json();

    // Update cache
    Object.entries(recruiters).forEach(([id, data]) => {
      recruiterCache.set(id, {
        data,
        timestamp: Date.now(),
      });
    });
  } catch (error) {
    console.error("Error prefetching recruiters:", error);
  }
}

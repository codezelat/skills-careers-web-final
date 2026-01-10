/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "licdn.com",
        pathname: "**",
      },
    ],
    qualities: [75, 100],
    formats: ["image/webp"], // Modern WebP format for better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Configure external packages for server components
  serverExternalPackages: ["mongodb"],
  // Configure build output
  // output: "standalone",
  // Add timeout configuration
  staticPageGenerationTimeout: 180,
  // Enable modern optimizations
  experimental: {
    optimizePackageImports: ["@mui/icons-material", "react-icons"],
  },
  // Compress output
  compress: true,
  // Generate ETags for better caching
  generateEtags: true,
  // Power optimization
  poweredByHeader: false,
};

export default nextConfig;

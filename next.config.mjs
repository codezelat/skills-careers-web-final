/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "lh3.googleusercontent.com", "flagcdn.com", "media.licdn.com", "licdn.com"], // Add Google and LinkedIn domains
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
  },
  // Configure external packages for server components
  serverExternalPackages: ["mongodb"],
  // Configure build output
  output: "standalone",
  // Add timeout configuration
  staticPageGenerationTimeout: 180, // Increase timeout to 3 minutes
};

export default nextConfig;

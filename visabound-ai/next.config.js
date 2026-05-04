/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ["10.10.235.36"],
    turbopack: {
      root: process.cwd(),
    },
  };
  
  module.exports = nextConfig;
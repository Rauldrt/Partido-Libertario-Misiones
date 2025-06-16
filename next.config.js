/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'i.pinimg.com',
      // Add other hostnames here if needed
      'encrypted-tbn0.gstatic.com',
      'placehold.co',
      'www.shutterstock.com',
    ],
  },
};

module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000"
      },
      {
        hostname: "images.unsplash.com"
        //in my case i used cdn.pixabay.com
      }
    ]
  }
}

export default nextConfig;
// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BE_URL: process.env.BE_URL
  }
}

module.exports = nextConfig
